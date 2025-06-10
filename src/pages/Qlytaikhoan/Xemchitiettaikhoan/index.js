import classNames from 'classnames/bind';
import styles from './Xemchitiettaikhoan.module.scss';

const cx = classNames.bind(styles);

function Xemchitiettaikhoan({ onClose, accountData }) {
    // Default account data if none is provided
    const account = {
        name: accountData.hoTen,
        position: accountData.chucVu,
        department: accountData.donViCongTac,
        email: accountData.email,
        status: accountData.trangThai,
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
                    <h2 className={cx('modal-title')}>Xem chi tiết tài khoản</h2>
                    <button className={cx('modal-close')} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={cx('modal-body')}>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Họ và tên</label>
                        <div className={cx('form-value')}>{account.name}</div>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Chức vụ</label>
                        <div className={cx('form-value')}>{account.position}</div>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Đơn vị công tác</label>
                        <div className={cx('form-value')}>{account.department}</div>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Email</label>
                        <div className={cx('form-value')}>{account.email}</div>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Trạng thái</label>
                        <div className={cx('form-value')}>{account.status}</div>
                    </div>
                </div>

                <div className={cx('modal-footer')}>
                    <button className={cx('btn-close')} onClick={onClose}>
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Xemchitiettaikhoan;
