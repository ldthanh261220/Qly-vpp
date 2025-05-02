import React, { useState } from 'react';
import { Pencil, Trash } from 'lucide-react';

import './index.scss';
import { useNavigate } from 'react-router-dom';

const dummyData = [
  {
    maHopDong: '20462',
    tenHopDong: 'Hợp đồng 1',
    ngayThucHien: '13/05/2022',
    ngayKetThuc: '13/05/2022',
    nhaThau: 'Công ty A',
    trangThai: 'Đã nghiệm thu'
  },
  {
    maHopDong: '18953',
    tenHopDong: 'Hợp đồng 2',
    ngayThucHien: '22/05/2022',
    ngayKetThuc: '22/05/2022',
    nhaThau: 'Công ty B',
    trangThai: 'Đã nghiệm thu'
  },
  {
    maHopDong: '45196',
    tenHopDong: 'Hợp đồng 3',
    ngayThucHien: '13/06/2022',
    ngayKetThuc: '15/06/2022',
    nhaThau: 'Công ty C',
    trangThai: 'Đã nghiệm thu'
  },
  {
    maHopDong: '34304',
    tenHopDong: 'Hợp đồng 4',
    ngayThucHien: '06/09/2022',
    ngayKetThuc: '06/09/2022',
    nhaThau: 'Công ty D',
    trangThai: 'Đã nghiệm thu'
  },
];


const NghiemThuTaiSan = () => {
  const navigate = useNavigate();

  const handleDetail = (id) => {
    navigate(`/nghiemthu/${id}`);
  };

  const [statusFilter, setStatusFilter] = useState('Đã nghiệm thu');
  return (
    <div className="nt-container">
      <h2>Danh sách nghiệm thu tài sản</h2>
      <div className="nt-actions">
        <button className="btn-duyet">Duyệt tất cả</button>
        <button className="btn-tu-choi">Từ chối</button>
        <div className="nt-filter">
          <label>Trạng thái:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>Đã nghiệm thu</option>
            <option>Chưa nghiệm thu</option>
            <option>Đã từ chối</option>
          </select>
        </div>
      </div>

      <table className="nt-table">
        <thead>
          <tr>
            <th>Mã hợp đồng</th>
            <th>Tên hợp đồng</th>
            <th>Ngày thực hiện</th>
            <th>Ngày kết thúc</th>
            <th>Nhà thầu</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {dummyData
            .filter(item => item.trangThai === statusFilter)
            .map((item, index) => (
              <tr key={index} onClick={() => handleDetail(item.maHopDong)}>

                <td>{item.maHopDong}</td>
                <td>{item.tenHopDong}</td>
                <td>{item.ngayThucHien}</td>
                <td>{item.ngayKetThuc}</td>
                <td>{item.nhaThau}</td>
                <td><span className="nt-status success">{item.trangThai}</span></td>
                <td>
                  <Pencil
                    className="icon-action edit"
                    size={16}
                    
                  />
                  <Trash className="icon-action delete" size={16} />
                </td>
              </tr>
          ))}
        </tbody>
      </table>

      <div className="nt-pagination">
        <button disabled>Previous</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button disabled>Next</button>
      </div>
    </div>
  );
};

export default NghiemThuTaiSan;
