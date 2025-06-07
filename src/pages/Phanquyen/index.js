import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import styles from './Phanquyen.module.scss';
import DoiVaiTro from './DoiVaiTro';
import userService from '~/services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';

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

    const handleSaveRoleChange = async (userid, maVaiTro) => {
        try {
            const response = await userService.changeRoleService(userid, maVaiTro);
            if (response?.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await getAllUser();
                setShowRoleDialog(false);
            }
        } catch (error) {
            console.log('Lỗi khi đổi quyền người dùng:', error);
        }
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
                        placeholder="Tìm kiếm"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={cx('input')}
                    />
                </div>
                <button className={cx('btn', 'btn-refresh')}>
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
                                <td colSpan="6" className={cx('loading-row')}>
                                    <div className={cx('loading-container')}>
                                        <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner} />
                                        <span>Đang tải dữ liệu...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : currentUsers?.length > 0 ? (
                            currentUsers.map((item, index) => (
                                <tr key={index} className={cx('table-row')}>
                                    <td className={cx('cell', 'stt')}>{indexOfFirstItem + index + 1}</td>
                                    <td className={cx('cell', 'name')}>{item.hoTen}</td>
                                    <td className={cx('cell', 'role')}>{item.tenVaiTro}</td>
                                    <td className={cx('cell', 'permission')}>
                                        <ul className={cx('permission-list')}>
                                            <li>- {item.Quyen}</li>
                                        </ul>
                                    </td>

                                    <td className={cx('cell', 'actions')}>
                                        <button className={cx('btn-action')} onClick={() => handleOpenRoleDialog(item)}>
                                            Đổi vai trò
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className={cx('no-data')}>
                                    Không có dữ liệu
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
                            className={cx('pagination-btn', { active: currentPage === index + 1 })}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            )}

            {showRoleDialog && (
                <DoiVaiTro
                    onClose={() => setShowRoleDialog(false)}
                    onSave={handleSaveRoleChange}
                    accountData={currentAccount}
                />
            )}
        </div>
    );
}

export default Phanquyen;
