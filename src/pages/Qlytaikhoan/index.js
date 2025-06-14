import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Qlytaikhoan.module.scss';
import Themtaikhoan from './Themtaikhoan';
import Chinhsuataikhoan from './Chinhsuataikhoan';
import Xemchitiettaikhoan from './Xemchitiettaikhoan';
import Xacnhanxoa from './Xacnhanxoa';
import userService from '~/services/userService';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

const UNITS = [
    '-- Tất cả --',
    'Ban Giám Hiệu',
    'Hội Đồng Trường',
    'Phòng Tổ Chức - Hành Chính',
    'Phòng Đào Tạo',
    'Phòng Công Tác Sinh Viên',
    'Phòng QLKH Và HTQT',
    'Phòng Kế Hoạch - Tài Chính',
    'Phòng Khảo Thí Và ĐBCLGD',
    'Phòng Cơ Sở Vật Chất',
    'Khoa Cơ Khí',
    'Khoa Điện - Điện Tử',
    'Khoa Kỹ Thuật Xây Dựng',
    'Khoa CN Hóa - Môi Trường',
    'Khoa Sư Phạm CN',
    'Khoa Công Nghệ Số',
    'Tổ Thanh Tra - Pháp Chế',
    'Trung Tâm Học Liệu Và Truyền Thông',
    'Đảng Ủy',
    'Công Đoàn',
    'Tổ CNTT',
    'Đoàn TN - Hội SV',
    'Trung Tâm NC & TK TBN',
    'Trung Tâm ĐT, BD Và TVKTCN',
    'Trung Tâm HTSV & QH DN',
    'Hội Cựu Chiến Binh',
    'Hội Cựu Giáo Chức',
    'Hội Cựu Sinh Viên',
    'Hội Ái Hữu Cựu GV Và HS KT DN',
];

const STATES = ['-- Tất cả trạng thái --', 'Hoạt động', 'Khóa'];
const SORT_OPTIONS = ['Số thứ tự', 'Họ và tên', 'Chức vụ', 'Đơn vị công tác'];

function Qlytaikhoan() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [listUser, setListUser] = useState([]);
    const [modals, setModals] = useState({
        add: false,
        edit: false,
        view: false,
        delete: false,
    });
    const [currentAccount, setCurrentAccount] = useState(null);
    const [filters, setFilters] = useState({
        unit: '-- Tất cả --',
        state: '-- Tất cả trạng thái --',
        sort: 'Số thứ tự',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const itemsPerPage = 5;

    const getAllUser = async () => {
        try {
            const response = await userService.getAllUsersService('ALL');
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
                const matchUnit = filters.unit === '-- Tất cả --' || user.donViCongTac === filters.unit;
                const matchState = filters.state === '-- Tất cả trạng thái --' || user.trangThai === filters.state;
                const keyword = searchTerm.toLowerCase();
                const matchSearch = ['hoTen', 'chucVu', 'donViCongTac', 'email'].some((field) =>
                    user[field]?.toLowerCase().includes(keyword),
                );
                return matchUnit && matchState && matchSearch;
            })
            .sort((a, b) => {
                const sortMap = {
                    'Họ và tên': 'hoTen',
                    'Chức vụ': 'chucVu',
                    'Đơn vị công tác': 'donViCongTac',
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
    }, [searchTerm, filters.unit, filters.state, filters.sort]);

    useEffect(() => {
        setIsSearching(true);
        getAllUser();
    }, []);

    const handleModalAction = (type, account = null) => {
        setCurrentAccount(account);
        setModals((prev) => ({ ...prev, [type]: !prev[type] }));
    };

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

    const createNewUser = async (data) => {
        try {
            const response = await userService.createNewUserService(data);
            if (response?.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await getAllUser();
                handleModalAction('add');
            }
        } catch (error) {
            console.log('Lỗi khi tạo tài khoản mới:', error);
        }
    };

    const editUser = async (data) => {
        try {
            const response = await userService.editUserService(data);
            if (response?.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await getAllUser();
                handleModalAction('edit');
            }
        } catch (error) {
            console.log('Lỗi khi sửa tài khoản:', error);
        }
    };

    const confirmDeleteAccount = async (user) => {
        try {
            const res = await userService.deleteUserService(user.id);
            if (res?.errCode === 0) {
                await getAllUser();
                handleModalAction('delete');
            } else {
                alert(res.errMessage);
            }
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
        }
    };

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const renderSelect = (options, value, onChange, placeholder) => (
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
            <h1 className={cx('title')}>Quản lý tài khoản</h1>

            <div className={cx('search-bar')}>
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
                <button className={cx('btn', 'btn-filter')}>
                    <span>🔍</span> Bộ lọc nâng cao
                </button>
                <button className={cx('btn', 'btn-add')} onClick={() => handleModalAction('add')}>
                    <span>➕</span> Thêm tài khoản mới
                </button>
            </div>

            <div className={cx('filter-section')}>
                <div className={cx('filter-group')}>
                    <label className={cx('filter-label')}>Lọc theo đơn vị công tác:</label>
                    {renderSelect(UNITS, filters.unit, (e) => handleFilterChange('unit', e.target.value))}
                </div>
                <div className={cx('filter-group')}>
                    <label className={cx('filter-label')}>Lọc theo trạng thái</label>
                    {renderSelect(STATES, filters.state, (e) => handleFilterChange('state', e.target.value))}
                </div>
            </div>

            <div className={cx('sort-section')}>
                {renderSelect(SORT_OPTIONS, filters.sort, (e) => handleFilterChange('sort', e.target.value))}
            </div>

            <table className={cx('table')}>
                <thead className={cx('table-header')}>
                    <tr>
                        {['STT', 'Họ và tên', 'Chức vụ', 'Đơn vị công tác', 'Email', 'Hành động'].map((header) => (
                            <th key={header} className={cx('header-cell')}>
                                {header}
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
                                <td className={cx('cell')}>{indexOfFirstItem + index + 1}</td>
                                <td className={cx('cell')}>{item.hoTen}</td>
                                <td className={cx('cell')}>{item.chucVu}</td>
                                <td className={cx('cell')}>{item.donViCongTac}</td>
                                <td className={cx('cell')}>{item.email}</td>
                                <td className={cx('cell')}>
                                    <div className={cx('action-buttons')}>
                                        <button
                                            className={cx('btn-edit')}
                                            onClick={() => handleModalAction('edit', item)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className={cx('btn-delete')}
                                            onClick={() => handleModalAction('delete', item)}
                                        >
                                            Xóa
                                        </button>
                                        <button
                                            className={cx('btn-view')}
                                            onClick={() => handleModalAction('view', item)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
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

            {modals.add && <Themtaikhoan onClose={() => handleModalAction('add')} createNewUser={createNewUser} />}
            {modals.edit && (
                <Chinhsuataikhoan
                    onClose={() => handleModalAction('edit')}
                    editUser={editUser}
                    accountData={currentAccount}
                />
            )}
            {modals.view && (
                <Xemchitiettaikhoan onClose={() => handleModalAction('view')} accountData={currentAccount} />
            )}
            {modals.delete && (
                <Xacnhanxoa
                    onClose={() => handleModalAction('delete')}
                    onConfirm={confirmDeleteAccount}
                    accountData={currentAccount}
                />
            )}
        </div>
    );
}

export default Qlytaikhoan;
