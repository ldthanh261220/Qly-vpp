import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './chitietnghiemthu.scss';

const ChitietNghiemThu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [KeHoach, setKeHoach] = useState(null);
  const [ghiChuList, setGhiChuList] = useState({});
  const [trangThaiNghiemThu, setTrangThaiNghiemThu] = useState('Đạt yêu cầu'); // Mặc định

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}detailnghiemthu?maNghiemthu=${id}`)
      .then((response) => {
        setKeHoach(response.data);
        const initialGhiChu = response.data.sanpham.reduce((acc, sp) => {
          acc[sp.mayc_ms] = '';
          return acc;
        }, {});
        setGhiChuList(initialGhiChu);
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

  const handleXacNhan = async () => {
    try {
      const noiDung = Object.values(ghiChuList).join('|');
       const last8 = KeHoach.maKeHoach.slice(-8); // Lấy 8 ký tự cuối
    const maNghiemThu = `NT${last8}`;
      const payload = {
        maNghiemThu: maNghiemThu,
        maKeHoach: KeHoach.maKeHoach,
        hinhAnhNghiemThu: '', // nếu có ảnh, sửa sau
        trangThai: trangThaiNghiemThu,
        noiDung: noiDung,
        ngayTao: new Date().toISOString(),
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}xacnhannghiemthu`,
        payload
      );

      alert(response.data.message || 'Xác nhận nghiệm thu thành công!');
      navigate('/Nghiemthu');
    } catch (error) {
      console.error('Lỗi xác nhận nghiệm thu:', error);
      alert(
        error.response?.data?.message || 'Lỗi khi xác nhận nghiệm thu, vui lòng thử lại.'
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
    daNghiemThu,
  } = KeHoach;

  return (
    <div className="chitiet-KeHoach-container">
      <h2>Chi tiết nghiệm thu</h2>
      <div className="KeHoach-info">
        <h3>{tenKeHoach}</h3>
        <div className="info-columns">
          <div className="info-column info-left">
            <p><strong>Mã nghiệm thu:</strong> {nghiemThu?.maNghiemthu || 'Chưa có'}</p>
            <p><strong>Mã kế hoạch:</strong> {maKeHoach}</p>
            <p><strong>Chủ bút từ:</strong> {chuBuTu}</p>
            <p><strong>Đơn vị:</strong> {donVi}</p>
            <p><strong>Loại yêu cầu:</strong> {loaiyeucau}</p>
          </div>
          <div className="info-column info-right">
            <p><strong>Thời gian bắt đầu:</strong> {thoiGianBatDau ? new Date(thoiGianBatDau).toLocaleDateString('vi-VN') : ''}</p>
            <p><strong>Thời gian kết thúc:</strong> {thoiGianKetThuc ? new Date(thoiGianKetThuc).toLocaleDateString('vi-VN') : ''}</p>
            <p><strong>Trạng thái kế hoạch:</strong> {trangThai}</p>
            <p><strong>Nội dung nghiệm thu:</strong> {nghiemThu?.noiDung || 'Chưa có'}</p>
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
  {yeucau.map((sp, index) => (
    <tr key={sp.mayc_ms}>
      <td>{sp.tenVatDung}</td>
      <td>{sp.moTaChiTiet}</td>
      <td>{sp.soLuong}</td>
      <td>
        {daNghiemThu ? (
          // Hiển thị ghi chú từ nghiệm thu đã lưu
          <span>{(nghiemThu?.noiDung || '').split('|')[index]}</span>
        ) : (
          <textarea
            value={ghiChuList[sp.mayc_ms] || ''}
            onChange={(e) => handleGhiChuChange(sp.mayc_ms, e.target.value)}
            placeholder="Nhập ghi chú..."
            rows={2}
            className="ghi-chu-textarea"
          />
        )}
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
        {daNghiemThu ? (
          <>
            <p className='xacnhan'>Đã xác nhận nghiệm thu</p>
          </>
        ) : (
          <>
            
            <button className="btn-xac-nhan" onClick={handleXacNhan}>
              Xác nhận nghiệm thu
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChitietNghiemThu;
