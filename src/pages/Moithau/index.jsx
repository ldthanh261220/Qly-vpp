// src/pages/HosoMoithau/index.jsx
import React, { useState } from 'react';
import { Pencil, Trash } from 'lucide-react';
import './danhsachmoithau.scss';
import { useNavigate } from 'react-router-dom';

const dummyData = [
  {
    id: '20462',
    tenKeHoach: 'Mua 20 thiết bị',
    ngayThucHien: '13/05/2022',
    ngayKetThuc: '13/05/2022',
    kinhPhi: '30.000.000',
    trangThai: 'Hoàn thành',
  },
  {
    id: '18933',
    tenKeHoach: 'Mua 20 thiết bị',
    ngayThucHien: '22/05/2022',
    ngayKetThuc: '22/05/2022',
    kinhPhi: '30.000.000',
    trangThai: 'Hoàn thành',
  },
  {
    id: '45169',
    tenKeHoach: 'Mua 20 thiết bị',
    ngayThucHien: '15/06/2022',
    ngayKetThuc: '15/06/2022',
    kinhPhi: '30.000.000',
    trangThai: 'Hoàn thành',
  },
  {
    id: ' 34304',
    tenKeHoach: 'Mua 20 thiết bị',
    ngayThucHien: '06/09/2022',
    ngayKetThuc: '06/09/2022',
    kinhPhi: '30.000.000',
    trangThai: 'Hoàn thành',
  },
];


const Moithau=()=> {
  const navigate=useNavigate();
  const handleDetailsolan = (id) => {
    navigate(`/moithau/${id}`);
  };
  
  return (
    <div className="main-content">
      <div className="main-content-header">
        <h1 className="main-content-title">HỒ SƠ MỜI THẦU</h1>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th>Mã hồ sơ</th>
              <th>Tên kế hoạch</th>
              <th>Ngày thực hiện</th>
              <th>Ngày kết thúc</th>
              <th>Kinh phí</th>
              <th>Trạng thái</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((item, index) => (
              <tr key={index} onClick={()=>{handleDetailsolan(item.id)}}>
                <td>{item.id}</td>
                <td>{item.tenKeHoach}</td>
                <td>{item.ngayThucHien}</td>
                <td>{item.ngayKetThuc}</td>
                <td>{item.kinhPhi}</td>
                <td>
                  <span className="status-label status-success">{item.trangThai}</span>
                </td>
                <td className="actions">
                  <button className="icon-button">
                    <Pencil size={16} />
                  </button>
                  <button className="icon-button delete">
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <button disabled>Previous</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>Next</button>
        </div>
      </div>
    </div>
  );
}
export default  Moithau