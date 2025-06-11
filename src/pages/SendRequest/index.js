import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './SendRequest.module.scss';
import guiyeucauService from '~/services/guiyeucauService';
import { useSelector } from 'react-redux';
import thietbiService from '~/services/thietbiService';

const cx = classNames.bind(styles);

function SendRequest() {
    const user = useSelector((state) => state.user.currentUser);
    const isMountedRef = useRef(true); // Thêm ref để track component mount status

    const [loaiYeuCau, setloaiYeuCau] = useState('');
    const [tinhTrangThietBi, settinhTrangThietBi] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedPhong, setSelectedPhong] = useState('');
    const [danhSachPhong, setDanhSachPhong] = useState([]);
    const [danhSachThietBi, setDanhSachThietBi] = useState([]);
    const [selectedViTri, setSelectedViTri] = useState('');
    const [selectedThietBi, setSelectedThietBi] = useState('');
    const [formData, setFormData] = useState({
        lyDoDeXuat: '',
        maTaiKhoan: user?.id || '',
        ngayDuyet: '',
        loaiYeuCau: '',
        moTaChiTiet: '',
        tenVatDung: '',
        soLuong: '',
        maThietBi: '1',
        tinhTrangThietBi: '',
        trangThai: 'Đang chờ duyệt',
    });

    // Cleanup function khi component unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const getAllPhong = async () => {
        try {
            const response = await thietbiService.getAllPhongService();
            // Kiểm tra component còn mounted không trước khi setState
            if (response?.errCode === 0 && isMountedRef.current) {
                setDanhSachPhong(response.danhsachphong);
            }
        } catch (error) {
            if (isMountedRef.current) {
                console.error('Lỗi khi tải danh sách phòng:', error);
            }
        }
    };

    const getAllThietbi = async () => {
        try {
            const response = await thietbiService.getAllThietbiService();
            // Kiểm tra component còn mounted không trước khi setState
            if (response?.errCode === 0 && isMountedRef.current) {
                setDanhSachThietBi(response.danhsachthietbi);
            }
        } catch (error) {
            if (isMountedRef.current) {
                console.error('Lỗi khi tải danh sách thiết bị:', error);
            }
        }
    };

    useEffect(() => {
        // Chỉ fetch data khi component mounted và user có dữ liệu
        if (user?.id) {
            getAllPhong();
            getAllThietbi();
        }
    }, [user?.id]);

    // Update formData khi user thay đổi
    useEffect(() => {
        if (user?.id && isMountedRef.current) {
            setFormData((prev) => ({
                ...prev,
                maTaiKhoan: user.id,
            }));
        }
    }, [user?.id]);

    const handleInputChange = (e) => {
        if (!isMountedRef.current) return;

        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRequestTypeChange = (e) => {
        if (!isMountedRef.current) return;

        const newRequestType = e.target.value;
        setloaiYeuCau(newRequestType);

        // Reset tất cả các trường khi chuyển đổi loại yêu cầu
        if (newRequestType === 'mua sắm') {
            settinhTrangThietBi('');
            setSelectedFile(null);
            setSelectedPhong('');
            setSelectedViTri('');
            setSelectedThietBi('');
            setFormData((prev) => ({
                ...prev,
                maThietBi: '',
                tinhTrangThietBi: '',
                moTaChiTiet: prev.moTaChiTiet,
                tenVatDung: prev.tenVatDung,
                soLuong: prev.soLuong,
                lyDoDeXuat: prev.lyDoDeXuat,
            }));
            // Reset file input
            const fileInput = document.getElementById('attachment');
            if (fileInput) fileInput.value = '';
        } else if (newRequestType === 'sửa chữa') {
            setFormData((prev) => ({
                ...prev,
                moTaChiTiet: '',
                tenVatDung: '',
                soLuong: '',
                lyDoDeXuat: prev.lyDoDeXuat,
            }));
            settinhTrangThietBi('Hư hỏng');
        }
    };

    const handleStatusChange = (e) => {
        if (!isMountedRef.current) return;
        settinhTrangThietBi(e.target.value);
    };

    const handlePhongChange = (e) => {
        if (!isMountedRef.current) return;

        const tenPhong = e.target.value;
        setSelectedPhong(tenPhong);
        setSelectedViTri('');
        setSelectedThietBi('');
        setFormData((prev) => ({
            ...prev,
            maThietBi: '',
        }));
    };

    const handleViTriChange = (e) => {
        if (!isMountedRef.current) return;

        const viTri = e.target.value;
        setSelectedViTri(viTri);
        setSelectedThietBi('');
        setFormData((prev) => ({
            ...prev,
            maThietBi: '',
        }));
    };

    const handleThietBiChange = (e) => {
        if (!isMountedRef.current) return;

        const maThietBi = e.target.value;
        setSelectedThietBi(maThietBi);
        setFormData((prev) => ({
            ...prev,
            maThietBi: maThietBi,
        }));
    };

    const getViTriByPhong = (tenPhong) => {
        const thietBiTrongPhong = danhSachThietBi.filter((thietBi) => thietBi.tenPhong === tenPhong);
        const viTriList = thietBiTrongPhong
            .filter((thietBi) => thietBi.viTriTrongPhong && thietBi.viTriTrongPhong !== null)
            .map((thietBi) => thietBi.viTriTrongPhong);

        return [...new Set(viTriList)];
    };

    const getThietBiByPhongAndViTri = (tenPhong, viTri = null) => {
        const thietBiTrongPhong = danhSachThietBi.filter((thietBi) => thietBi.tenPhong === tenPhong);

        if (viTri) {
            return thietBiTrongPhong.filter((thietBi) => thietBi.viTriTrongPhong === viTri);
        } else {
            return thietBiTrongPhong.filter((thietBi) => !thietBi.viTriTrongPhong || thietBi.viTriTrongPhong === null);
        }
    };

    const hasViTriInPhong = (tenPhong) => {
        const viTriList = getViTriByPhong(tenPhong);
        return viTriList.length > 0;
    };

    const handleFileChange = (e) => {
        if (!isMountedRef.current) return;

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                alert('File quá lớn! Vui lòng chọn file nhỏ hơn 10MB');
                e.target.value = '';
                return;
            }

            const allowedTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            if (!allowedTypes.includes(file.type)) {
                alert('Định dạng file không được hỗ trợ! Vui lòng chọn file JPG, PNG, PDF hoặc DOC');
                e.target.value = '';
                return;
            }

            setSelectedFile(file);
        } else {
            setSelectedFile(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isMountedRef.current) return;

        // Validate form trước khi submit
        if (!loaiYeuCau) {
            alert('Vui lòng chọn loại yêu cầu');
            return;
        }

        if (loaiYeuCau === 'sửa chữa') {
            if (!selectedPhong) {
                alert('Vui lòng chọn phòng');
                return;
            }
            if (!selectedThietBi) {
                alert('Vui lòng chọn thiết bị');
                return;
            }
            if (!tinhTrangThietBi) {
                alert('Vui lòng chọn tình trạng thiết bị');
                return;
            }
        }

        if (loaiYeuCau === 'mua sắm') {
            if (!formData.tenVatDung) {
                alert('Vui lòng nhập tên vật dụng');
                return;
            }
            if (!formData.soLuong) {
                alert('Vui lòng nhập số lượng');
                return;
            }
        }

        if (!formData.lyDoDeXuat) {
            alert('Vui lòng nhập lý do đề xuất');
            return;
        }

        const dataToSend = {
            ...formData,
            loaiYeuCau,
            tinhTrangThietBi,
        };

        console.log('User:', user);
        console.log('Form submitted:', dataToSend);

        await createNewRequest(dataToSend);
    };

    const createNewRequest = async (data) => {
        if (!isMountedRef.current) return;

        try {
            setIsUploading(true);

            const formDataToSend = new FormData();

            Object.keys(data).forEach((key) => {
                if (data[key] !== null && data[key] !== undefined) {
                    formDataToSend.append(key, data[key]);
                }
            });

            if (selectedFile && loaiYeuCau === 'sửa chữa') {
                formDataToSend.append('file', selectedFile);
            }

            const response = await guiyeucauService.createNewRequestService(formDataToSend);

            console.log('API Response:', response);

            // Kiểm tra component còn mounted trước khi update UI
            if (!isMountedRef.current) return;

            if (response?.errCode !== 0) {
                alert(response?.message || 'Lỗi không xác định');
            } else {
                alert('Gửi yêu cầu thành công!');
                resetForm();
            }
        } catch (error) {
            console.error('Lỗi khi tạo yêu cầu mới:', error);
            if (isMountedRef.current) {
                alert('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.');
            }
        } finally {
            if (isMountedRef.current) {
                setIsUploading(false);
            }
        }
    };

    const resetForm = () => {
        if (!isMountedRef.current) return;

        setFormData({
            lyDoDeXuat: '',
            maTaiKhoan: user?.id || '',
            ngayDuyet: '',
            loaiYeuCau: '',
            moTaChiTiet: '',
            tenVatDung: '',
            soLuong: '',
            maThietBi: '1',
            tinhTrangThietBi: '',
            trangThai: 'Đang chờ duyệt',
        });
        setloaiYeuCau('');
        settinhTrangThietBi('');
        setSelectedFile(null);
        setSelectedPhong('');
        setSelectedViTri('');
        setSelectedThietBi('');

        const fileInput = document.getElementById('attachment');
        if (fileInput) fileInput.value = '';
    };

    // Early return nếu user chưa load
    if (!user) {
        return <div>Đang tải...</div>;
    }

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
                                        disabled={isUploading}
                                    />
                                    <div className={cx('uploadIcon')}>📎</div>
                                    <div className={cx('uploadText')}>
                                        {isUploading ? 'Đang xử lý...' : 'Kéo thả file hoặc click để chọn'}
                                    </div>
                                    <div className={cx('uploadHint')}>Hỗ trợ: JPG, PNG, PDF, DOC (tối đa 10MB)</div>
                                </div>
                                {selectedFile && (
                                    <div className={cx('filePreview')}>
                                        <div className={cx('fileIcon')}>📄</div>
                                        <span className={cx('fileName')}>{selectedFile.name}</span>
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
                <button type="submit" className={cx('btnSubmit')} onClick={handleSubmit} disabled={isUploading}>
                    {isUploading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                </button>
            </div>
        </div>
    );
}

export default SendRequest;
