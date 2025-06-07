import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './DoiVaiTro.module.scss';

const cx = classNames.bind(styles);

const roleOptions = [
    { label: 'Admin', value: '1' },
    { label: 'Trưởng phòng', value: '2' },
    { label: 'Phó trưởng phòng', value: '3' },
    { label: 'Chuyên viên', value: '4' },
    { label: 'Nhân viên kỹ thuật', value: '5' },
    { label: 'Ban giám hiệu', value: '6' },
    { label: 'Đơn vị sử dụng', value: '7' },
    { label: 'Phòng kế hoạch - tài chính', value: '8' },
];

function DoiVaiTro({ onClose, onSave, accountData }) {
    const defaultAccount = {
        id: '',
        email: '',
        maVaiTro: '7', // mặc định "Đơn vị sử dụng"
    };

    const user = accountData || defaultAccount;
    const [selectedRole, setSelectedRole] = useState(user.maVaiTro);

    const handleSave = () => {
        onSave && onSave(user.id, selectedRole); // Gọi hàm với (userId, maVaiTro)
        onClose();
    };

    return (
        <div
            className={cx('modal-overlay')}
            onClick={(e) => {
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
                                {roleOptions.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
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
