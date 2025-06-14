import classNames from 'classnames/bind';
import styles from './Themtaikhoan.module.scss';
import { useState } from 'react';
const cx = classNames.bind(styles);

function Themtaikhoan({ onClose, createNewUser }) {
    const [hoTen, setHoten] = useState('');
    const [chucVu, setChucvu] = useState('');
    const [donViCongTac, setDonViCongTac] = useState('');
    const [email, setEmail] = useState('');
    const [trangThai, setTrangthai] = useState('');
    const handleOnchangeInput = (event, id) => {
        const value = event.target.value;

        switch (id) {
            case 'hoTen':
                setHoten(value);
                break;
            case 'chucVu':
                setChucvu(value);
                break;
            case 'donViCongTac':
                setDonViCongTac(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'trangThai':
                setTrangthai(value);
                break;
            default:
                break;
        }
    };
    const checkValidateInput = () => {
        if (!hoTen.trim()) {
            alert('Vui lòng nhập họ và tên');
            return false;
        }
        if (!chucVu) {
            alert('Vui lòng chọn chức vụ');
            return false;
        }
        if (!donViCongTac.trim()) {
            alert('Vui lòng nhập đơn vị công tác');
            return false;
        }
        if (!email.trim()) {
            alert('Vui lòng nhập email');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Email không hợp lệ');
            return false;
        }
        if (!trangThai) {
            alert('Vui lòng chọn trạng thái');
            return false;
        }

        return true;
    };
    const handleSubmit = () => {
        const isValid = checkValidateInput();
        if (!isValid) return;
        const data = {
            hoTen,
            chucVu,
            donViCongTac,
            email,
            trangThai,
        };
        createNewUser(data);
        console.log('Dữ liệu gửi lên server:', data);
    };

    return (
        <div className={cx('modal-overlay')}>
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
                        <input
                            type="text"
                            className={cx('form-input')}
                            placeholder="Nhập họ tên"
                            onChange={(event) => {
                                handleOnchangeInput(event, 'hoTen');
                            }}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Chức vụ <span className={cx('required')}>*</span>
                        </label>
                        <input
                            type="text"
                            className={cx('form-input')}
                            placeholder="Nhập chức vụ"
                            onChange={(event) => {
                                handleOnchangeInput(event, 'chucVu');
                            }}
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Đơn vị công tác <span className={cx('required')}>*</span>
                        </label>
                        <select
                            className={cx('form-select')}
                            onChange={(event) => handleOnchangeInput(event, 'donViCongTac')}
                        >
                            <option value="">-- Chọn đơn vị công tác --</option>
                            <option value="Ban Giám Hiệu">Ban Giám Hiệu</option>
                            <option value="Hội Đồng Trường">Hội Đồng Trường</option>
                            <option value="Phòng Tổ Chức - Hành Chính">Phòng Tổ Chức - Hành Chính</option>
                            <option value="Phòng Đào Tạo">Phòng Đào Tạo</option>
                            <option value="Phòng Công Tác Sinh Viên">Phòng Công Tác Sinh Viên</option>
                            <option value="Phòng QLKH Và HTQT">Phòng QLKH Và HTQT</option>
                            <option value="Phòng Kế Hoạch - Tài Chính">Phòng Kế Hoạch - Tài Chính</option>
                            <option value="Phòng Khảo Thí Và ĐBCLGD">Phòng Khảo Thí Và ĐBCLGD</option>
                            <option value="Phòng Cơ Sở Vật Chất">Phòng Cơ Sở Vật Chất</option>
                            <option value="Khoa Cơ Khí">Khoa Cơ Khí</option>
                            <option value="Khoa Điện - Điện Tử">Khoa Điện - Điện Tử</option>
                            <option value="Khoa Kỹ Thuật Xây Dựng">Khoa Kỹ Thuật Xây Dựng</option>
                            <option value="Khoa CN Hóa - Môi Trường">Khoa CN Hóa - Môi Trường</option>
                            <option value="Khoa Sư Phạm CN">Khoa Sư Phạm CN</option>
                            <option value="Khoa Công Nghệ Số">Khoa Công Nghệ Số</option>
                            <option value="Tổ Thanh Tra - Pháp Chế">Tổ Thanh Tra - Pháp Chế</option>
                            <option value="Trung Tâm Học Liệu Và Truyền Thông">
                                Trung Tâm Học Liệu Và Truyền Thông
                            </option>
                            <option value="Đảng Ủy">Đảng Ủy</option>
                            <option value="Công Đoàn">Công Đoàn</option>
                            <option value="Tổ CNTT">Tổ CNTT</option>
                            <option value="Đoàn TN - Hội SV">Đoàn TN - Hội SV</option>
                            <option value="Trung Tâm NC & TK TBN">Trung Tâm NC & TK TBN</option>
                            <option value="Trung Tâm ĐT, BD Và TVKTCN">Trung Tâm ĐT, BD Và TVKTCN</option>
                            <option value="Trung Tâm HTSV & QH DN">Trung Tâm HTSV & QH DN</option>
                            <option value="Hội Cựu Chiến Binh">Hội Cựu Chiến Binh</option>
                            <option value="Hội Cựu Giáo Chức">Hội Cựu Giáo Chức</option>
                            <option value="Hội Cựu Sinh Viên">Hội Cựu Sinh Viên</option>
                            <option value="Hội Ái Hữu Cựu GV Và HS KT DN">Hội Ái Hữu Cựu GV Và HS KT DN</option>
                        </select>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Email <span className={cx('required')}>*</span>
                        </label>
                        <input
                            type="email"
                            className={cx('form-input')}
                            placeholder="Nhập email"
                            onChange={(event) => {
                                handleOnchangeInput(event, 'email');
                            }}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Trạng thái <span className={cx('required')}>*</span>
                        </label>
                        <select
                            className={cx('form-select')}
                            onChange={(event) => {
                                handleOnchangeInput(event, 'trangThai');
                            }}
                        >
                            <option value="">-- chọn trạng thái --</option>
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Khóa">Khóa</option>
                        </select>
                    </div>
                </div>

                <div className={cx('modal-footer')}>
                    <button className={cx('btn-cancel')} onClick={onClose}>
                        Đóng
                    </button>
                    <button className={cx('btn-save')} onClick={handleSubmit}>
                        Lưu thông tin
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Themtaikhoan;
