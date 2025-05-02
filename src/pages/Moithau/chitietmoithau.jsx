import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './chitietmoithau.scss';
export default function ChiTietGoiThau() {
  
  const navigate = useNavigate();
    const goiThauData = [
         {
          tenGoiThau: 'Mua sắm thiết bị',
          moTaChiTiet: 'Thiết bị phục vụ giảng dạy',
          duToanKinhPhi: '100.000.000',
          trangThai: 'Hoàn thành',
          ngayTao: '10/04/2025',
          hinhThucCanhTranh: 'Đấu thầu rộng rãi',
          loaiHopDong: 'Trọn gói',
          diaDiem: 'Số 48 Cao Thắng, TP. Đà Nẵng',
          thoiGianThucHien: '20/04/2025',
          phienDauThau: {
            maPhienDauThau: 'PDT001',
            trangThai: 'Hoàn thành',
            maNhaThau: 'NT001',
            ngayDauThau: '21/04/2025',
            ngayNhanHoSo: '18/04/2025',
            ngayKetThuc: '23/04/2025',
            giaTrungThau: '95.000.000',
          },
          nhaThau: {
            maNhaThau: 'NT001',
            tenNhaThau: 'Công ty TNHH ABC',
            diaChi: '12 Nguyễn Văn Linh, Đà Nẵng',
            hoTenNguoiDaiDien: 'Nguyễn Văn A',
            chucVuNguoiDaiDien: 'Giám đốc',
            soGiayPhepKinhDoanh: '123456789',
          },
          thietBi: [
            { maThietBi: 'TB001', tenThietBi: 'Máy chiếu', soLuong: 3 },
            { maThietBi: 'TB002', tenThietBi: 'Máy in laser', soLuong: 2 },
          ],
        },
    ]
      
  const { id } = useParams();
  const data = goiThauData.find((item)=>item.phienDauThau.maPhienDauThau===id);

  if (!data) return <p>Không tìm thấy gói thầu</p>;

  const { phienDauThau, nhaThau, thietBi } = data;
  
  return (
    <div className="goi-thau-detail">
     <div className="top-section">
    <div className='goi-thau'>
      <h2>{data.tenGoiThau}</h2>
      <p><strong>Mô tả:</strong> {data.moTaChiTiet}</p>
      <p><strong>Địa điểm:</strong> {data.diaDiem}</p>
      <p><strong>Kinh phí dự toán:</strong> {data.duToanKinhPhi}</p>
      <p><strong>Thời gian thực hiện:</strong> {data.thoiGianThucHien}</p>
      <p><strong>Hình thức đầu thầu:</strong> {data.hinhThucCanhTranh}</p>
      <p><strong>Loại hợp đồng:</strong> {data.loaiHopDong}</p>
      <p>
        <strong>Trạng thái:</strong>{" "}
        <span
          className={`trang-thai ${
            data.trangThai === "Hoàn thành"
              ? "hoan-thanh"
              : data.trangThai.includes("chờ")
              ? "dang-cho"
              : "khac"
          }`}
        >
          {data.trangThai}
        </span>
      </p>
    </div>

    <div className='Thongtin'>
      <h3>Thông tin phiên đấu thầu</h3>
      <p><strong>Mã phiên:</strong> {phienDauThau.maPhienDauThau}</p>
      <p><strong>Ngày nhận hồ sơ:</strong> {phienDauThau.ngayNhanHoSo}</p>
      <p><strong>Ngày đấu thầu:</strong> {phienDauThau.ngayDauThau}</p>
      <p><strong>Ngày kết thúc:</strong> {phienDauThau.ngayKetThuc}</p>
      <p><strong>Giá trúng thầu:</strong> {phienDauThau.giaTrungThau}</p>
    </div>
  </div>

    
      <div className='Thietbi'>
      <h3>Danh sách thiết bị </h3>
          <table className="device-table">
            <thead>
              <tr>
                <th>Mã thiết bị</th>
                <th>Tên thiết bị</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {thietBi?.map((tb, index) => (
                <tr key={index}>
                  <td>{tb.maThietBi}</td>
                  <td>{tb.tenThietBi}</td>
                  <td>{tb.soLuong}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
     
      {data.trangThai === 'Hoàn thành' && nhaThau && (
        <>
        <div className='nhathau'>
          <h3>Thông tin nhà thầu</h3>
          <p><strong>Tên nhà thầu:</strong> {nhaThau.tenNhaThau}</p>
          <p><strong>Địa chỉ:</strong> {nhaThau.diaChi}</p>
          <p><strong>Người đại diện:</strong> {nhaThau.hoTenNguoiDaiDien} ({nhaThau.chucVuNguoiDaiDien})</p>
          <p><strong>Giấy phép KD:</strong> {nhaThau.soGiayPhepKinhDoanh}</p>
          </div>
         
        </>
      )}
    </div>
  );
}
