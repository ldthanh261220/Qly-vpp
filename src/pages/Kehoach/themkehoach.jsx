import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './themkehoach.scss';
import yeucauService from '~/services/yeucauService';

const ThemKeHoach = ({ onBack }) => {
    const [dsYeuCau, setDsYeuCau] = useState([]);
    const [dschonYeuCau, setChonYeuCau] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await yeucauService.getAllYeuCauService('Đã duyệt');
                console.log('RESPONSE:', response);

                if (response.errCode !== 0) {
                    alert(response.data.message || 'Có lỗi xảy ra!');
                    return;
                }

                setDsYeuCau(response.danhsachyeucau);
            } catch (error) {
                alert('Không thể tải danh sách yêu cầu từ server');
                console.error('ERROR:', error);
            }
        };

        fetchData();
    }, []);

    const [keHoach, setKeHoach] = useState({
        tenKeHoach: '',
        TongHopYeuCau: '',
        chuDautu: 'Trường đại học Sư phạm Kỹ thuật',
        thoiGianBatDau: '',
        thoiGianKetThuc: '',
        donVi: '',
        matk: 11,
        loaiyc: '',
        trangThai: 0,
        mucDich: '',
        chiPhiKeHoach: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setKeHoach((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectYeuCau = (e) => {
        const maYeuCau = Number(e.target.value);
        const selected = dsYeuCau.find((yc) => yc.maYeuCau === maYeuCau);
        if (selected && !dschonYeuCau.find((yc) => yc.maYeuCau === maYeuCau)) {
            const updatedList = [...dschonYeuCau, selected];
            setChonYeuCau(updatedList);
            const allThietBi = updatedList.flatMap((yc) => yc.thietbi || []);
            const allMucDich = updatedList.map((yc) => yc.lyDoDeXuat).join(' | ');
            const loaiyc = updatedList[0]?.loaiYeuCau || '';

            if (keHoach.loaiyc === '') {
                const ds = dsYeuCau.filter((item) => item.loaiYeuCau === loaiyc);
                setDsYeuCau(ds);
            }

            setKeHoach((prev) => ({
                ...prev,
                maYeuCau: updatedList.map((yc) => yc.maYeuCau),
                loaiyc: loaiyc,
                mucDich: allMucDich,
                chuDautu: selected.chuDauTu || 'Trường đại học Sư phạm Kỹ thuật',
                danhSachThietBi: allThietBi,
            }));
        }
    };

    const handleRemoveYeuCau = (maYeuCau) => {
        const updatedList = dschonYeuCau.filter((yc) => yc.maYeuCau !== maYeuCau);
        setChonYeuCau(updatedList);

        const allMucDich = updatedList.map((yc) => yc.lyDoDeXuat).join(' | ');
        const loaiyc = updatedList[0]?.loaiYeuCau || '';

        setKeHoach((prev) => ({
            ...prev,
            maYeuCau: updatedList.map((yc) => yc.maYeuCau),
            loaiyc,
            mucDich: allMucDich,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const confirmed = window.confirm('Bạn có chắc chắn muốn thêm kế hoạch này không?');
        if (!confirmed) return;

        try {
            const ds = dschonYeuCau.map((item) => item.maYeuCau).join(',');

            const keHoachGui = {
                ...keHoach,
                TongHopYeuCau: ds,
            };

            console.log('>>> Giá trị kế hoạch gửi lên API:', JSON.stringify(keHoachGui, null, 2));

            await axios.post(`${process.env.REACT_APP_BACKEND}kehoach/creater`, keHoachGui);
            alert('Thêm kế hoạch thành công');
            navigate(`/kehoach`);
        } catch (err) {
            console.error('Lỗi khi thêm kế hoạch:', err);
            alert('Không thể thêm kế hoạch. Vui lòng thử lại.');
        }
    };

    return (
        <div className="form-container">
            <button className="btn-back" onClick={onBack}>
                ← Quay lại danh sách
            </button>
            <h2>Thêm kế hoạch mua sắm</h2>
            <form onSubmit={handleSubmit}>
                <table className="form-table">
                    <tbody>
                        <tr>
                            <td>
                                <label>Chọn yêu cầu đã duyệt:</label>
                            </td>
                            <td>
                                <select onChange={handleSelectYeuCau}>
                                    <option value="">-- Chọn yêu cầu --</option>
                                    {dsYeuCau.map((yc) => (
                                        <option key={yc.maYeuCau} value={yc.maYeuCau}>
                                            {yc.loaiYeuCau === 'sửa chữa'
                                                ? `${yc.maYeuCau} - Sửa chữa ${yc.tenVatDung}`
                                                : `${yc.maYeuCau} - ${yc.moTaChiTiet}`}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>

                        {dschonYeuCau.length > 0 && (
                            <tr>
                                <td colSpan="2">
                                    <div className="selected-list">
                                        <strong>Yêu cầu đã chọn:</strong>
                                        <ul>
                                            {dschonYeuCau.map((yc) => (
                                                <li key={yc.maYeuCau}>
                                                    {yc.maYeuCau} - {yc.lyDoDeXuat}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveYeuCau(yc.maYeuCau)}
                                                        style={{ marginLeft: '10px', color: 'red' }}
                                                    >
                                                        ❌
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        )}

                        <tr>
                            <td>
                                <label>Tên kế hoạch:</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="tenKeHoach"
                                    value={keHoach.tenKeHoach}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Loại kế hoạch:</label>
                            </td>
                            <td>
                                <select name="loaiyc" value={keHoach.loaiyc} onChange={handleChange}>
                                    <option value="">-- Chọn loại kế hoạch --</option>
                                    <option value="mua sắm">Mua sắm</option>
                                    <option value="sửa chữa">Sửa chữa</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Thời gian bắt đầu:</label>
                            </td>
                            <td>
                                <input
                                    type="date"
                                    name="thoiGianBatDau"
                                    value={keHoach.thoiGianBatDau}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Thời gian kết thúc:</label>
                            </td>
                            <td>
                                <input
                                    type="date"
                                    name="thoiGianKetThuc"
                                    value={keHoach.thoiGianKetThuc}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Vị trí:</label>
                            </td>
                            <td>
                                <input type="text" name="chuDautu" value={keHoach.chuDautu} onChange={handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Mục đích:</label>
                            </td>
                            <td>
                                <textarea
                                    name="mucDich"
                                    value={keHoach.mucDich}
                                    onChange={handleChange}
                                    placeholder="Mục đích mua sắm"
                                    className="textarea-large"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>Chi phí dự tính:</label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    name="chiPhiKeHoach"
                                    value={keHoach.chiPhiKeHoach}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <hr />

                {keHoach.loaiyc === 'mua sắm' ? (
                    <table className="plan-table">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Số lượng</th>
                                <th>Mô tả chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dsYeuCau.map((tb, index) => (
                                <tr key={index}>
                                    <td>{tb.tenVatDung}</td>
                                    <td>{Number(tb.soLuong).toLocaleString()}</td>
                                    <td>{tb.moTaChiTiet}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="plan-table">
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Số lượng</th>
                                <th>Tình trạng thiết bị</th>
                                <th>Hình ảnh sửa chữa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dschonYeuCau.map((tb, index) => (
                                <tr key={index}>
                                    <td>{tb.tenVatDung}</td>
                                    <td>{Number(tb.soLuong).toLocaleString()}</td>
                                    <td>{tb.tinhTrangThietBi}</td>
                                    <td>
                                        {tb.hinhAnhSuaChua ? (
                                            <img
                                                src={tb.hinhAnhSuaChua}
                                                alt="Ảnh sửa chữa"
                                                style={{ width: '100px' }}
                                            />
                                        ) : (
                                            'Không có ảnh'
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div className="button_wrapper">
                    <button type="submit" className="btn-submit">
                        Thêm kế hoạch
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ThemKeHoach;
