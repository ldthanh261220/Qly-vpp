import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Qlytaikhoan.module.scss';
import Themtaikhoan from './Themtaikhoan';
import Chinhsuataikhoan from './Chinhsuataikhoan';
import Xemchitiettaikhoan from './Xemchitiettaikhoan';
import Xacnhanxoa from './Xacnhanxoa';

const cx = classNames.bind(styles);

function Qlytaikhoan() {
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
                    <tr className={cx('table-row')}>
                        <td className={cx('cell')}>1</td>
                        <td className={cx('cell')}>Lê Văn Hoài</td>
                        <td className={cx('cell')}>Phó Trưởng phòng</td>
                        <td className={cx('cell')}>P.CSVC</td>
                        <td className={cx('cell')}>lvhoai@ute.udn.vn</td>
                        <td className={cx('cell')}>
                            <div className={cx('action-buttons')}>
                                <button
                                    className={cx('btn-edit')}
                                    onClick={() =>
                                        handleEditAccount({
                                            name: 'Lê Văn Hoài',
                                            position: 'Phó Trưởng phòng',
                                            department: 'P.CSVC',
                                            email: 'lvhoai@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Sửa
                                </button>
                                <button
                                    className={cx('btn-delete')}
                                    onClick={() =>
                                        handleDeleteAccount({
                                            name: 'Lê Văn Hoài',
                                            position: 'Phó Trưởng phòng',
                                            department: 'P.CSVC',
                                            email: 'lvhoai@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Xóa
                                </button>
                                <button
                                    className={cx('btn-view')}
                                    onClick={() =>
                                        handleViewAccount({
                                            name: 'Lê Văn Hoài',
                                            position: 'Phó Trưởng phòng',
                                            department: 'P.CSVC',
                                            email: 'lvhoai@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr className={cx('table-row')}>
                        <td className={cx('cell')}>2</td>
                        <td className={cx('cell')}>Hồ Văn Quân</td>
                        <td className={cx('cell')}>Trưởng phòng</td>
                        <td className={cx('cell')}>P.CSVC</td>
                        <td className={cx('cell')}>hvquan@ute.udn.vn</td>
                        <td className={cx('cell')}>
                            <div className={cx('action-buttons')}>
                                <button
                                    className={cx('btn-edit')}
                                    onClick={() =>
                                        handleEditAccount({
                                            name: 'Hồ Văn Quân',
                                            position: 'Trưởng phòng',
                                            department: 'Phòng cơ sở vật chất',
                                            email: 'hvquan@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Sửa
                                </button>
                                <button
                                    className={cx('btn-delete')}
                                    onClick={() =>
                                        handleDeleteAccount({
                                            name: 'Hồ Văn Quân',
                                            position: 'Trưởng phòng',
                                            department: 'Phòng cơ sở vật chất',
                                            email: 'hvquan@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Xóa
                                </button>
                                <button
                                    className={cx('btn-view')}
                                    onClick={() =>
                                        handleViewAccount({
                                            name: 'Hồ Văn Quân',
                                            position: 'Trưởng phòng',
                                            department: 'Phòng cơ sở vật chất',
                                            email: 'hvquan@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr className={cx('table-row')}>
                        <td className={cx('cell')}>3</td>
                        <td className={cx('cell')}>Nguyễn Văn A</td>
                        <td className={cx('cell', 'null-value')}>null</td>
                        <td className={cx('cell', 'null-value')}>null</td>
                        <td className={cx('cell')}>a@congty.abc.vn</td>
                        <td className={cx('cell')}>
                            <div className={cx('action-buttons')}>
                                <button
                                    className={cx('btn-edit')}
                                    onClick={() =>
                                        handleEditAccount({
                                            name: 'Nguyễn Văn A',
                                            position: '',
                                            department: '',
                                            email: 'a@congty.abc.vn',
                                            status: 'Không hoạt động',
                                        })
                                    }
                                >
                                    Sửa
                                </button>
                                <button
                                    className={cx('btn-delete')}
                                    onClick={() =>
                                        handleDeleteAccount({
                                            name: 'Nguyễn Văn A',
                                            position: '',
                                            department: '',
                                            email: 'a@congty.abc.vn',
                                            status: 'Không hoạt động',
                                        })
                                    }
                                >
                                    Xóa
                                </button>
                                <button
                                    className={cx('btn-view')}
                                    onClick={() =>
                                        handleViewAccount({
                                            name: 'Nguyễn Văn A',
                                            position: '',
                                            department: '',
                                            email: 'a@congty.abc.vn',
                                            status: 'Không hoạt động',
                                        })
                                    }
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr className={cx('table-row')}>
                        <td className={cx('cell')}>4</td>
                        <td className={cx('cell')}>Phạm Thị D</td>
                        <td className={cx('cell', 'null-value')}>null</td>
                        <td className={cx('cell', 'null-value')}>null</td>
                        <td className={cx('cell')}>d@congty.abc.vn</td>
                        <td className={cx('cell')}>
                            <div className={cx('action-buttons')}>
                                <button
                                    className={cx('btn-edit')}
                                    onClick={() =>
                                        handleEditAccount({
                                            name: 'Phạm Thị D',
                                            position: '',
                                            department: '',
                                            email: 'd@congty.abc.vn',
                                            status: 'Không hoạt động',
                                        })
                                    }
                                >
                                    Sửa
                                </button>
                                <button
                                    className={cx('btn-delete')}
                                    onClick={() =>
                                        handleDeleteAccount({
                                            name: 'Phạm Thị D',
                                            position: '',
                                            department: '',
                                            email: 'd@congty.abc.vn',
                                            status: 'Không hoạt động',
                                        })
                                    }
                                >
                                    Xóa
                                </button>
                                <button
                                    className={cx('btn-view')}
                                    onClick={() =>
                                        handleViewAccount({
                                            name: 'Phạm Thị D',
                                            position: '',
                                            department: '',
                                            email: 'd@congty.abc.vn',
                                            status: 'Không hoạt động',
                                        })
                                    }
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr className={cx('table-row')}>
                        <td className={cx('cell')}>5</td>
                        <td className={cx('cell')}>Võ Trung Hùng</td>
                        <td className={cx('cell')}>Ban giám hiệu</td>
                        <td className={cx('cell')}>Đh.Spkt</td>
                        <td className={cx('cell')}>vthung@ute.udn.vn</td>
                        <td className={cx('cell')}>
                            <div className={cx('action-buttons')}>
                                <button
                                    className={cx('btn-edit')}
                                    onClick={() =>
                                        handleEditAccount({
                                            name: 'Võ Trung Hùng',
                                            position: 'Ban giám hiệu',
                                            department: 'Đh.Spkt',
                                            email: 'vthung@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Sửa
                                </button>
                                <button
                                    className={cx('btn-delete')}
                                    onClick={() =>
                                        handleDeleteAccount({
                                            name: 'Võ Trung Hùng',
                                            position: 'Ban giám hiệu',
                                            department: 'Đh.Spkt',
                                            email: 'vthung@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Xóa
                                </button>
                                <button
                                    className={cx('btn-view')}
                                    onClick={() =>
                                        handleViewAccount({
                                            name: 'Võ Trung Hùng',
                                            position: 'Ban giám hiệu',
                                            department: 'Đh.Spkt',
                                            email: 'vthung@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr className={cx('table-row')}>
                        <td className={cx('cell')}>6</td>
                        <td className={cx('cell')}>Nguyễn Thị Ngọc Linh</td>
                        <td className={cx('cell')}>Trưởng phòng</td>
                        <td className={cx('cell')}>P.KH-TC</td>
                        <td className={cx('cell')}>ntnlinh@ute.udn.vn</td>
                        <td className={cx('cell')}>
                            <div className={cx('action-buttons')}>
                                <button
                                    className={cx('btn-edit')}
                                    onClick={() =>
                                        handleEditAccount({
                                            name: 'Nguyễn Thị Ngọc Linh',
                                            position: 'Trưởng phòng',
                                            department: 'P.KH-TC',
                                            email: 'ntnlinh@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Sửa
                                </button>
                                <button
                                    className={cx('btn-delete')}
                                    onClick={() =>
                                        handleDeleteAccount({
                                            name: 'Nguyễn Thị Ngọc Linh',
                                            position: 'Trưởng phòng',
                                            department: 'P.KH-TC',
                                            email: 'ntnlinh@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Xóa
                                </button>
                                <button
                                    className={cx('btn-view')}
                                    onClick={() =>
                                        handleViewAccount({
                                            name: 'Nguyễn Thị Ngọc Linh',
                                            position: 'Trưởng phòng',
                                            department: 'P.KH-TC',
                                            email: 'ntnlinh@ute.udn.vn',
                                            status: 'Hoạt động',
                                        })
                                    }
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </td>
                    </tr>
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
