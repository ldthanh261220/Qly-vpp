import classNames from 'classnames/bind';
import styles from './Xacnhanxoa.module.scss';

const cx = classNames.bind(styles);

function Xacnhanxoa({ onClose, onConfirm, accountData }) {
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
                    <h2 className={cx('modal-title')}>Xác nhận xoá tài khoản</h2>
                    <button className={cx('modal-close')} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={cx('modal-body')}>
                    <div className={cx('confirm-message')}>
                        Bạn có chắc chắn muốn xoá tài khoản <strong>{account.name}</strong> không?
                    </div>
                    <div className={cx('warning-message')}>
                        Lưu ý: Hành động này không thể hoàn tác sau khi xác nhận.
                    </div>
                </div>

                <div className={cx('modal-footer')}>
                    <button className={cx('btn-cancel')} onClick={onClose}>
                        Huỷ bỏ
                    </button>
                    <button className={cx('btn-confirm')} onClick={onConfirm}>
                        Xác nhận xoá
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Xacnhanxoa;
