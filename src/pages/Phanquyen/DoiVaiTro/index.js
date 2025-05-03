import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './DoiVaiTro.module.scss';

const cx = classNames.bind(styles);

function DoiVaiTro({ onClose, onSave, userData }) {
    // Default user data if none is provided
    const defaultUser = {
        email: 'htmle@ute.udn.vn',
        role: 'Đơn vị sử dụng',
    };

    const user = userData || defaultUser;
    const [selectedRole, setSelectedRole] = useState(user.role);

    const roles = ['Đơn vị sử dụng', 'Trưởng phòng', 'Quản trị viên', 'Kế toán', 'Nhân viên kỹ thuật'];

    const handleSave = () => {
        onSave && onSave({ ...user, role: selectedRole });
        onClose();
    };

    return (
        <div
            className={cx('modal-overlay')}
            onClick={(e) => {
                // Close only if clicking on the overlay, not the modal content
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={cx('modal-container')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('modal-header')}>
                    <h2 className={cx('modal-title')}>Đổi vai trò</h2>
                    <button className={cx('modal-close')} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={cx('modal-body')}>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Tên tài khoản <span className={cx('required')}>*</span>
                        </label>
                        <input type="text" className={cx('form-input')} value={user.email} readOnly />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Chọn vai trò <span className={cx('required')}>*</span>
                        </label>
                        <div className={cx('select-wrapper')}>
                            <select
                                className={cx('form-select')}
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                            <i className={cx('dropdown-icon')}>▼</i>
                        </div>
                    </div>
                </div>

                <div className={cx('modal-footer')}>
                    <button className={cx('btn-cancel')} onClick={onClose}>
                        Đóng
                    </button>
                    <button className={cx('btn-save')} onClick={handleSave}>
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DoiVaiTro;
