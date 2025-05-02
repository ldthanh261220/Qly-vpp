import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './solanmoithau.scss';

const dummyData = [
 {
    maphieuthau:'PDT001',
    maGoiThau: '20462',
    tenKeHoach: 'Mua thiết bị Trường Đại học Sư phạm Kỹ thuật',
    loai: 'Mua sắm',
    linhVuc: 'Hàng hóa',
    donVi: 'Phòng CTSV',
    diaDiem: 'Số 48 Cao Thắng, TP. Đà Nẵng',
    ngay: '20/02/2023',
    tongNganSach: '31.000.000 đ',
    trangThai: 'Đang chờ kết quả'
  },
  {
    maphieuthau:'PDT001',
    maGoiThau: '20462',
    tenKeHoach: 'Mua thiết bị Trường Đại học Sư phạm Kỹ thuật',
    loai: 'Mua sắm',
    linhVuc: 'Hàng hóa',
    donVi: 'Phòng CTSV',
    diaDiem: 'Số 48 Cao Thắng, TP. Đà Nẵng',
    ngay: '20/02/2022',
    tongNganSach: '31.000.000 đ',
    trangThai: 'Đấu thầu xong'
  },
]

export default function Solanmoithau() {
  const { idphieu } = useParams();
  const navigate=useNavigate()
  const handleDetai = (id) => {
    navigate(`/phieuthau/${id}`);
  };
  // Lọc các phiên đấu thầu theo maGoiThau (ví dụ idphieu = "20462")
  const filteredData = Object.values(dummyData).filter(
    (item) => item.maGoiThau === idphieu
  );

  if (filteredData.length === 0) {
    return <p>Không tìm thấy hồ sơ</p>;
  }

  return (
    <div className="hoso-detail">
      <h2>Danh sách các phiên đấu thầu của hồ sơ mời thầu {idphieu}</h2>
      {filteredData.map((item, index) => (
        <div key={index} className="phien">
          <p><strong>Tên kế hoạch:</strong> {item.tenKeHoach}</p>
          <p><strong>Loại:</strong> {item.loai}</p>
          <p><strong>Lĩnh vực:</strong> {item.linhVuc}</p>
          <p><strong>Đơn vị đề xuất:</strong> {item.donVi}</p>
          <p><strong>Địa điểm:</strong> {item.diaDiem}</p>
          <p><strong>Ngày:</strong> {item.ngay}</p>
          <p><strong>Tổng ngân sách:</strong> {item.tongNganSach}</p>
          <p
          className={`trang-thai ${
            item.trangThai === 'Đấu thầu xong' ? 'hoan-thanh' : 'dang-cho'
          }`}
        >
          {item.trangThai}
        </p>

        <div className="link-actions">
          <a href="#">Xem link đấu thầu</a>
          <button onClick={()=>{handleDetai(item.maphieuthau)}}>Xem chi tiết</button>
        </div>
          <hr />
        </div>
      ))}
    </div>
  );
}
