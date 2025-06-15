import React, { useState, useEffect, useMemo } from 'react';
import { Pencil, Trash, CreditCard } from 'lucide-react';
import './danhsachmoithau.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Moithau = () => {
  const [activeTab, setActiveTab] = useState('hoso');
  const [data, setData] = useState([]);
  const [goiThauData, setGoiThauData] = useState([]);
  const [filterYear, setFilterYear] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND + 'dsmoithau');
        const formattedData = response.data.map(item => {
          const ngayThucHien = new Date(item.ngayDauThau);
          const ngayKetThuc = new Date(item.ngayKetthuc);
          return {
            id: item.maPhienDauThau,
            tenKeHoach: item.tenKeHoach,
            ngayThucHien: ngayThucHien.toISOString().split('T')[0], // Định dạng YYYY-MM-DD
            ngayKetThuc: ngayKetThuc.toISOString().split('T')[0], // Định dạng YYYY-MM-DD
            kinhPhi: Number(item.duToanKinhPhi).toLocaleString('vi-VN'),
            trangThai: item.trangThai,
            maNhaThau: item.maNhaThau,
            maPhienDauThau: item.maPhienDauThau
          };
        });
        setData(formattedData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    const fetchGoiThau = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND + 'dsgoithau');
        const formatted = response.data.map(item => ({
          ...item,
          ngayTao: new Date(item.ngayTao).toISOString().split('T')[0], // Định dạng YYYY-MM-DD
        }));
        setGoiThauData(formatted);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách gói thầu:', error);
      }
    };

    fetchData();
    fetchGoiThau();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filterYear, filterMonth, filterStatus, searchQuery, sortOrder]);

  const paginate = (dataArray) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return dataArray.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (dataArray) => Math.ceil(dataArray.length / itemsPerPage);

  const handlePageChange = (page, dataArray) => {
    if (page >= 1 && page <= totalPages(dataArray)) {
      setCurrentPage(page);
    }
  };

  const handleCreateContract = (maNhaThau, maPhienDauThau) => {
    navigate(`/taohopdong?maNhaThau=${maNhaThau}&maPhienDauThau=${maPhienDauThau}`);
  };

  const filteredData = useMemo(() => {
    return data
      .filter(item => {
        const [year, month] = item.ngayThucHien.split('-'); // Tách YYYY-MM-DD
        const matchesSearch = item.tenKeHoach.toLowerCase().includes(searchQuery.toLowerCase());
        return (
          matchesSearch &&
          (filterYear === '' || year === filterYear) &&
          (filterMonth === '' || month === filterMonth) &&
          (filterStatus === '' || item.trangThai === filterStatus)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.ngayThucHien);
        const dateB = new Date(b.ngayThucHien);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [data, filterYear, filterMonth, filterStatus, searchQuery, sortOrder]);

  const filteredGoiThauData = useMemo(() => {
    return goiThauData
      .filter(item => {
        const [year, month] = item.ngayTao.split('-'); // Tách YYYY-MM-DD
        const matchesSearch = item.tenGoiThau.toLowerCase().includes(searchQuery.toLowerCase());
        return (
          matchesSearch &&
          (filterYear === '' || year === filterYear) &&
          (filterMonth === '' || month === filterMonth) &&
          (filterStatus === '' || item.trangThai === filterStatus)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.ngayTao);
        const dateB = new Date(b.ngayTao);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [goiThauData, filterYear, filterMonth, filterStatus, searchQuery, sortOrder]);

  const handleDetailsolan = (id) => navigate(`/phieuthau/${id}`);
  const handleAddGoiThau = () => navigate('/taogoithau');
  const handleAdd = () => navigate(`/taohosomoithau`);

  return (
    <div className="main-content">
      <div className="tabs">
        <button className={activeTab === 'hoso' ? 'tab active' : 'tab'} onClick={() => setActiveTab('hoso')}>
          Hồ sơ mời thầu
        </button>
        <button className={activeTab === 'goithau' ? 'tab active' : 'tab'} onClick={() => setActiveTab('goithau')}>
          Gói thầu
        </button>
      </div>

      <div className="filter-container">
        <input
          type="text"
          placeholder={activeTab === 'hoso' ? 'Tìm kiếm theo kế hoạch...' : 'Tìm kiếm theo tên gói thầu...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="">Tất cả năm</option>
          <option value="2024">2024</option>
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
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Chờ đấu thầu">Chờ đấu thầu</option>
          <option value="Từ chối">Từ chối</option>
          <option value="Tạm ngưng">Tạm ngưng</option>
        </select>
      </div>

      {activeTab === 'hoso' ? (
        <div>
          <div className="main-content-header">
            <h2 className="main-content-title">Hồ sơ mời thầu</h2>
            <button className="add-plan-button" onClick={handleAdd}>
              Thêm hồ sơ mời thầu
            </button>
          </div>

          <table className="data-table">
            <thead className="table-header">
              <tr>
                <th>Mã hồ sơ</th>
                <th>Kế hoạch</th>
                <th>Ngày thực hiện</th>
                <th>Ngày kết thúc</th>
                <th>Kinh phí</th>
                <th>Trạng thái</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginate(filteredData).map((item, index) => (
                <tr key={index} onClick={() => handleDetailsolan(item.id)}>
                  <td>{item.id}</td>
                  <td>{item.tenKeHoach}</td>
                  <td>{item.ngayThucHien}</td>
                  <td>{item.ngayKetThuc}</td>
                  <td>{item.kinhPhi} VND</td>
                  <td>
                    <span
                      className={`status-label ${item.trangThai === 'Hoàn thành' ? 'status-success' : 'status-open'}`}
                    >
                      {item.trangThai}
                    </span>
                  </td>
                  <td className="actions" onClick={(e) => e.stopPropagation()}>
                    <Pencil
                      className="icon-action edit"
                      size={16}
                      onClick={() => navigate(`/suaphiendauthau/${item.id}`)}
                    />
                    <Trash className="icon-action delete" size={16} />
                    {item.trangThai === 'Hoàn thành' && (
                      <button
                        className="icon-button create"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateContract(item.maNhaThau, item.maPhienDauThau);
                        }}
                      >
                        <CreditCard size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1, filteredData)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages(filteredData) }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => handlePageChange(i + 1, filteredData)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1, filteredData)}
              disabled={currentPage === totalPages(filteredData)}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="main-content-header">
            <h2>Danh sách gói thầu</h2>
            <button className="btn btn-primary" onClick={handleAddGoiThau}>
              Thêm gói thầu
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Mã gói thầu</th>
                <th>Tên gói thầu</th>
                <th>Lĩnh vực</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginate(filteredGoiThauData).map((item, idx) => (
                <tr
                  key={idx}
                  onClick={() => navigate(`/chitietgoithau/${item.maGoiThau}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{item.maGoiThau}</td>
                  <td>{item.tenGoiThau}</td>
                  <td>{item.tenLinhVuc}</td>
                  <td>
                    <span
                      className={`status-label ${item.trangThai === 'Hoạt động' ? 'status-success' : 'status-pause'}`}
                    >
                      {item.trangThai}
                    </span>
                  </td>
                  <td>{item.ngayTao}</td>
                  <td className="actions" onClick={(e) => e.stopPropagation()}>
                    <Pencil
                      className="icon-action edit"
                      size={16}
                      onClick={() => navigate(`/suagoithau/${item.maGoiThau}`)}
                    />
                    <Trash className="icon-action delete" size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1, filteredGoiThauData)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages(filteredGoiThauData) }, (_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => handlePageChange(i + 1, filteredGoiThauData)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1, filteredGoiThauData)}
              disabled={currentPage === totalPages(filteredGoiThauData)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Moithau;