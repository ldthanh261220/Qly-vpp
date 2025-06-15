
import React, { useState, useEffect, useMemo } from 'react';
import { Pencil, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './kehoach.scss';

const Kehoach = () => {
  const navigate = useNavigate();

  // Định nghĩa màu cho các trạng thái
  const statusColor = {
    'Đã duyệt ngân sách': 'status-confirmed',
    'Đang chờ duyệt': 'status-pending',
    'Từ chối': 'status-rejected',
    'Đã mời thầu': 'status-invited' // Thêm trạng thái mới
  };

  // Hàm điều hướng
  const handleDetail = (id) => {
    navigate(`/kehoach/${id}`);
  };

  const handleUpdate = (id) => {
    navigate(`/suakehoach/${id}`);
  };

  const handleAdd = () => {
    navigate(`/themkehoach`);
  };

  // State để quản lý dữ liệu và bộ lọc
  const [data, setData] = useState([]);
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Gọi API để lấy dữ liệu
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

  // Reset trang khi bộ lọc thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filterYear, filterMonth, filterStatus, searchQuery, sortOrder]);

  // Lọc và sắp xếp dữ liệu
  const filteredData = useMemo(() => {
    return data
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
  }, [data, filterYear, filterMonth, filterStatus, searchQuery, sortOrder]);

  // Phân trang
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
            className="search-input"
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
          <option value="Đã duyệt ngân sách">Đã duyệt ngân sách</option>
          <option value="Đang chờ duyệt">Đang chờ duyệt</option>
          <option value="Từ chối">Từ chối</option>
          <option value="Đã mời thầu">Đã mời thầu</option>
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
                  <span className={`status-label ${statusColor[item.trangThai] || 'status-pending'}`}>
                    {item.trangThai}
                  </span>
                </td>
                <td className="table-cell actions">
                  <Pencil
                    className="icon-action edit"
                    size={16}
                    onClick={() => handleUpdate(item.maKeHoach)}
                  />
                  <Trash
                    className="icon-action delete"
                    size={16}
                  />
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
};

export default Kehoach;
