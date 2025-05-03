import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './Phanquyen.module.scss';
import DoiVaiTro from './DoiVaiTro';

const cx = classNames.bind(styles);

function Phanquyen() {
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Dữ liệu người dùng đơn giản
    const userData = [
        {
            id: 1,
            name: 'Hoàng Thị Mỹ Lệ',
            email: 'htmle@ute.udn.vn',
            role: 'Đơn vị sử dụng',
        },
        {
            id: 2,
            name: 'Hồ Văn Quân',
            email: 'hvquan@ute.udn.vn',
            role: 'Trưởng phòng',
        },
    ];

    const handleOpenRoleDialog = (userId) => {
        // Tìm thông tin người dùng từ ID
        const user = userData.find((user) => user.id === userId);
        if (user) {
            setSelectedUser(user);
            setShowRoleDialog(true);
        }
    };

    const handleSaveRoleChange = (updatedUser) => {
        // Ở đây bạn sẽ cập nhật dữ liệu người dùng trong backend/state
        console.log('Vai trò người dùng đã được cập nhật:', updatedUser);
        // Đóng hộp thoại
        setShowRoleDialog(false);
    };

    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>Phân quyền tài khoản</h1>

            <div className={cx('search-section')}>
                <div className={cx('search-input')}>
                    <i className={cx('search-icon')}>🔍</i>
                    <input type="text" placeholder="Tìm kiếm" className={cx('input')} />
                </div>
                <button className={cx('btn', 'btn-refresh')}>
                    <span>🔄</span> Làm mới
                </button>
            </div>

            <div className={cx('filter-section')}>
                <div className={cx('filter-group')}>
                    <label className={cx('filter-label')}>Lọc theo quyền:</label>
                    <div className={cx('select-wrapper')}>
                        <select className={cx('filter-select')}>
                            <option>-- Tất cả --</option>
                            {/* Thêm các option khác tại đây */}
                        </select>
                        <i className={cx('dropdown-icon')}>▼</i>
                    </div>
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
                <div className={cx('sort-dropdown-wrapper')}>
                    <select className={cx('sort-dropdown')}>
                        <option>Sắp xếp theo: Số thứ tự</option>
                        <option>Sắp xếp theo: Họ và tên</option>
                        <option>Sắp xếp theo: Vai trò</option>
                        <option>Sắp xếp theo: Quyền</option>
                    </select>
                    <i className={cx('dropdown-icon')}>▼</i>
                </div>
            </div>

            <div className={cx('table-container')}>
                <table className={cx('table')}>
                    <thead className={cx('table-header')}>
                        <tr>
                            <th className={cx('header-cell', 'stt')}>STT</th>
                            <th className={cx('header-cell', 'name')}>Họ và tên</th>
                            <th className={cx('header-cell', 'role')}>Vai trò</th>
                            <th className={cx('header-cell', 'permission')}>Quyền</th>
                            <th className={cx('header-cell', 'actions')}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className={cx('table-row')}>
                            <td className={cx('cell', 'stt')}>1</td>
                            <td className={cx('cell', 'name')}>Hoàng Thị Mỹ Lệ</td>
                            <td className={cx('cell', 'role')}>Đơn vị sử dụng</td>
                            <td className={cx('cell', 'permission')}>
                                <ul className={cx('permission-list')}>
                                    <li>- Gửi yêu cầu mua sắm hoặc sửa chữa.</li>
                                    <li>- Xem danh sách thiết bị văn phòng phẩm.</li>
                                    <li>- Xem chi tiết thiết bị văn phòng phẩm</li>
                                    <li>- Tìm kiếm thiết bị</li>
                                    <li>- Lọc thiết bị</li>
                                </ul>
                            </td>
                            <td className={cx('cell', 'actions')}>
                                <button className={cx('btn-action')} onClick={() => handleOpenRoleDialog(1)}>
                                    Đổi vai trò
                                </button>
                            </td>
                        </tr>
                        <tr className={cx('table-row')}>
                            <td className={cx('cell', 'stt')}>2</td>
                            <td className={cx('cell', 'name')}>Hồ Văn Quân</td>
                            <td className={cx('cell', 'role')}>Trưởng phòng</td>
                            <td className={cx('cell', 'permission')}>
                                <ul className={cx('permission-list')}>
                                    <li>- Xem tiến độ thực hiện hợp đồng.</li>
                                    <li>- Duyệt nghiệm thu tài sản.</li>
                                    <li>- Chọn nhà thầu.</li>
                                    <li>- Xem danh sách nhà thầu.</li>
                                    <li>- Xem yêu cầu mua sắm hoặc sửa chữa.</li>
                                    <li>- Duyệt yêu cầu mua sắm hoặc sửa chữa.</li>
                                    <li>- Xem danh sách thiết bị văn phòng phẩm.</li>
                                    <li>- Xem chi tiết thiết bị văn phòng phẩm</li>
                                    <li>- Tìm kiếm thiết bị</li>
                                    <li>- Lọc thiết bị</li>
                                </ul>
                            </td>
                            <td className={cx('cell', 'actions')}>
                                <button className={cx('btn-action')} onClick={() => handleOpenRoleDialog(2)}>
                                    Đổi vai trò
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className={cx('pagination')}>
                <div className={cx('pagination-btn', 'active')}>1</div>
                <div className={cx('pagination-btn')}>2</div>
                <div className={cx('pagination-btn')}>3</div>
            </div>

            {showRoleDialog && (
                <DoiVaiTro
                    onClose={() => setShowRoleDialog(false)}
                    onSave={handleSaveRoleChange}
                    userData={selectedUser}
                />
            )}
        </div>
    );
}

export default Phanquyen;
