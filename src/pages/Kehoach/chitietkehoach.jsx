import React from 'react';
import './chitietkehoach.scss';
import { useNavigate } from 'react-router-dom';

const duLieuKeHoach = [
  {
    id: "20462",
    tenKeHoach: "Mua sắm 20 máy tính phục vụ học tập",
    loai: "Thiết bị điện tử",
    thoiGian: "22/02/2025",
    diaDiem: "Trường Sư phạm Kĩ thuật Đà Nẵng",
    chiPhi: { tu: "180.000.000VND", den: "250.000.000VND" },
    trangThai: "Đã được xác nhận",
    danhSachSanPham: [
      { ten: "Bàn", donVi: "Cái", soLuong: 20 },
      { ten: "Ghế", donVi: "Cái", soLuong: 30 },
      { ten: "Máy in", donVi: "Cái", soLuong: 10 },
    ]
  },
  // thêm kế hoạch khác nếu cần
];

const ChiTietKeHoach = () => {
  const keHoach = duLieuKeHoach.find(kh => kh.id === "20462");
  const navigate = useNavigate();

  if (!keHoach) return <div>Không tìm thấy kế hoạch</div>;

  const handleTaoHoSo = () => {
    navigate('/taohosomoithau', {
      state: {
        tenGoiThau: keHoach.tenKeHoach,
        duToanKinhPhi: `${keHoach.chiPhi.tu} - ${keHoach.chiPhi.den}`,
        diaDiem: keHoach.diaDiem,
        thoiGianThucHien: keHoach.thoiGian,
        danhSachSanPham: keHoach.danhSachSanPham,
      }
    });
  };

  return (
    <div className="plan-detail">
      <button className="btn-back" >← Quay lại danh sách</button>
      <h2>Chi tiết kế hoạch</h2>

      <div className="plan-info">
        <div className="plan-row">
          <div><strong>Tên kế hoạch</strong><br />{keHoach.tenKeHoach}</div>
          <div><strong>Loại</strong><br />{keHoach.loai}</div>
        </div>
        <div className="plan-row">
          <div><strong>Thời gian thực hiện</strong><br />{keHoach.thoiGian}</div>
          <div><strong>Địa điểm</strong><br />{keHoach.diaDiem}</div>
        </div>
        <div className="plan-cost">
          <strong>Chi phí:</strong><br />
          <span className="highlight-cost">{keHoach.chiPhi.tu} - {keHoach.chiPhi.den}</span>
        </div>
      </div>

      <table className="plan-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Đơn vị tính</th>
            <th>Số lượng</th>
          </tr>
        </thead>
        <tbody>
          {keHoach.danhSachSanPham.map((sp, index) => (
            <tr key={index}>
              <td>{sp.ten}</td>
              <td>{sp.donVi}</td>
              <td>{sp.soLuong}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="plan-footer">
        <div className="status">
          Trạng thái: <span className="status-success">{keHoach.trangThai}</span>
        </div>
        <button className="btn-submit" onClick={handleTaoHoSo}>Tạo hồ sơ mời thầu</button>
      </div>
    </div>
  );
};

export default ChiTietKeHoach;
