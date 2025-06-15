import { useNavigate } from 'react-router-dom';
import './kehoach.scss';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export default function Kehoach() {
  const navigate = useNavigate();

  // Hàm điều hướng chi tiết
  const handleDetail = (id) => {
    navigate(`/kehoach/${id}`);
  };

  const handleUpdate = (id) => {
    navigate(`/suakehoach/${id}`);
  };

  // Hàm điều hướng thêm kế hoạch
  const handleAdd = () => {
    navigate(`/themkehoach`);
  };

  // State để quản lý dữ liệu từ API và bộ lọc
  const [data, setData] = useState([]);
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search

  // --- Phân trang ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const statusColor = {
    "Đã xác nhận": "status-confirmed",
    "Đang chờ duyệt": "status-pending",
    "Không duyệt": "status-rejected",
  };

  // Gọi API để lấy dữ liệu khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND + 'getdskehoach');
        const formattedData = response.data.map(item => ({
          ...item,
          date: new Date(item.thoiGianBatDau).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).replace(/\//g, '/'),
        }));
        setData(formattedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, []);

  // Lọc và sắp xếp dữ liệu
  const filteredData = useMemo(() => {
    const result = data
      .filter(item => {
        const [day, month, year] = item.date.split('/');
        const searchLower = searchQuery.toLowerCase();
        return (
          (filterYear === '' || year === filterYear) &&
          (filterMonth === '' || month === filterMonth) &&
          (filterStatus === '' || item.trangThai === filterStatus) &&
          (searchQuery === '' ||
            item.maKeHoach?.toLowerCase().includes(searchLower) ||
            item.tenKeHoach?.toLowerCase().includes(searchLower) ||
            item.loaiyeucau?.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/');
        const [dayB, monthB, yearB] = b.date.split('/');
        const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
        const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });

    return result;
  }, [data, filterYear, filterMonth, filterStatus, sortOrder, searchQuery]);

  // --- Lấy phần dữ liệu cho trang hiện tại ---
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIdx, startIdx + itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Xử lý UI
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-content">
      <div className="main-content-header">
        <h1 className="main-content-title">Danh sách kế hoạch mua sắm</h1>
        <button className="add-plan-button" onClick={handleAdd}>
          Thêm kế hoạch
        </button>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="filter-container">
        <div className="nt-search">
          <input
            type="text"
            placeholder="Tìm kiếm mã, tên hoặc loại kế hoạch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="">Tất cả năm</option>
          <option value="2025">2025</option>
        </select>
        <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">Tất cả tháng</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
              Tháng {i + 1}
            </option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="Đã xác nhận">Đã xác nhận</option>
          <option value="Đang chờ duyệt">Đang chờ duyệt</option>
          <option value="Không duyệt">Không duyệt</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Mới nhất</option>
          <option value="asc">Cũ nhất</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead className="table-header">
            <tr>
              <th className="table-cell">Mã kế hoạch</th>
              <th className="table-cell">Tên kế hoạch</th>
              <th className="table-cell">Ngày thực hiện</th>
              <th className="table-cell">Loại</th>
              <th className="table-cell">Trạng thái</th>
              <th className="table-cell">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, i) => (
              <tr key={i} className="table-row">
                <td className="table-cell">
                  <button onClick={() => handleDetail(item.maKeHoach)} className="link-button">
                    {item.maKeHoach}
                  </button>
                </td>
                <td className="table-cell">{item.tenKeHoach}</td>
                <td className="table-cell">
                  {item.thoiGianBatDau ? new Date(item.thoiGianBatDau).toLocaleDateString('vi-VN') : ''}
                </td>
                <td className="table-cell">{item.loaiyeucau || 'N/A'}</td>
                <td className="table-cell">
                  <span className={`status-label ${statusColor[item.trangThai]}`}>
                    {item.trangThai}
                  </span>
                </td>
                <td className="table-cell actions">
                  <button onClick={() => handleUpdate(item.maKeHoach)} className="edit-button">Sửa</button>
                  <button className="delete-button">Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
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
}