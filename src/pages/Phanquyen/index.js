import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import styles from './Phanquyen.module.scss';
import DoiVaiTro from './DoiVaiTro';
import userService from '~/services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const ROLES = [
    '-- Tất cả --',
    'Ban Giám Hiệu',
    'Hội Đồng Trường',
    'Phòng Tổ Chức - Hành Chính',
    'Phòng Đào Tạo',
    'Phòng Công Tác Sinh Viên',
];

const SORT_OPTIONS = ['Số thứ tự', 'Họ và tên'];

function Phanquyen() {
    const [searchTerm, setSearchTerm] = useState('');
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [listUser, setListUser] = useState([]);
    const [filters, setFilters] = useState({
        role: '-- Tất cả --',
        sort: 'Số thứ tự',
    });
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentAccount, setCurrentAccount] = useState(null);

    // Thêm state cho hiệu ứng UX
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
    const [updatedUserName, setUpdatedUserName] = useState('');

    const itemsPerPage = 2;

    const getAllUser = async () => {
        try {
            const response = await userService.getAllRoleUsersService('ALL');
            if (response?.errCode === 0) {
                setListUser(response.users);
                setFilteredData(response.users);
                setIsSearching(false);
                setIsInitialLoad(false);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng:', error);
            setIsSearching(false);
        }
    };

    const handleFilterData = () => {
        const filtered = listUser
            .filter((user) => {
                const matchRole = filters.role === '-- Tất cả --' || user.tenVaiTro === filters.role;
                const keyword = searchTerm.toLowerCase();
                const matchSearch = ['hoTen', 'tenVaiTro', 'quyen'].some((field) =>
                    user[field]?.toLowerCase().includes(keyword),
                );
                return matchRole && matchSearch;
            })
            .sort((a, b) => {
                const sortMap = {
                    'Họ và tên': 'hoTen',
                };
                const field = sortMap[filters.sort];
                return field ? a[field].localeCompare(b[field]) : 0;
            });

        setFilteredData(filtered);
        setIsSearching(false);
    };

    useEffect(() => {
        if (isInitialLoad) return;
        const delayDebounce = setTimeout(handleFilterData, 800);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, filters.role, filters.sort]);

    useEffect(() => {
        setIsSearching(true);
        getAllUser();
    }, []);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setIsSearching(true);
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setIsSearching(true);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        if (searchTerm) {
            setSearchTerm('');
            setIsSearching(true);
            setCurrentPage(1);
        }
    };

    const handleOpenRoleDialog = (account) => {
        setCurrentAccount(account);
        setShowRoleDialog(true);
    };

    // Cải tiến hàm xử lý đổi role với hiệu ứng UX
    const handleSaveRoleChange = async (userId, maVaiTro) => {
        try {
            setIsUpdatingRole(true);
            setUpdatedUserName(currentAccount?.hoTen || '');

            const response = await userService.changeRoleService(userId, maVaiTro);

            if (response?.errCode !== 0) {
                alert(response.errMessage);
                setIsUpdatingRole(false);
                return;
            }

            // Delay để hiển thị hiệu ứng loading
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setIsUpdatingRole(false);
            setShowRoleDialog(false);

            // Hiển thị hiệu ứng thành công
            setShowSuccessOverlay(true);

            // Cập nhật dữ liệu ngầm
            await getAllUser();

            // Ẩn hiệu ứng thành công sau 2.5 giây
            setTimeout(() => {
                setShowSuccessOverlay(false);
                setUpdatedUserName('');
            }, 2500);
        } catch (error) {
            console.log('Lỗi khi đổi vai trò:', error);
            setIsUpdatingRole(false);
            alert('Có lỗi xảy ra khi cập nhật vai trò. Vui lòng thử lại!');
        }
    };

    const handleRefresh = async () => {
        setIsSearching(true);
        setSearchTerm('');
        setFilters({
            role: '-- Tất cả --',
            sort: 'Số thứ tự',
        });
        setCurrentPage(1);
        await getAllUser();
    };

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const renderSelect = (options, value, onChange) => (
        <select className={cx('filter-select')} value={value} onChange={onChange}>
            {options.map((option, idx) => (
                <option key={idx} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );

    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>Phân quyền tài khoản</h1>

            <div className={cx('search-section')}>
                <div className={cx('search-input')}>
                    <i className={cx('search-icon')}>🔍</i>
                    {searchTerm && (
                        <div className={cx('icon-wrapper')} onClick={handleClearSearch}>
                            <FontAwesomeIcon
                                className={cx(isSearching ? 'loading' : 'clear')}
                                icon={isSearching ? faSpinner : faCircleXmark}
                            />
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, vai trò, quyền..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={cx('input')}
                        disabled={isUpdatingRole}
                    />
                </div>
                <button
                    className={cx('btn', 'btn-refresh')}
                    onClick={handleRefresh}
                    disabled={isSearching || isUpdatingRole}
                >
                    <span>🔄</span> Làm mới
                </button>
            </div>

            <div className={cx('filter-section')}>
                <div className={cx('filter-group')}>
                    <label className={cx('filter-label')}>Lọc theo quyền:</label>
                    {renderSelect(ROLES, filters.role, (e) => handleFilterChange('role', e.target.value))}
                </div>
                <div className={cx('filter-group')}>
                    <label className={cx('filter-label')}>Lọc theo ngày vào làm:</label>
                    <div className={cx('date-wrapper')}>
                        <input type="date" placeholder="mm/dd/yyyy" className={cx('filter-date')} />
                        <i className={cx('calendar-icon')}>📅</i>
                    </div>
                </div>
            </div>

            <div className={cx('sort-section')}>
                {renderSelect(SORT_OPTIONS, filters.sort, (e) => handleFilterChange('sort', e.target.value))}
            </div>

            <div className={cx('table-container')}>
                <table className={cx('table')}>
                    <thead className={cx('table-header')}>
                        <tr>
                            {[
                                { label: 'STT', class: 'stt' },
                                { label: 'Họ và tên', class: 'name' },
                                { label: 'Vai trò', class: 'role' },
                                { label: 'Quyền', class: 'permission' },
                                { label: 'Hành động', class: 'actions' },
                            ].map((header) => (
                                <th key={header.label} className={cx('header-cell', header.class)}>
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isSearching ? (
                            <tr>
                                <td colSpan="5" className={cx('loading-row')}>
                                    <div className={cx('loading-container')}>
                                        <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner} />
                                        <span>Đang tải dữ liệu...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : currentUsers?.length > 0 ? (
                            currentUsers.map((item, index) => (
                                <tr key={item.id || index} className={cx('table-row')}>
                                    <td className={cx('cell', 'stt')}>{indexOfFirstItem + index + 1}</td>
                                    <td className={cx('cell', 'name')}>{item.hoTen}</td>
                                    <td className={cx('cell', 'role')}>{item.tenVaiTro}</td>
                                    <td className={cx('cell', 'permission')}>
                                        <ul className={cx('permission-list')}>
                                            <li>- {item.Quyen}</li>
                                        </ul>
                                    </td>
                                    <td className={cx('cell', 'actions')}>
                                        <button
                                            className={cx('btn-action', {
                                                'btn-disabled': isUpdatingRole,
                                            })}
                                            onClick={() => handleOpenRoleDialog(item)}
                                            disabled={isUpdatingRole}
                                        >
                                            {isUpdatingRole ? 'Đang xử lý...' : 'Đổi vai trò'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className={cx('no-data')}>
                                    {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Không có dữ liệu'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {!isSearching && totalPages > 0 && (
                <div className={cx('pagination')}>
                    {[...Array(totalPages)].map((_, index) => (
                        <div
                            key={index}
                            className={cx('pagination-btn', {
                                active: currentPage === index + 1,
                                disabled: isUpdatingRole,
                            })}
                            onClick={() => !isUpdatingRole && setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            )}

            {/* Loading Overlay khi đang cập nhật role */}
            {isUpdatingRole && (
                <div className={cx('overlay')}>
                    <div className={cx('loading-modal')}>
                        <div className={cx('spinner-container')}>
                            <FontAwesomeIcon className={cx('spinner-large')} icon={faSpinner} />
                        </div>
                        <p className={cx('loading-text')}>Đang cập nhật vai trò...</p>
                        <p className={cx('loading-subtext')}>Vui lòng đợi trong giây lát</p>
                    </div>
                </div>
            )}

            {/* Success Overlay với hiệu ứng đẹp */}
            {showSuccessOverlay && (
                <div className={cx('overlay', 'success-overlay')}>
                    <div className={cx('success-modal')}>
                        <div className={cx('success-animation')}>
                            <div className={cx('success-circle')}>
                                <FontAwesomeIcon className={cx('success-icon')} icon={faCheck} />
                            </div>
                            <div className={cx('success-ripple')}></div>
                            <div className={cx('success-ripple', 'delay-1')}></div>
                            <div className={cx('success-ripple', 'delay-2')}></div>
                        </div>
                        <div className={cx('success-content')}>
                            <h3 className={cx('success-title')}>Cập nhật thành công!</h3>
                            <p className={cx('success-message')}>
                                Vai trò của <strong>{updatedUserName}</strong> đã được cập nhật
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {showRoleDialog && (
                <DoiVaiTro
                    onClose={() => !isUpdatingRole && setShowRoleDialog(false)}
                    onSave={handleSaveRoleChange}
                    accountData={currentAccount}
                    isLoading={isUpdatingRole}
                />
            )}
        </div>
    );
}

export default Phanquyen;
