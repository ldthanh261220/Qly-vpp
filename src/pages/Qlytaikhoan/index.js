import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Qlytaikhoan.module.scss';
import Themtaikhoan from './Themtaikhoan';
import Chinhsuataikhoan from './Chinhsuataikhoan';
import Xemchitiettaikhoan from './Xemchitiettaikhoan';
import Xacnhanxoa from './Xacnhanxoa';
import userService from '~/services/userService';

const cx = classNames.bind(styles);

function Qlytaikhoan() {
    const [listUser, setListUser] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentAccount, setCurrentAccount] = useState(null);

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

    const confirmDeleteAccount = () => {
        // Xử lý logic xóa tài khoản ở đây
        console.log(`Đã xóa tài khoản: ${currentAccount.name}`);
        // Sau khi xóa, đóng modal
        setShowDeleteModal(false);
    };

    const handleCloseModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
    };

    const Didmount = async () => {
        try {
            let response = await userService.getAllUsers('ALL');
            if (response && response.errCode === 0) {
                setListUser(response.users);
            }
            console.log('get user from nodejs: ', response);
        } catch (error) {
            console.error('Lỗi khi tải danh sách người dùng:', error);
        }
    };
    useEffect(() => {
        Didmount();
    }, []);
    console.log(listUser);

    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>Quản lý tài khoản</h1>

            <div className={cx('search-bar')}>
                <div className={cx('search-input')}>
                    <i className={cx('search-icon')}>🔍</i>
                    <input type="text" placeholder="Tìm kiếm" className={cx('input')} />
                </div>
                <button className={cx('btn', 'btn-filter')}>
                    <span>🔍</span> Bộ lọc nâng cao
                </button>
                <button className={cx('btn', 'btn-add')} onClick={handleAddAccount}>
                    <span>➕</span> Thêm tài khoản mới
                </button>
                <button className={cx('btn', 'btn-refresh')}>
                    <span>🔄</span> Làm mới
                </button>
            </div>

            <div className={cx('filter-section')}>
                <div className={cx('filter-group')}>
                    <label className={cx('filter-label')}>Lọc theo chức vụ:</label>
                    <select className={cx('filter-select')}>
                        <option>-- Tất cả --</option>
                        <option>Trưởng phòng</option>
                        <option>Phó Trưởng phòng</option>
                        <option>Ban giám hiệu</option>
                    </select>
                </div>
                <div className={cx('filter-group')}>
                    <label className={cx('filter-label')}>Lọc theo ngày vào làm:</label>
                    <input type="date" placeholder="mm/dd/yyyy" className={cx('filter-date')} />
                </div>
            </div>

            <div className={cx('sort-section')}>
                <select className={cx('sort-dropdown')}>
                    <option>Sắp xếp theo: Số thứ tự</option>
                    <option>Sắp xếp theo: Họ và tên</option>
                    <option>Sắp xếp theo: Chức vụ</option>
                    <option>Sắp xếp theo: Đơn vị công tác</option>
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
                    {listUser &&
                        listUser.map((item, index) => {
                            return (
                                <tr className={cx('table-row')}>
                                    <td className={cx('cell')}>{item.id}</td>
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
                        })}
                </tbody>
            </table>

            <div className={cx('pagination')}>
                <div className={cx('pagination-btn', 'active')}>1</div>
                <div className={cx('pagination-btn')}>2</div>
                <div className={cx('pagination-btn')}>3</div>
            </div>

            {showAddModal && <Themtaikhoan onClose={handleCloseModals} />}

            {showEditModal && <Chinhsuataikhoan onClose={handleCloseModals} accountData={currentAccount} />}

            {showViewModal && <Xemchitiettaikhoan onClose={handleCloseModals} accountData={currentAccount} />}

            {showDeleteModal && (
                <Xacnhanxoa onClose={handleCloseModals} onConfirm={confirmDeleteAccount} accountData={currentAccount} />
            )}
        </div>
    );
}

export default Qlytaikhoan;
