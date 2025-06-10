import classNames from 'classnames/bind';
import { useState } from 'react';
import styles from './DoiVaiTro.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

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

function DoiVaiTro({ onClose, onSave, accountData, isLoading = false }) {
    const defaultAccount = {
        id: '',
        email: '',
        maVaiTro: '7', // mặc định "Đơn vị sử dụng"
    };

    const user = accountData || defaultAccount;

    // Hàm tìm value tương ứng với label = tenVaiTro
    const getInitialRoleValue = () => {
        if (accountData?.tenVaiTro) {
            const found = roleOptions.find((role) => role.label.toLowerCase() === accountData.tenVaiTro.toLowerCase());
            return found ? found.value : '7'; // fallback nếu không tìm thấy
        }
        return user.maVaiTro;
    };

    const [selectedRole, setSelectedRole] = useState(getInitialRoleValue());

    const handleSave = () => {
        if (isLoading) return; // Prevent multiple clicks
        onSave && onSave(user.id, selectedRole);
    };

    const handleClose = () => {
        if (isLoading) return; // Prevent closing while loading
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    // Tìm tên vai trò hiện tại và vai trò được chọn
    const currentRoleName = roleOptions.find((role) => role.value === getInitialRoleValue())?.label;
    const selectedRoleName = roleOptions.find((role) => role.value === selectedRole)?.label;
    const hasChanges = selectedRole !== getInitialRoleValue();

    return (
        <div className={cx('modal-overlay', { loading: isLoading })} onClick={handleOverlayClick}>
            <div className={cx('modal-container', { loading: isLoading })} onClick={(e) => e.stopPropagation()}>
                <div className={cx('modal-header')}>
                    <h2 className={cx('modal-title')}>{isLoading ? 'Đang cập nhật vai trò...' : 'Đổi vai trò'}</h2>
                    <button
                        className={cx('modal-close', { disabled: isLoading })}
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        ✕
                    </button>
                </div>

                <div className={cx('modal-body')}>
                    <div className={cx('user-info')}>
                        <div className={cx('user-avatar')}>{user.hoTen?.charAt(0).toUpperCase() || 'U'}</div>
                        <div className={cx('user-details')}>
                            <h3 className={cx('user-name')}>{user.hoTen || 'Không xác định'}</h3>
                            <p className={cx('user-email')}>{user.email || user.tenDangNhap}</p>
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Vai trò hiện tại</label>
                        <div className={cx('current-role')}>
                            <span className={cx('role-badge', 'current')}>{currentRoleName}</span>
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Chọn vai trò mới <span className={cx('required')}>*</span>
                        </label>
                        <div className={cx('select-wrapper')}>
                            <select
                                className={cx('form-select', { disabled: isLoading })}
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                disabled={isLoading}
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

                    {hasChanges && !isLoading && (
                        <div className={cx('change-preview')}>
                            <div className={cx('change-arrow')}>
                                <span className={cx('role-badge', 'from')}>{currentRoleName}</span>
                                <span className={cx('arrow')}>→</span>
                                <span className={cx('role-badge', 'to')}>{selectedRoleName}</span>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className={cx('loading-indicator')}>
                            <FontAwesomeIcon className={cx('loading-spinner')} icon={faSpinner} />
                            <span>Đang xử lý yêu cầu...</span>
                        </div>
                    )}
                </div>

                <div className={cx('modal-footer')}>
                    <button
                        className={cx('btn-cancel', { disabled: isLoading })}
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xử lý...' : 'Hủy'}
                    </button>
                    <button
                        className={cx('btn-save', {
                            disabled: isLoading || !hasChanges,
                            loading: isLoading,
                        })}
                        onClick={handleSave}
                        disabled={isLoading || !hasChanges}
                    >
                        {isLoading ? (
                            <>
                                <FontAwesomeIcon className={cx('btn-spinner')} icon={faSpinner} />
                                Đang lưu...
                            </>
                        ) : (
                            'Lưu thay đổi'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DoiVaiTro;
