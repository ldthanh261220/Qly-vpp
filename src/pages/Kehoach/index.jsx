import { useNavigate } from 'react-router-dom';
import './kehoach.scss';
import React, { useState } from 'react';


export default function Kehoach() {
 const navgate=useNavigate();

 const handdetail=(id)=>{
    navgate(`/kehoach/${id}`)
 }
 const handadd=()=>{
  navgate(`/themkehoach`)
}
  const data = [
    { id: "20462", date: "13/05/2022", type: "Mua sắm", status: "Đã xác nhận" },
    { id: "19833", date: "22/05/2022", type: "Sửa chữa", status: "Đang chờ duyệt" },
    { id: "45169", date: "15/06/2022", type: "Mua sắm", status: "Không duyệt" },
    { id: "34304", date: "06/09/2022", type: "Sửa chữa", status: "Đã xác nhận" },
  ];

  const statusColor = {
    "Đã xác nhận": "status-confirmed",
    "Đang chờ duyệt": "status-pending",
    "Không duyệt": "status-rejected",
  };

  // Xử lý UI theo từng trạng thái
  return (
    <div className="main-content">
      
        <>
          <div className="main-content-header">
            <h1 className="main-content-title">Danh sách kế hoạch mua sắm</h1>
            <button className="add-plan-button" onClick={()=>handadd()} >
              Thêm kế hoạch
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead className="table-header">
                <tr>
                  <th className="table-cell">Mã kế hoạch</th>
                  <th className="table-cell">Ngày thực hiện</th>
                  <th className="table-cell">Loại</th>
                  <th className="table-cell">Trạng thái</th>
                  <th className="table-cell">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, i) => (
                  <tr key={i} className="table-row">
                    <td className="table-cell">
                      <button onClick={() =>handdetail(item.id)} className="link-button">
                        {item.id}
                      </button>
                    </td>
                    <td className="table-cell">{item.date}</td>
                    <td className="table-cell">{item.type}</td>
                    <td className="table-cell">
                      <span className={`status-label ${statusColor[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="table-cell actions">
                      <button className="edit-button">Sửa</button>
                      <button className="delete-button">Xoá</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
  
    </div>
  );
}
