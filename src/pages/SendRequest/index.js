import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SendRequest.module.scss';
import guiyeucauService from '~/services/guiyeucauService';

const cx = classNames.bind(styles);

function SendRequest() {
    const [loaiYeuCau, setloaiYeuCau] = useState('');
    const [tinhTrangThietBi, settinhTrangThietBi] = useState('damaged');
    const [hinhAnhSuaChua, sethinhAnhSuaChua] = useState('');
    const [formData, setFormData] = useState({
        lyDoDeXuat: '',
        maTaiKhoan: '1',
        ngayDuyet: '20/05/2025', // ngày duyệt, có thể bỏ trống hoặc để null lúc tạo
        loaiYeuCau: '', // tương ứng với "requestType"
        moTaChiTiet: '',
        tenVatDung: '',
        soLuong: '',
        maSanPham: '1',
        tinhTrangThietBi: '', // tương ứng với "status" hoặc "tình trạng thiết bị"
        trangThai: 'Đang chờ duyệt', // tương ứng với "status"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRequestTypeChange = (e) => {
        setloaiYeuCau(e.target.value);
    };

    const handleStatusChange = (e) => {
        settinhTrangThietBi(e.target.value);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            sethinhAnhSuaChua(e.target.files[0].name);
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

        console.log('Form submitted:', dataToSend);

        await createNewRequest(dataToSend);
    };
    const createNewRequest = async (data) => {
        try {
            const response = await guiyeucauService.createNewRequestService(data);
            console.log('API Response:', response); // <-- In toàn bộ response ra

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
                            <label htmlFor="khoa">Tên khoa/phòng ban</label>
                            <input
                                type="text"
                                id="khoa"
                                name="khoa"
                                onChange={handleInputChange}
                                placeholder="Nhập tên khoa/phòng ban"
                            />
                        </div>

                        <div className={cx('formGroup')}>
                            <label htmlFor="sdt">Số điện thoại liên hệ</label>
                            <input
                                type="tel"
                                id="sdt"
                                name="sdt"
                                onChange={handleInputChange}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                    </div>

                    <div className={cx('formRow')}>
                        <div className={cx('formGroup')}>
                            <label htmlFor="nguoiGui">Người gửi yêu cầu</label>
                            <input
                                type="text"
                                id="nguoiGui"
                                name="nguoiGui"
                                onChange={handleInputChange}
                                placeholder="Nhập tên người gửi"
                            />
                        </div>

                        <div className={cx('formGroup')}>
                            <label htmlFor="email">Email liên hệ</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                onChange={handleInputChange}
                                placeholder="Nhập địa chỉ email"
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

                {/* Equipment Information Section */}
                <div className={cx('section', 'conditionalSection', { active: loaiYeuCau === 'sửa chữa' })}>
                    <div className={cx('sectionHeader')}>
                        <h2 className={cx('sectionTitle')}>Thông tin thiết bị</h2>
                    </div>

                    <div className={cx('formRow')}>
                        <div className={cx('formGroup')}>
                            <label htmlFor="tenVatDung">Tên thiết bị</label>
                            <input
                                type="text"
                                id="tenVatDung"
                                name="tenVatDung"
                                value={formData.tenVatDung}
                                onChange={handleInputChange}
                                placeholder="Nhập tên thiết bị cần sửa chữa"
                                disabled={loaiYeuCau !== 'sửa chữa'}
                            />
                        </div>

                        <div className={cx('formGroup')}>
                            <label>Tình trạng hiện tại</label>
                            <div className={cx('statusGrid')}>
                                <div className={cx('radioOption')}>
                                    <input
                                        type="radio"
                                        id="working"
                                        name="status"
                                        value="working"
                                        checked={tinhTrangThietBi === 'working'}
                                        onChange={handleStatusChange}
                                        disabled={loaiYeuCau !== 'sửa chữa'}
                                    />
                                    <label htmlFor="working">Hoạt động</label>
                                </div>

                                <div className={cx('radioOption')}>
                                    <input
                                        type="radio"
                                        id="damaged"
                                        name="status"
                                        value="damaged"
                                        checked={tinhTrangThietBi === 'damaged'}
                                        onChange={handleStatusChange}
                                        disabled={loaiYeuCau !== 'sửa chữa'}
                                    />
                                    <label htmlFor="damaged">Hư hỏng</label>
                                </div>

                                <div className={cx('radioOption')}>
                                    <input
                                        type="radio"
                                        id="unusable"
                                        name="status"
                                        value="unusable"
                                        checked={tinhTrangThietBi === 'unusable'}
                                        onChange={handleStatusChange}
                                        disabled={loaiYeuCau !== 'sửa chữa'}
                                    />
                                    <label htmlFor="unusable">Không sử dụng được</label>
                                </div>

                                <div className={cx('radioOption')}>
                                    <input
                                        type="radio"
                                        id="other"
                                        name="status"
                                        value="other"
                                        checked={tinhTrangThietBi === 'other'}
                                        onChange={handleStatusChange}
                                        disabled={loaiYeuCau !== 'sửa chữa'}
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

                {/* Request Information Section */}
                <div className={cx('section')}>
                    <div className={cx('sectionHeader')}>
                        <h2 className={cx('sectionTitle')}>Thông tin yêu cầu</h2>
                    </div>

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

                    <div className={cx('conditionalSection', { active: loaiYeuCau === 'mua sắm' })}>
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
                                    disabled={loaiYeuCau !== 'mua sắm'}
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
                                    disabled={loaiYeuCau !== 'mua sắm'}
                                />
                            </div>
                        </div>
                    </div>

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
