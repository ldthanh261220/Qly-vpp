import classNames from 'classnames/bind';
import styles from './Chinhsuataikhoan.module.scss';

const cx = classNames.bind(styles);

function Chinhsuataikhoan({ onClose, accountData }) {
    // Default account data if none is provided
    const account = accountData || {
        name: 'Hồ Văn Quân',
        position: 'Trưởng phòng',
        department: 'Phòng cơ sở vật chất',
        email: 'hvquan@ute.udn.vn',
        status: 'Hoạt động',
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
                    <h2 className={cx('modal-title')}>Chỉnh sửa tài khoản</h2>
                    <button className={cx('modal-close')} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={cx('modal-body')}>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Họ và tên <span className={cx('required')}>*</span>
                        </label>
                        <input type="text" className={cx('form-input')} defaultValue={account.name} />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Chức vụ <span className={cx('required')}>*</span>
                        </label>
                        <select className={cx('form-select')} defaultValue={account.position}>
                            <option value="Trưởng phòng">-- Trưởng phòng --</option>
                            <option value="Phó Trưởng phòng">Phó Trưởng phòng</option>
                            <option value="Ban giám hiệu">Ban giám hiệu</option>
                        </select>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Đơn vị công tác <span className={cx('required')}>*</span>
                        </label>
                        <input type="text" className={cx('form-input')} defaultValue={account.department} />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Email<span className={cx('required')}>*</span>
                        </label>
                        <input type="email" className={cx('form-input')} defaultValue={account.email} />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Trạng thái <span className={cx('required')}>*</span>
                        </label>
                        <select className={cx('form-select')} defaultValue={account.status}>
                            <option value="Hoạt động">-- Hoạt động --</option>
                            <option value="Không hoạt động">Không hoạt động</option>
                        </select>
                    </div>
                </div>

                <div className={cx('modal-footer')}>
                    <button className={cx('btn-cancel')} onClick={onClose}>
                        Đóng
                    </button>
                    <button className={cx('btn-save')}>Lưu thông tin</button>
                </div>
            </div>
        </div>
    );
}

export default Chinhsuataikhoan;
