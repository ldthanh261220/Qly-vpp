import classNames from 'classnames/bind';
import styles from './Suathietbi.module.scss';
import { useState, useEffect } from 'react';
import thietbiService from '../../../services/thietbiService'; // Import service

const cx = classNames.bind(styles);

const UNITS = [
    '-- Tất cả --',
    'Phòng Tổ Chức - Hành Chính',
    'Phòng Đào Tạo',
    'Phòng Công Tác Sinh Viên',
    'Phòng QLKH Và HTQT',
    'Phòng Kế Hoạch - Tài Chính',
    'Phòng Khảo Thí Và ĐBCLGD',
    'Phòng Cơ Sở Vật Chất',
    'Văn Phòng Khoa Cơ Khí',
    'Văn Phòng Khoa Điện - Điện Tử',
    'Văn Phòng Khoa Kỹ Thuật Xây Dựng',
    'Văn Phòng Khoa CN Hóa - Môi Trường',
    'Văn Phòng Khoa Sư Phạm CN',
    'Văn Phòng Khoa Công Nghệ Số',
    'Thư Viện',
    'Phòng Hội Đồng',
    'Phòng Giáo Vụ',
    'Phòng Họp Lớn',
    'Phòng Máy Số 1',
    'Phòng Máy Số 2',
    'A101',
    'A102',
    'A103',
    'A104',
    'A105',
    'A201',
    'A202',
    'A203',
    'A204',
    'A205',
    'A206',
    'A207',
    'A208',
    'A209',
    'A210',
    'A211',
    'A212',
    'A213',
    'A214',
    'A215',
    'A216',
    'A217',
    'A218',
    'A301',
    'A302',
    'A303',
    'A304',
    'A305',
    'A306',
    'A307',
    'A308',
];

function Suathietbi({ onClose, editDevice, deviceData }) {
    const [tenThietBi, setTenThietBi] = useState('');
    const [maDanhMuc, setMaDanhMuc] = useState('');
    const [giaBan, setGiaBan] = useState('');
    const [viTriTrongPhong, setViTriTrongPhong] = useState('');
    const [moTa, setMoTa] = useState('');
    const [Hang, setHang] = useState('');
    const [xuatXu, setXuatXu] = useState('');
    const [hinhAnh, setHinhAnh] = useState(null);
    const [createdAt, setCreatedAt] = useState('');
    const [tenPhong, setTenPhong] = useState('');
    const [trangThai, setTrangThai] = useState('');
    const [huongDanSuDung, setHuongDanSuDung] = useState('');
    const [soLuong, setSoLuong] = useState(1);

    // State cho danh mục
    const [danhMuc, setDanhMuc] = useState([]);

    // Fetch danh mục
    const fetchDanhmuc = async () => {
        try {
            const res = await thietbiService.getAllDanhMucService();
            setDanhMuc(res.danhsachdanhmuc || []);
        } catch (err) {
            console.error('Lỗi khi gọi API danh mục:', err);
        }
    };

    // Load danh mục khi component mount
    useEffect(() => {
        fetchDanhmuc();
    }, []);

    // Load dữ liệu thiết bị cần sửa
    useEffect(() => {
        if (deviceData) {
            setTenThietBi(deviceData.tenThietBi || '');
            setMaDanhMuc(deviceData.maDanhMuc || '');
            setGiaBan(deviceData.giaBan?.toString() || '');
            setViTriTrongPhong(deviceData.viTriTrongPhong || '');
            setMoTa(deviceData.moTa || '');
            setHang(deviceData.Hang || '');
            setXuatXu(deviceData.xuatXu || '');
            setCreatedAt(deviceData.createdAt || '');
            setTenPhong(deviceData.tenPhong || '');
            setTrangThai(deviceData.trangThai || '');
            setHuongDanSuDung(deviceData.huongDanSuDung || '');
            setSoLuong(deviceData.soLuong || 1);
            // Nếu có hình ảnh từ server, có thể xử lý ở đây
            setHinhAnh(deviceData.hinhAnh || null);
        }
    }, [deviceData]);

    const handleOnchangeInput = (event, id) => {
        const value = event.target.value;

        switch (id) {
            case 'tenThietBi':
                setTenThietBi(value);
                break;
            case 'maDanhMuc':
                setMaDanhMuc(value);
                break;
            case 'giaBan':
                setGiaBan(value);
                break;
            case 'viTriTrongPhong':
                setViTriTrongPhong(value);
                break;
            case 'moTa':
                setMoTa(value);
                break;
            case 'hang':
                setHang(value);
                break;
            case 'xuatXu':
                setXuatXu(value);
                break;
            case 'hinhAnh':
                const file = event.target.files[0];
                setHinhAnh(file);
                break;
            case 'createdAt':
                setCreatedAt(value);
                break;
            case 'tenPhong':
                setTenPhong(value);
                break;
            case 'trangThai':
                setTrangThai(value);
                break;
            case 'huongDanSuDung':
                setHuongDanSuDung(value);
                break;
            case 'soLuong':
                setSoLuong(parseInt(value) || 1);
                break;
            default:
                break;
        }
    };

    const checkValidateInput = () => {
        if (!tenThietBi.trim()) {
            alert('Vui lòng nhập tên thiết bị');
            return false;
        }
        if (!String(maDanhMuc).trim()) {
            alert('Vui lòng chọn danh mục');
            return false;
        }
        if (!giaBan.trim()) {
            alert('Vui lòng nhập giá bán');
            return false;
        }
        if (isNaN(giaBan) || parseFloat(giaBan) <= 0) {
            alert('Giá bán phải là số dương');
            return false;
        }

        if (!Hang.trim()) {
            alert('Vui lòng nhập hãng');
            return false;
        }
        if (!xuatXu.trim()) {
            alert('Vui lòng nhập xuất xứ');
            return false;
        }
        if (!createdAt) {
            alert('Vui lòng chọn ngày mua');
            return false;
        }
        if (!tenPhong || tenPhong === '-- Tất cả --') {
            alert('Vui lòng chọn tên phòng');
            return false;
        }
        if (!trangThai) {
            alert('Vui lòng chọn trạng thái');
            return false;
        }
        if (soLuong <= 0) {
            alert('Số lượng phải lớn hơn 0');
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        const isValid = checkValidateInput();
        if (!isValid) return;

        const data = {
            ...deviceData, // Giữ lại các thông tin cũ như ID
            tenThietBi,
            maDanhMuc,
            giaBan: parseFloat(giaBan),
            viTriTrongPhong,
            moTa,
            Hang,
            xuatXu,
            createdAt,
            tenPhong,
            trangThai,
            huongDanSuDung,
            soLuong,
        };
        const formDataToSend = new FormData();

        Object.keys(data).forEach((key) => {
            if (data[key] !== null && data[key] !== undefined) {
                formDataToSend.append(key, data[key]);
            }
        });

        if (hinhAnh) {
            formDataToSend.append('file', hinhAnh);
        }
        editDevice(formDataToSend);
        console.log('Dữ liệu cập nhật:', formDataToSend);
    };

    return (
        <div className={cx('modal-overlay')}>
            <div className={cx('modal-container')}>
                <div className={cx('modal-header')}>
                    <h2 className={cx('modal-title')}>Sửa thiết bị</h2>
                    <button className={cx('modal-close')} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={cx('modal-body')}>
                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Tên thiết bị <span className={cx('required')}>*</span>
                        </label>
                        <input
                            type="text"
                            className={cx('form-input')}
                            placeholder="Nhập tên thiết bị"
                            value={tenThietBi}
                            onChange={(event) => {
                                handleOnchangeInput(event, 'tenThietBi');
                            }}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Danh mục <span className={cx('required')}>*</span>
                        </label>
                        <select
                            className={cx('form-select')}
                            value={maDanhMuc}
                            onChange={(event) => handleOnchangeInput(event, 'maDanhMuc')}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {danhMuc.map((item) => (
                                <option key={item.maDanhMuc} value={item.maDanhMuc}>
                                    {item.tenDanhMuc}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Giá bán <span className={cx('required')}>*</span>
                        </label>
                        <input
                            type="number"
                            className={cx('form-input')}
                            placeholder="Nhập giá bán"
                            min="0"
                            step="0.01"
                            value={giaBan}
                            onChange={(event) => {
                                handleOnchangeInput(event, 'giaBan');
                            }}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Vị trí trong phòng <span className={cx('required')}>*</span>
                        </label>
                        <input
                            type="text"
                            className={cx('form-input')}
                            placeholder="Nhập vị trí trong phòng"
                            value={viTriTrongPhong}
                            onChange={(event) => {
                                handleOnchangeInput(event, 'viTriTrongPhong');
                            }}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Mô tả</label>
                        <textarea
                            className={cx('form-input')}
                            placeholder="Nhập mô tả thiết bị"
                            rows="3"
                            value={moTa}
                            onChange={(event) => {
                                handleOnchangeInput(event, 'moTa');
                            }}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Hãng <span className={cx('required')}>*</span>
                        </label>
                        <input
                            type="text"
                            className={cx('form-input')}
                            placeholder="Nhập hãng sản xuất"
                            value={Hang}
                            onChange={(event) => {
                                handleOnchangeInput(event, 'hang');
                            }}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Xuất xứ <span className={cx('required')}>*</span>
                        </label>
                        <input
                            type="text"
                            className={cx('form-input')}
                            placeholder="Nhập xuất xứ"
                            value={xuatXu}
                            onChange={(event) => {
                                handleOnchangeInput(event, 'xuatXu');
                            }}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Hình ảnh</label>
                        <input
                            type="file"
                            className={cx('form-input')}
                            accept="image/*"
                            onChange={(event) => {
                                handleOnchangeInput(event, 'hinhAnh');
                            }}
                        />
                        {hinhAnh && (
                            <div className={cx('image-preview')}>
                                {hinhAnh instanceof File ? (
                                    <img
                                        src={URL.createObjectURL(hinhAnh)}
                                        alt="Preview"
                                        className={cx('preview-image')}
                                    />
                                ) : (
                                    <img src={hinhAnh} alt="Current" className={cx('preview-image')} />
                                )}
                                <span className={cx('file-name')}>
                                    {hinhAnh instanceof File ? hinhAnh.name : 'Hình ảnh hiện tại'}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Ngày mua <span className={cx('required')}>*</span>
                        </label>
                        <input
                            type="date"
                            className={cx('form-input')}
                            value={createdAt}
                            onChange={(event) => {
                                handleOnchangeInput(event, 'createdAt');
                            }}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Tên phòng <span className={cx('required')}>*</span>
                        </label>
                        <select
                            className={cx('form-select')}
                            value={tenPhong}
                            onChange={(event) => handleOnchangeInput(event, 'tenPhong')}
                        >
                            {UNITS.map((unit, index) => (
                                <option key={index} value={unit}>
                                    {unit}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Trạng thái <span className={cx('required')}>*</span>
                        </label>
                        <select
                            className={cx('form-select')}
                            value={trangThai}
                            onChange={(event) => {
                                handleOnchangeInput(event, 'trangThai');
                            }}
                        >
                            <option value="">-- Chọn trạng thái --</option>
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Hư hỏng">Hư hỏng</option>
                        </select>
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>Hướng dẫn sử dụng</label>
                        <textarea
                            className={cx('form-input')}
                            placeholder="Nhập hướng dẫn sử dụng"
                            rows="3"
                            value={huongDanSuDung}
                            onChange={(event) => {
                                handleOnchangeInput(event, 'huongDanSuDung');
                            }}
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label className={cx('form-label')}>
                            Số lượng <span className={cx('required')}>*</span>
                        </label>
                        <input
                            type="number"
                            className={cx('form-input')}
                            placeholder="Nhập số lượng"
                            min="1"
                            value={soLuong}
                            onChange={(event) => {
                                handleOnchangeInput(event, 'soLuong');
                            }}
                        />
                    </div>
                </div>

                <div className={cx('modal-footer')}>
                    <button className={cx('btn-cancel')} onClick={onClose}>
                        Hủy
                    </button>
                    <button className={cx('btn-save')} onClick={handleSubmit}>
                        Cập nhật
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Suathietbi;
