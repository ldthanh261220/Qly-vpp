import { useState, useEffect, use } from 'react';
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

function Qlytaikhoan() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [listUser, setListUser] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);
    const [selectedUnit, setSelectedUnit] = useState('-- Tất cả --');
    const [selectedState, setSelectedState] = useState('-- Tất cả trạng thái --');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('Số thứ tự');
    const [filteredData, setFilteredData] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const itemsPerPage = 5;

    useEffect(() => {
        if (isInitialLoad) return; // Không làm gì nếu đang tải lần đầu

        const delayDebounce = setTimeout(() => {
            handleFilterData();
        }, 800);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, selectedUnit, selectedState, sortOption]);

    const handleFilterData = () => {
        const filtered = listUser
            .filter((user) => {
                const matchUnit = selectedUnit === '-- Tất cả --' || user.donViCongTac === selectedUnit;
                const matchState = selectedState === '-- Tất cả trạng thái --' || user.trangThai === selectedState;

                const keyword = searchTerm.toLowerCase();
                const matchSearch =
                    user.hoTen?.toLowerCase().includes(keyword) ||
                    user.chucVu?.toLowerCase().includes(keyword) ||
                    user.donViCongTac?.toLowerCase().includes(keyword) ||
                    user.email?.toLowerCase().includes(keyword);

                return matchUnit && matchState && matchSearch;
            })
            .sort((a, b) => {
                switch (sortOption) {
                    case 'Họ và tên':
                        return a.hoTen.localeCompare(b.hoTen);
                    case 'Chức vụ':
                        return a.chucVu.localeCompare(b.chucVu);
                    case 'Đơn vị công tác':
                        return a.donViCongTac.localeCompare(b.donViCongTac);
                    default:
                        return 0;
                }
            });

        setFilteredData(filtered);
        setIsSearching(false);
    };

    // Tính toán chỉ số bắt đầu và kết thúc của bản ghi trên trang hiện tại
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Tổng số trang
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    // Chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAddAccount = () => {
        setShowAddModal(true);
    };

    const handleEditAccount = (account) => {
        setCurrentAccount(account);
        setShowEditModal(true);
    };

    const handleViewAccount = (account) => {
        setCurrentAccount(account);
        setShowViewModal(true);
    };

    const handleDeleteAccount = (account) => {
        setCurrentAccount(account);
        setShowDeleteModal(true);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setIsSearching(true);
        // Khi người dùng gõ, thiết lập lại trang hiện tại
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        if (searchTerm) {
            setSearchTerm('');
            setIsSearching(true);
            setCurrentPage(1);
        }
    };

    const confirmDeleteAccount = async (user) => {
        try {
            let res = await userService.deleteUserService(user.id);
            if (res && res.errCode === 0) {
                await getAllUser();
                setShowDeleteModal(false);
            } else {
                alert(res.errMessage);
            }
        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
        }
    };

    const handleCloseModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
    };

    const Didmount = async () => {
        // Indicate that we're loading data
        setIsSearching(true);
        await getAllUser();
    };
    const createNewUser = async (data) => {
        try {
            let respone = await userService.createNewUserService(data);
            if (respone && respone.errCode !== 0) {
                alert(respone.errMessage);
            } else {
                await getAllUser();
                setShowAddModal(false);
            }
        } catch (error) {
            console.log('Lỗi khi tạo tài khoản mới:', error);
        }
    };
    useEffect(() => {
        Didmount();
        // Set initial loading state to show we're fetching data
        setIsSearching(true);
    }, []);
    const getAllUser = async () => {
        try {
            let response = await userService.getAllUsersService('ALL');
            if (response && response.errCode === 0) {
                setListUser(response.users);
                setFilteredData(response.users);
                setIsSearching(false);
                setIsInitialLoad(false); // <- Thêm dòng này
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng:', error);
        }
    };

    const editUser = async (data) => {
        try {
            let respone = await userService.editUserService(data);
            if (respone && respone.errCode !== 0) {
                alert(respone.errMessage);
            } else {
                await getAllUser();
                setShowEditModal(false);
            }
        } catch (error) {
            console.log('Lỗi khi sửa tài khoản:', error);
        }
    };

    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>Quản lý tài khoản</h1>

            <div className={cx('search-bar')}>
                <div className={cx('search-input')}>
                    <i className={cx('search-icon')}>🔍</i>

                    {searchTerm && (
                        <div className={cx('icon-wrapper')} onClick={handleClearSearch}>
                            {isSearching ? (
                                <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />
                            ) : (
                                <FontAwesomeIcon className={cx('clear')} icon={faCircleXmark} />
                            )}
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
                <button className={cx('btn', 'btn-add')} onClick={handleAddAccount}>
                    <span>➕</span> Thêm tài khoản mới
                </button>
            </div>

            <div className={cx('filter-section')}>
                <div className={cx('filter-group')}>
                    <label className={cx('filter-label')}>Lọc theo đơn vị công tác:</label>
                    <select
                        className={cx('filter-select')}
                        value={selectedUnit}
                        onChange={(e) => {
                            setSelectedUnit(e.target.value);
                            setIsSearching(true);
                            setCurrentPage(1);
                        }}
                    >
                        <option>-- Tất cả --</option>
                        <option>Ban Giám Hiệu</option>
                        <option>Hội Đồng Trường</option>
                        <option>Phòng Tổ Chức - Hành Chính</option>
                        <option>Phòng Đào Tạo</option>
                        <option>Phòng Công Tác Sinh Viên</option>
                        <option>Phòng QLKH Và HTQT</option>
                        <option>Phòng Kế Hoạch - Tài Chính</option>
                        <option>Phòng Khảo Thí Và ĐBCLGD</option>
                        <option>Phòng Cơ Sở Vật Chất</option>
                        <option>Khoa Cơ Khí</option>
                        <option>Khoa Điện - Điện Tử</option>
                        <option>Khoa Kỹ Thuật Xây Dựng</option>
                        <option>Khoa CN Hóa - Môi Trường</option>
                        <option>Khoa Sư Phạm CN</option>
                        <option>Khoa Công Nghệ Số</option>
                        <option>Tổ Thanh Tra - Pháp Chế</option>
                        <option>Trung Tâm Học Liệu Và Truyền Thông</option>
                        <option>Đảng Ủy</option>
                        <option>Công Đoàn</option>
                        <option>Tổ CNTT</option>
                        <option>Đoàn TN - Hội SV</option>
                        <option>Trung Tâm NC & TK TBN</option>
                        <option>Trung Tâm ĐT, BD Và TVKTCN</option>
                        <option>Trung Tâm HTSV & QH DN</option>
                        <option>Hội Cựu Chiến Binh</option>
                        <option>Hội Cựu Giáo Chức</option>
                        <option>Hội Cựu Sinh Viên</option>
                        <option>Hội Ái Hữu Cựu GV Và HS KT DN</option>
                    </select>
                </div>
                <div className={cx('filter-group')}>
                    <label className={cx('filter-label')}>Lọc theo trạng thái</label>
                    <select
                        className={cx('filter-select')}
                        value={selectedState}
                        onChange={(e) => {
                            setSelectedState(e.target.value);
                            setIsSearching(true);
                            setCurrentPage(1);
                        }}
                    >
                        <option>-- Tất cả trạng thái --</option>
                        <option>Hoạt động</option>
                        <option>Khóa</option>
                    </select>
                </div>
            </div>

            <div className={cx('sort-section')}>
                <select
                    className={cx('sort-dropdown')}
                    value={sortOption}
                    onChange={(e) => {
                        setSortOption(e.target.value);
                        setIsSearching(true);
                    }}
                >
                    <option>Số thứ tự</option>
                    <option>Họ và tên</option>
                    <option>Chức vụ</option>
                    <option>Đơn vị công tác</option>
                </select>
            </div>

            <table className={cx('table')}>
                <thead className={cx('table-header')}>
                    <tr>
                        <th className={cx('header-cell')}>STT</th>
                        <th className={cx('header-cell')}>Họ và tên</th>
                        <th className={cx('header-cell')}>Chức vụ</th>
                        <th className={cx('header-cell')}>Đơn vị công tác</th>
                        <th className={cx('header-cell')}>Email</th>
                        <th className={cx('header-cell')}>Hành động</th>
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
                    ) : currentUsers && currentUsers.length > 0 ? (
                        currentUsers.map((item, index) => {
                            return (
                                <tr key={index} className={cx('table-row')}>
                                    <td className={cx('cell')}>{indexOfFirstItem + index + 1}</td>
                                    <td className={cx('cell')}>{item.hoTen}</td>
                                    <td className={cx('cell')}>{item.chucVu}</td>
                                    <td className={cx('cell')}>{item.donViCongTac}</td>
                                    <td className={cx('cell')}>{item.email}</td>
                                    <td className={cx('cell')}>
                                        <div className={cx('action-buttons')}>
                                            <button className={cx('btn-edit')} onClick={() => handleEditAccount(item)}>
                                                Sửa
                                            </button>
                                            <button
                                                className={cx('btn-delete')}
                                                onClick={() => handleDeleteAccount(item)}
                                            >
                                                Xóa
                                            </button>
                                            <button className={cx('btn-view')} onClick={() => handleViewAccount(item)}>
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
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
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && <Themtaikhoan onClose={handleCloseModals} createNewUser={createNewUser} />}

            {showEditModal && (
                <Chinhsuataikhoan onClose={handleCloseModals} editUser={editUser} accountData={currentAccount} />
            )}

            {showViewModal && <Xemchitiettaikhoan onClose={handleCloseModals} accountData={currentAccount} />}

            {showDeleteModal && (
                <Xacnhanxoa onClose={handleCloseModals} onConfirm={confirmDeleteAccount} accountData={currentAccount} />
            )}
        </div>
    );
}

export default Qlytaikhoan;
