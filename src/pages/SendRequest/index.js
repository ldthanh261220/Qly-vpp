import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './SendRequest.module.scss';
import guiyeucauService from '~/services/guiyeucauService';
import { useSelector } from 'react-redux';
import thietbiService from '~/services/thietbiService';

const cx = classNames.bind(styles);

function SendRequest() {
    const user = useSelector((state) => state.user.currentUser);
    const [loaiYeuCau, setloaiYeuCau] = useState('');
    const [tinhTrangThietBi, settinhTrangThietBi] = useState('');
    const [hinhAnhSuaChua, sethinhAnhSuaChua] = useState('');
    const [selectedPhong, setSelectedPhong] = useState('');
    const [danhSachPhong, setDanhSachPhong] = useState([]);
    const [danhSachThietBi, setDanhSachThietBi] = useState([]);
    const [selectedViTri, setSelectedViTri] = useState(''); // Thêm state cho vị trí
    const [selectedThietBi, setSelectedThietBi] = useState('');
    const [formData, setFormData] = useState({
        lyDoDeXuat: '',
        maTaiKhoan: user.id,
        ngayDuyet: '',
        loaiYeuCau: '',
        moTaChiTiet: '',
        tenVatDung: '',
        soLuong: '',
        maThietBi: '1',
        tinhTrangThietBi: '',
        trangThai: 'Đang chờ duyệt',
    });

    const getAllPhong = async () => {
        try {
            const response = await thietbiService.getAllPhongService();
            if (response?.errCode === 0) {
                setDanhSachPhong(response.danhsachphong);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách phòng:', error);
        }
    };

    const getAllThietbi = async () => {
        try {
            const response = await thietbiService.getAllThietbiService();
            if (response?.errCode === 0) {
                setDanhSachThietBi(response.danhsachthietbi);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách thiết bị:', error);
        }
    };

    useEffect(() => {
        getAllPhong();
        getAllThietbi();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRequestTypeChange = (e) => {
        const newRequestType = e.target.value;
        setloaiYeuCau(newRequestType);

        // Reset tất cả các trường khi chuyển đổi loại yêu cầu
        if (newRequestType === 'mua sắm') {
            // Reset các trường của sửa chữa
            settinhTrangThietBi('');
            sethinhAnhSuaChua('');
            setSelectedPhong('');
            setSelectedViTri(''); // Reset vị trí
            setSelectedThietBi('');
            setFormData((prev) => ({
                ...prev,
                maThietBi: '',
                tinhTrangThietBi: '',
                // Giữ lại các trường của mua sắm
                moTaChiTiet: prev.moTaChiTiet,
                tenVatDung: prev.tenVatDung,
                soLuong: prev.soLuong,
                lyDoDeXuat: prev.lyDoDeXuat,
            }));
            // Reset file input
            const fileInput = document.getElementById('attachment');
            if (fileInput) fileInput.value = '';
        } else if (newRequestType === 'sửa chữa') {
            // Reset các trường của mua sắm
            setFormData((prev) => ({
                ...prev,
                moTaChiTiet: '',
                tenVatDung: '',
                soLuong: '',
                // Giữ lại các trường chung
                lyDoDeXuat: prev.lyDoDeXuat,
            }));
            // Set tình trạng mặc định cho sửa chữa
            settinhTrangThietBi('Hư hỏng');
        }
    };

    const handleStatusChange = (e) => {
        settinhTrangThietBi(e.target.value);
    };

    const handlePhongChange = (e) => {
        const tenPhong = e.target.value;
        setSelectedPhong(tenPhong);
        setSelectedViTri(''); // Reset vị trí khi đổi phòng
        setSelectedThietBi(''); // Reset thiết bị khi đổi phòng
        setFormData((prev) => ({
            ...prev,
            maThietBi: '',
        }));
    };

    // Thêm handler cho vị trí
    const handleViTriChange = (e) => {
        const viTri = e.target.value;
        setSelectedViTri(viTri);
        setSelectedThietBi(''); // Reset thiết bị khi đổi vị trí
        setFormData((prev) => ({
            ...prev,
            maThietBi: '',
        }));
    };

    const handleThietBiChange = (e) => {
        const maThietBi = e.target.value;
        setSelectedThietBi(maThietBi);
        setFormData((prev) => ({
            ...prev,
            maThietBi: maThietBi,
        }));
    };

    // Hàm lấy danh sách vị trí duy nhất trong phòng
    const getViTriByPhong = (tenPhong) => {
        const thietBiTrongPhong = danhSachThietBi.filter((thietBi) => thietBi.tenPhong === tenPhong);
        const viTriList = thietBiTrongPhong
            .filter((thietBi) => thietBi.viTriTrongPhong && thietBi.viTriTrongPhong !== null)
            .map((thietBi) => thietBi.viTriTrongPhong);

        // Loại bỏ các vị trí trùng lặp
        return [...new Set(viTriList)];
    };

    // Hàm lấy thiết bị theo phòng và vị trí
    const getThietBiByPhongAndViTri = (tenPhong, viTri = null) => {
        const thietBiTrongPhong = danhSachThietBi.filter((thietBi) => thietBi.tenPhong === tenPhong);

        if (viTri) {
            // Nếu có chọn vị trí, lọc theo vị trí
            return thietBiTrongPhong.filter((thietBi) => thietBi.viTriTrongPhong === viTri);
        } else {
            // Nếu không chọn vị trí, chỉ lấy những thiết bị không có vị trí (viTriTrongPhong là null)
            return thietBiTrongPhong.filter((thietBi) => !thietBi.viTriTrongPhong || thietBi.viTriTrongPhong === null);
        }
    };

    // Kiểm tra xem phòng có thiết bị được nhóm theo vị trí không
    const hasViTriInPhong = (tenPhong) => {
        const viTriList = getViTriByPhong(tenPhong);
        return viTriList.length > 0;
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            sethinhAnhSuaChua(e.target.files[0].name);
        } else {
            sethinhAnhSuaChua('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            loaiYeuCau,
            tinhTrangThietBi,
            hinhAnhSuaChua,
            createdAt: new Date(),
        };
        console.log('User:', user);
        console.log('Form submitted:', dataToSend);

        await createNewRequest(dataToSend);
    };

    const createNewRequest = async (data) => {
        try {
            const response = await guiyeucauService.createNewRequestService(data);
            console.log('API Response:', response);

            if (response?.errCode !== 0) {
                alert(response?.message || 'Lỗi không xác định');
            } else {
                alert('Gửi yêu cầu thành công!');
            }
        } catch (error) {
            console.error('Lỗi khi tạo yêu cầu mới:', error);
            alert('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className={cx('container')}>
            <div className={cx('formHeader')}>
                <h1 className={cx('formTitle')}>Gửi yêu cầu mua sắm hoặc sửa chữa</h1>
                <p className={cx('formSubtitle')}>Vui lòng điền đầy đủ thông tin để xử lý yêu cầu của bạn</p>
            </div>

            <div className={cx('requestForm')}>
                {/* Department Information Section */}
                <div className={cx('section')}>
                    <div className={cx('sectionHeader')}>
                        <h2 className={cx('sectionTitle')}>Thông tin khoa/phòng ban</h2>
                    </div>

                    <div className={cx('formRow')}>
                        <div className={cx('formGroup')}>
                            <label htmlFor="nguoiGui">Người gửi yêu cầu</label>
                            <input
                                type="text"
                                id="nguoiGui"
                                name="nguoiGui"
                                value={user?.hoTen || ''}
                                onChange={handleInputChange}
                                placeholder="Nhập tên người gửi"
                                readOnly
                            />
                        </div>
                        <div className={cx('formGroup')}>
                            <label htmlFor="email">Email liên hệ</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={user?.email || ''}
                                onChange={handleInputChange}
                                placeholder="Nhập địa chỉ email"
                                readOnly
                            />
                        </div>
                    </div>

                    <div className={cx('formRow')}>
                        <div className={cx('formGroup')}>
                            <label htmlFor="khoa">Tên khoa/phòng ban</label>
                            <input
                                type="text"
                                id="khoa"
                                name="khoa"
                                value={user?.donViCongTac || ''}
                                onChange={handleInputChange}
                                placeholder="Nhập tên khoa/phòng ban"
                                readOnly
                            />
                        </div>
                        <div className={cx('formGroup')}>
                            <label htmlFor="chucvu">Chức vụ</label>
                            <input
                                type="text"
                                id="chucvu"
                                name="chucvu"
                                value={user?.chucVu || ''}
                                onChange={handleInputChange}
                                placeholder="Nhập chức vụ"
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* Request Type Section */}
                <div className={cx('section')}>
                    <div className={cx('sectionHeader')}>
                        <h2 className={cx('sectionTitle')}>Loại yêu cầu</h2>
                    </div>

                    <div className={cx('radioGroup')}>
                        <div className={cx('radioOption')}>
                            <input
                                type="radio"
                                id="purchase"
                                name="requestType"
                                value="mua sắm"
                                checked={loaiYeuCau === 'mua sắm'}
                                onChange={handleRequestTypeChange}
                            />
                            <label htmlFor="purchase">Mua sắm</label>
                        </div>

                        <div className={cx('radioOption')}>
                            <input
                                type="radio"
                                id="repair"
                                name="requestType"
                                value="sửa chữa"
                                checked={loaiYeuCau === 'sửa chữa'}
                                onChange={handleRequestTypeChange}
                            />
                            <label htmlFor="repair">Sửa chữa</label>
                        </div>
                    </div>
                </div>

                {/* Equipment Information Section - Chỉ hiển thị khi chọn sửa chữa */}
                {loaiYeuCau === 'sửa chữa' && (
                    <div className={cx('section')}>
                        <div className={cx('sectionHeader')}>
                            <h2 className={cx('sectionTitle')}>Thông tin thiết bị</h2>
                        </div>

                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label htmlFor="phong">Chọn phòng</label>
                                <select id="phong" name="phong" value={selectedPhong} onChange={handlePhongChange}>
                                    <option value="">-- Chọn phòng --</option>
                                    {danhSachPhong.map((phong, index) => (
                                        <option key={index} value={phong.tenPhong}>
                                            {phong.tenPhong}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Dropdown vị trí - chỉ hiển thị khi phòng có thiết bị được nhóm theo vị trí */}
                            {selectedPhong && hasViTriInPhong(selectedPhong) && (
                                <div className={cx('formGroup')}>
                                    <label htmlFor="viTri">Chọn vị trí</label>
                                    <select id="viTri" name="viTri" value={selectedViTri} onChange={handleViTriChange}>
                                        <option value="">-- Chọn vị trí --</option>
                                        {getViTriByPhong(selectedPhong).map((viTri, index) => (
                                            <option key={index} value={viTri}>
                                                {viTri}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label htmlFor="thietBi">Chọn thiết bị</label>
                                <select
                                    id="thietBi"
                                    name="thietBi"
                                    value={selectedThietBi}
                                    onChange={handleThietBiChange}
                                    disabled={!selectedPhong || (hasViTriInPhong(selectedPhong) && !selectedViTri)}
                                >
                                    <option value="">-- Chọn thiết bị --</option>
                                    {selectedPhong &&
                                        (!hasViTriInPhong(selectedPhong) || selectedViTri) &&
                                        getThietBiByPhongAndViTri(selectedPhong, selectedViTri).map((thietBi) => (
                                            <option key={thietBi.maThietBi} value={thietBi.maThietBi}>
                                                {thietBi.tenThietBi}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>

                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label>Tình trạng hiện tại</label>
                                <div className={cx('statusGrid')}>
                                    <div className={cx('radioOption')}>
                                        <input
                                            type="radio"
                                            id="working"
                                            name="status"
                                            value="Hoạt động"
                                            checked={tinhTrangThietBi === 'Hoạt động'}
                                            onChange={handleStatusChange}
                                        />
                                        <label htmlFor="working">Hoạt động</label>
                                    </div>

                                    <div className={cx('radioOption')}>
                                        <input
                                            type="radio"
                                            id="damaged"
                                            name="status"
                                            value="Hư hỏng"
                                            checked={tinhTrangThietBi === 'Hư hỏng'}
                                            onChange={handleStatusChange}
                                        />
                                        <label htmlFor="damaged">Hư hỏng</label>
                                    </div>

                                    <div className={cx('radioOption')}>
                                        <input
                                            type="radio"
                                            id="unusable"
                                            name="status"
                                            value="Không sử dụng được"
                                            checked={tinhTrangThietBi === 'Không sử dụng được'}
                                            onChange={handleStatusChange}
                                        />
                                        <label htmlFor="unusable">Không sử dụng được</label>
                                    </div>

                                    <div className={cx('radioOption')}>
                                        <input
                                            type="radio"
                                            id="other"
                                            name="status"
                                            value="Khác"
                                            checked={tinhTrangThietBi === 'Khác'}
                                            onChange={handleStatusChange}
                                        />
                                        <label htmlFor="other">Khác</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={cx('formRow', 'single')}>
                            <div className={cx('formGroup')}>
                                <label>Hình ảnh/Tài liệu đính kèm</label>
                                <div className={cx('fileUploadArea')}>
                                    <input
                                        type="file"
                                        id="attachment"
                                        name="attachment"
                                        onChange={handleFileChange}
                                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                    />
                                    <div className={cx('uploadIcon')}>📎</div>
                                    <div className={cx('uploadText')}>Kéo thả file hoặc click để chọn</div>
                                    <div className={cx('uploadHint')}>Hỗ trợ: JPG, PNG, PDF, DOC (tối đa 10MB)</div>
                                </div>
                                {hinhAnhSuaChua && (
                                    <div className={cx('filePreview')}>
                                        <div className={cx('fileIcon')}>📄</div>
                                        <span className={cx('fileName')}>{hinhAnhSuaChua}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Request Information Section */}
                <div className={cx('section')}>
                    <div className={cx('sectionHeader')}>
                        <h2 className={cx('sectionTitle')}>Thông tin yêu cầu</h2>
                    </div>

                    {/* Mô tả chi tiết - Chỉ hiển thị cho mua sắm */}
                    {loaiYeuCau === 'mua sắm' && (
                        <div className={cx('formRow', 'single')}>
                            <div className={cx('formGroup')}>
                                <label htmlFor="moTaChiTiet">Mô tả chi tiết yêu cầu</label>
                                <textarea
                                    id="moTaChiTiet"
                                    name="moTaChiTiet"
                                    value={formData.moTaChiTiet}
                                    onChange={handleInputChange}
                                    placeholder="Mô tả chi tiết về yêu cầu của bạn..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Thông tin mua sắm - Chỉ hiển thị khi chọn mua sắm */}
                    {loaiYeuCau === 'mua sắm' && (
                        <div className={cx('formRow')}>
                            <div className={cx('formGroup')}>
                                <label htmlFor="tenVatDung">Tên vật dụng</label>
                                <input
                                    type="text"
                                    id="tenVatDung"
                                    name="tenVatDung"
                                    value={formData.tenVatDung}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên vật dụng cần mua"
                                />
                            </div>

                            <div className={cx('formGroup')}>
                                <label htmlFor="soLuong">Số lượng</label>
                                <input
                                    type="number"
                                    id="soLuong"
                                    name="soLuong"
                                    value={formData.soLuong}
                                    onChange={handleInputChange}
                                    placeholder="Nhập số lượng"
                                    min="1"
                                />
                            </div>
                        </div>
                    )}

                    <div className={cx('formRow', 'single')}>
                        <div className={cx('formGroup')}>
                            <label htmlFor="lyDoDeXuat">Lý do đề xuất</label>
                            <textarea
                                id="lyDoDeXuat"
                                name="lyDoDeXuat"
                                value={formData.lyDoDeXuat}
                                onChange={handleInputChange}
                                placeholder="Nhập lý do và tính cấp thiết của yêu cầu..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className={cx('submitContainer')}>
                <button type="submit" className={cx('btnSubmit')} onClick={handleSubmit}>
                    Gửi yêu cầu
                </button>
            </div>
        </div>
    );
}

export default SendRequest;
