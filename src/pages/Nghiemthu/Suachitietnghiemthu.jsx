import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './chitietnghiemthu.scss'; // Reusing the same styles

const SuaChitietNghiemThu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [KeHoach, setKeHoach] = useState(null);
  const [ghiChuList, setGhiChuList] = useState({});
  const [trangThaiNghiemThu, setTrangThaiNghiemThu] = useState('');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}detailnghiemthu?maNghiemthu=${id}`)
      .then((response) => {
        setKeHoach(response.data);
        // Initialize ghiChuList with existing notes or empty strings
        const initialGhiChu = response.data.yeucau.reduce((acc, sp, index) => {
          acc[sp.mayc_ms] = (response.data.nghiemThu?.noiDung || '').split('|')[index] || '';
          return acc;
        }, {});
        setGhiChuList(initialGhiChu);
        // Set initial status from existing data
        setTrangThaiNghiemThu(response.data.nghiemThu?.trangThai || 'Đạt yêu cầu');
      })
      .catch((error) => {
        console.error('Axios error:', error);
      });
  }, [id]);

  const handleGhiChuChange = (mayc_ms, value) => {
    setGhiChuList((prev) => ({
      ...prev,
      [mayc_ms]: value,
    }));
  };

  const handleTrangThaiChange = (e) => {
    setTrangThaiNghiemThu(e.target.value);
  };

  const handleCapNhat = async () => {
    try {
      const noiDung = Object.values(ghiChuList).join('|');
      const payload = {
        maNghiemThu: KeHoach.nghiemThu.maNghiemthu,
        trangThai: trangThaiNghiemThu,
        noiDung: noiDung,
        
      };
      console.log(payload)
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND}capnhatnghiemthu`,
        payload
      );

      alert(response.data.message || 'Cập nhật nghiệm thu thành công!');
      navigate('/Nghiemthu');
    } catch (error) {
      console.error('Lỗi cập nhật nghiệm thu:', error);
      alert(
        error.response?.data?.message || 'Lỗi khi cập nhật nghiệm thu, vui lòng thử lại.'
      );
    }
  };

  if (!KeHoach) {
    return <div>Đang tải...</div>;
  }

  const {
    maKeHoach,
    tenKeHoach,
    chuBuTu,
    donVi,
    loaiyeucau,
    thoiGianBatDau,
    thoiGianKetThuc,
    trangThai,
    yeucau,
    nghiemThu,
  } = KeHoach;

  return (
    <div className="chitiet-KeHoach-container">
      <h2>Chỉnh sửa nghiệm thu</h2>
      <div className="KeHoach-info">
        <h3>{tenKeHoach}</h3>
        <div className="info-columns">
          <div className="info-column info-left">
            <p><strong>Mã nghiệm thu:</strong> {nghiemThu?.maNghiemthu}</p>
            <p><strong>Mã kế hoạch:</strong> {maKeHoach}</p>
            <p><strong>Chủ bút từ:</strong> {chuBuTu}</p>
            <p><strong>Đơn vị:</strong> {donVi}</p>
            <p><strong>Loại yêu cầu:</strong> {loaiyeucau}</p>
          </div>
          <div className="info-column info-right">
            <p><strong>Thời gian bắt đầu:</strong> {thoiGianBatDau ? new Date(thoiGianBatDau).toLocaleDateString('vi-VN') : ''}</p>
            <p><strong>Thời gian kết thúc:</strong> {thoiGianKetThuc ? new Date(thoiGianKetThuc).toLocaleDateString('vi-VN') : ''}</p>
            <p><strong>Trạng thái kế hoạch:</strong> {trangThai}</p>
            <p><strong>Ngày tạo:</strong> {nghiemThu?.ngayTao ? new Date(nghiemThu.ngayTao).toLocaleDateString('vi-VN') : ''}</p>
          </div>
        </div>
      </div>

      <table className="sanpham-table">
        <thead>
          <tr>
            <th>Tên vật dụng</th>
            <th>Mô tả chi tiết</th>
            <th>Số lượng</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {yeucau.map((sp) => (
            <tr key={sp.mayc_ms}>
              <td>{sp.tenVatDung}</td>
              <td>{sp.moTaChiTiet}</td>
              <td>{sp.soLuong}</td>
              <td>
                <textarea
                  value={ghiChuList[sp.mayc_ms] || ''}
                  onChange={(e) => handleGhiChuChange(sp.mayc_ms, e.target.value)}
                  placeholder="Nhập ghi chú..."
                  rows={2}
                  className="ghi-chu-textarea"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="trangthai-wrapper" style={{ marginBottom: '20px' }}>
        <label><strong>Trạng thái nghiệm thu: </strong></label>
        <select value={trangThaiNghiemThu} onChange={handleTrangThaiChange}>
          <option value="Đạt yêu cầu">Đạt yêu cầu</option>
          <option value="Không đạt yêu cầu">Không đạt yêu cầu</option>
        </select>
      </div>

      <div className="button-wrapper">
        <button className="btn-xac-nhan" onClick={handleCapNhat}>
          Cập nhật nghiệm thu
        </button>
      </div>
    </div>
  );
};

export default SuaChitietNghiemThu;