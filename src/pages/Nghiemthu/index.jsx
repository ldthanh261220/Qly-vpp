import React, { useEffect, useState, useMemo } from 'react';
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
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Function to fetch data
  const fetchData = () => {
    axios
      .get(process.env.REACT_APP_BACKEND + 'dsnghiemthu')
      .then((response) => setDummyData(response.data))
      .catch((error) => console.error('Axios error:', error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (maNghiemThu) => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(`Bạn có chắc muốn xóa kế hoạch ${maNghiemThu}?`);
    if (!confirmDelete) return;

    axios
      .delete(`${process.env.REACT_APP_BACKEND}nghiemthu/detele?maNghiemThu=${maNghiemThu}`)
      .then(() => {
        // Show success alert
        window.alert('Xóa kế hoạch thành công!');
        // Reload data
        fetchData();
      })
      .catch((error) => {
        console.error('Axios delete error:', error);
        // Show error alert for foreign key constraint or other errors
        window.alert('Xóa không thành công! Có thể kế hoạch này đang được sử dụng (dính khóa ngoại).');
      });
  };

  const filteredData = useMemo(() => {
  const result = dummyData.filter((item) => {
    // Lấy ngày tạo nghiệm thu (hoặc ngày yêu cầu nếu bạn muốn)
    const ngay = item.daNghiemThu ? item.nghiemThu?.ngayTao : null;
    const date = ngay ? new Date(ngay) : null;
    const month = date ? (date.getMonth() + 1).toString().padStart(2, '0') : '';
    const year = date ? date.getFullYear().toString() : '';
    
    const trangThaiNghiemThu = item.daNghiemThu
      ? item.nghiemThu?.trangThai
      : 'Chưa nghiệm thu';

    const searchLower = searchQuery.toLowerCase();

    return (
      (statusFilter === '' || trangThaiNghiemThu === statusFilter) &&
      (monthFilter === '' || month === monthFilter) &&
      (yearFilter === '' || year === yearFilter) &&
      (searchQuery === '' ||
        item.maKeHoach?.toLowerCase().includes(searchLower) ||
        item.tenKeHoach?.toLowerCase().includes(searchLower) ||
        item.loaiyeucau?.toLowerCase().includes(searchLower))
    );
  });

  return result.sort((a, b) => {
    const maA = a.maKeHoach || '';
    const maB = b.maKeHoach || '';
    return sortOrder === 'desc'
      ? maB.localeCompare(maA)
      : maA.localeCompare(maB);
  });
}, [dummyData, statusFilter, monthFilter, yearFilter, sortOrder, searchQuery]);


  // Pagination
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="nt-container">
      <h2>Danh sách nghiệm thu tài sản</h2>
      <div className="nt-actions">
        <div className="nt-search">
          <input
            type="text"
            placeholder="Tìm kiếm mã, tên hoặc loại kế hoạch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="nt-filter">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="Đạt yêu cầu">Đạt yêu cầu</option>
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
            {[2022, 2023, 2024, 2025].map((y) => (
              <option key={y} value={String(y)}>{y}</option>
            ))}
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
          {paginatedData.map((item, idx) => (
            <tr key={idx} onClick={() => navigate(`/nghiemthu/${item.maKeHoach}`)}>
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
                item.daNghiemThu
                  ? item.nghiemThu?.trangThai === 'Đạt yêu cầu' || item.nghiemThu?.trangThai === 'Đạt'
                    ? 'success'
                    : 'error'
                  : 'warning' // Thêm class cho trạng thái chưa nghiệm thu
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
              <td onClick={(e) => e.stopPropagation()}>
                <Pencil
                  className="icon-action edit"
                  size={16}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/capnhatnghiemthu/${item.maKeHoach}`);
                  }}
                />
                <Trash
                  className="icon-action delete"
                  size={16}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item?.nghiemThu?.maNghiemthu);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="nt-pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <span className="pagination-info">
          Trang {currentPage} / {totalPages}
        </span>
      </div>
    </div>
  );
};

export default NghiemThuTaiSan;