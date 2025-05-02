import React, { useState, useEffect } from 'react';
import './themgoithau.scss';
import { useLocation } from 'react-router-dom';

export default function ThemGoiThau({ onSubmit, onBack }) {
  const location = useLocation();
  const data = location.state || {};

  const [tenGoiThau, setTenGoiThau] = useState('');
  const [moTaChiTiet, setMoTaChiTiet] = useState('');
  const [duToanKinhPhi, setDuToanKinhPhi] = useState('');
  const [hinhThucCanhTranh, setHinhThucCanhTranh] = useState('');
  const [loaiHopDong, setLoaiHopDong] = useState('');
  const [diaDiem, setDiaDiem] = useState('');
  const [thoiGianThucHien, setThoiGianThucHien] = useState('');
  const [ngayNhanHoSo, setNgayNhanHoSo] = useState('');
  const [ngayDauThau, setNgayDauThau] = useState('');
  const [ngayKetThuc, setNgayKetThuc] = useState('');
  const [giaTrungThau, setGiaTrungThau] = useState('');
  const [danhSachThietBi, setDanhSachThietBi] = useState([]);

  // Gán dữ liệu khởi tạo từ location.state
  useEffect(() => {
    if (data) {
      setTenGoiThau(data.tenGoiThau || '');
      setMoTaChiTiet(data.moTaChiTiet || '');
      setDuToanKinhPhi(data.duToanKinhPhi || '');
      setDiaDiem(data.diaDiem || '');
      setThoiGianThucHien(data.thoiGianThucHien || '');
      setDanhSachThietBi(data.danhSachSanPham || []);
    }
  }, [data]);

  const handleSubmit = () => {
    const newData = {
      tenGoiThau,
      moTaChiTiet,
      duToanKinhPhi,
      diaDiem,
      hinhThucCanhTranh,
      loaiHopDong,
      thoiGianThucHien,
      phienDauThau: {
        maPhienDauThau: `PDT${Math.floor(Math.random() * 1000)}`,
        ngayNhanHoSo,
        ngayDauThau,
        ngayKetThuc,
        giaTrungThau,
      },
      thietBi: danhSachThietBi,
      trangThai: 'Đang chờ',
    };

    console.log('Gói thầu mới:', newData);
    if (onSubmit) onSubmit(newData);
  };

  return (
    <div className="form-goi-thau">
      <h2>Thêm gói thầu</h2>
      <div className="form-group"><label>Tên gói thầu</label><input value={tenGoiThau} onChange={e => setTenGoiThau(e.target.value)} /></div>
      <div className="form-group"><label>Mô tả chi tiết</label><textarea value={moTaChiTiet} onChange={e => setMoTaChiTiet(e.target.value)} /></div>
      <div className="form-group"><label>Kinh phí dự toán</label><input value={duToanKinhPhi} onChange={e => setDuToanKinhPhi(e.target.value)} /></div>
      <div className="form-group"><label>Hình thức cạnh tranh</label><input value={hinhThucCanhTranh} onChange={e => setHinhThucCanhTranh(e.target.value)} /></div>
      <div className="form-group"><label>Loại hợp đồng</label><input value={loaiHopDong} onChange={e => setLoaiHopDong(e.target.value)} /></div>
      <div className="form-group"><label>Địa điểm</label><input value={diaDiem} onChange={e => setDiaDiem(e.target.value)} /></div>
      <div className="form-group"><label>Thời gian thực hiện</label><input type="date" value={thoiGianThucHien} onChange={e => setThoiGianThucHien(e.target.value)} /></div>
      
      <h3>Phiên đấu thầu</h3>
      <div className="form-group"><label>Ngày nhận hồ sơ</label><input type="date" value={ngayNhanHoSo} onChange={e => setNgayNhanHoSo(e.target.value)} /></div>
      <div className="form-group"><label>Ngày đấu thầu</label><input type="date" value={ngayDauThau} onChange={e => setNgayDauThau(e.target.value)} /></div>
      <div className="form-group"><label>Ngày kết thúc</label><input type="date" value={ngayKetThuc} onChange={e => setNgayKetThuc(e.target.value)} /></div>
     

      <h3>Danh sách thiết bị</h3>
      <table className="device-table">
        <thead>
          <tr><th>Tên thiết bị</th><th>Đơn vị</th><th>Số lượng</th></tr>
        </thead>
        <tbody>
          {danhSachThietBi.map((tb, i) => (
            <tr key={i}>
              <td>{tb.ten}</td>
              <td>{tb.donVi}</td>
              <td>{tb.soLuong}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="form-actions">
        <button onClick={onBack}>← Quay lại</button>
        <button onClick={handleSubmit} className="btn-submit">Lưu gói thầu</button>
      </div>
    </div>
  );
}
