import React, { useState, useEffect, useMemo } from 'react';
import { Pencil, Trash } from 'lucide-react';
import './index.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NghiemThuTaiSan = () => {
  const navigate = useNavigate();
  const [dummyData, setDummyData] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND + 'dsnghiemthu')
      .then((response) => {
        setDummyData(response.data);
        console.log(response.data); // Debug dữ liệu
      })
      .catch((error) => {
        console.error('Axios error:', error);
      });
  }, []);

  const handleDetail = (id) => {
    navigate(`/nghiemthu/${id}`);
  };

  const filteredData = useMemo(() => {
    const result = dummyData.filter((item) => {
      // Lọc theo ngayYeuCau (giả sử có trong kehoach)
      const ngayYeuCau = item.ngayYeuCau ? new Date(item.ngayYeuCau) : null;
      const month = ngayYeuCau ? (ngayYeuCau.getMonth() + 1).toString().padStart(2, '0') : '';
      const year = ngayYeuCau ? ngayYeuCau.getFullYear().toString() : '';
      
      // Lọc theo trạng thái nghiệm thu
      const trangThaiNghiemThu = item.daNghiemThu ? item.nghiemThu?.trangThai : 'Chưa nghiệm thu';
      return (
        (statusFilter === '' || trangThaiNghiemThu === statusFilter) &&
        (monthFilter === '' || month === monthFilter) &&
        (yearFilter === '' || year === yearFilter)
      );
    });

    // Sắp xếp theo maKeHoach thay vì maNghiemthu
    return result.sort((a, b) => {
      const maA = a.maKeHoach || '';
      const maB = b.maKeHoach || '';
      if (sortOrder === 'desc') {
        return maB.localeCompare(maA);
      }
      return maA.localeCompare(maB);
    });
  }, [dummyData, statusFilter, monthFilter, yearFilter, sortOrder]);

  return (
    <div className="nt-container">
      <h2>Danh sách nghiệm thu tài sản</h2>
      <div className="nt-actions">
        <button className="btn-duyet">Duyệt tất cả</button>
        <button className="btn-tu-choi">Từ chối</button>
        <div className="nt-filter">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="Đạt">Đạt</option>
            <option value="Không đạt">Không đạt</option>
            <option value="Chưa nghiệm thu">Chưa nghiệm thu</option>
            <option value="Đã từ chối">Đã từ chối</option>
          </select>
        </div>
        <div className="nt-filter">
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
            <option value="">Tháng</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                Tháng {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="nt-filter">
          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
            <option value="">Năm</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div className="nt-sort">
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Mới → Cũ</option>
            <option value="asc">Cũ → Mới</option>
          </select>
        </div>
      </div>

      <table className="nt-table">
        <thead>
          <tr>
            <th>Mã kế hoạch</th>
            <th>Tên kế hoạch</th>
            <th>Loại kế hoạch</th>
            <th>Thời gian bắt đầu</th>
            <th>Trạng thái nghiệm thu</th>
            <th>Ngày tạo nghiệm thu</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} onClick={() => handleDetail(item.maKeHoach)}>
              <td>{item.maKeHoach}</td>
              <td>{item.tenKeHoach || 'N/A'}</td>
              <td>{item.loaiyeucau || 'N/A'}</td>
              <td>
                {item.thoiGianBatDau
                  ? new Date(item.thoiGianBatDau).toLocaleDateString('vi-VN')
                  : 'N/A'}
              </td>
              
              <td>
                <span
                  className={`nt-status ${
                    item.daNghiemThu && item.nghiemThu?.trangThai === 'Đạt' ? 'success' : 'error'
                  }`}
                >
                  {item.daNghiemThu ? item.nghiemThu?.trangThai : 'Chưa nghiệm thu'}
                </span>
              </td>
              <td>
                {item.daNghiemThu && item.nghiemThu?.ngayTao
                  ? new Date(item.nghiemThu.ngayTao).toLocaleDateString('vi-VN')
                  : 'Chưa có'}
              </td>
              <td>
                <Pencil className="icon-action edit" size={16} />
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