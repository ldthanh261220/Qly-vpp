import classNames from 'classnames/bind';
import styles from './Themtaikhoan.module.scss';

const cx = classNames.bind(styles);

function Themtaikhoan({ onClose }) {
    return (
        <div className={cx('modal-overlay')} onClick={onClose}>
            <div className={cx('modal-container')}>
                <div className={cx('modal-header')}>
                    <h2 className={cx('modal-title')}>Thêm tài khoản</h2>
                    <button className={cx('modal-close')} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={cx('modal-body')}>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Họ và tên <span className={cx('required')}>*</span>
                        </label>
                        <input type="text" className={cx('form-input')} placeholder="Nhập họ tên" />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Chức vụ <span className={cx('required')}>*</span>
                        </label>
                        <select className={cx('form-select')}>
                            <option value="">-- chọn chức vụ --</option>
                            <option value="truong_phong">Trưởng phòng</option>
                            <option value="pho_truong_phong">Phó Trưởng phòng</option>
                            <option value="ban_giam_hieu">Ban giám hiệu</option>
                        </select>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Đơn vị công tác <span className={cx('required')}>*</span>
                        </label>
                        <input type="text" className={cx('form-input')} placeholder="Nhập đơn vị công tác" />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Email <span className={cx('required')}>*</span>
                        </label>
                        <input type="email" className={cx('form-input')} placeholder="Nhập email" />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Trạng thái <span className={cx('required')}>*</span>
                        </label>
                        <select className={cx('form-select')}>
                            <option value="">-- chọn trạng thái --</option>
                            <option value="active">Hoạt động</option>
                            <option value="inactive">Không hoạt động</option>
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

export default Themtaikhoan;
