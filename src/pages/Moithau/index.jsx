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
  const [sortOrder, setSortOrder] = useState('desc');

  const navigate = useNavigate();
useEffect(() => {
  if (activeTab === 'goithau') {
    const fetchGoiThau = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND + 'dsgoithau');
        const formatted = response.data.map(item => ({
          ...item,
          ngayTao: new Date(item.ngayTao).toLocaleDateString('vi-VN'),
        }));
        setGoiThauData(formatted);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách gói thầu:', error);
      }
    };
    fetchGoiThau();
  }
}, [activeTab]);
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
            ngayThucHien: ngayThucHien.toLocaleDateString('vi-VN'),
            ngayKetThuc: ngayKetThuc.toLocaleDateString('vi-VN'),
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

    fetchData();
  }, []);

  const handleCreateContract = (maNhaThau, maPhienDauThau) => {
    navigate(`/taohopdong?maNhaThau=${maNhaThau}&maPhienDauThau=${maPhienDauThau}`);
  };

  const filteredData = useMemo(() => {
    return data
      .filter(item => {
        const [day, month, year] = item.ngayThucHien.split('/');
        return (
          (filterYear === '' || year === filterYear) &&
          (filterMonth === '' || month === filterMonth) &&
          (filterStatus === '' || item.trangThai === filterStatus)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.ngayThucHien.split('/').reverse().join('-'));
        const dateB = new Date(b.ngayThucHien.split('/').reverse().join('-'));
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [data, filterYear, filterMonth, filterStatus, sortOrder]);

  const handleDetailsolan = (id) => {
    navigate(`/phieuthau/${id}`);
  };

  const handleAdd = () => {
    navigate(`/taohosomoithau`);
  };

  return (
    <div className="main-content">
      <div className="tabs">
        <button
          className={activeTab === 'hoso' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('hoso')}
        >
          Hồ sơ mời thầu
        </button>
        <button
          className={activeTab === 'goithau' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('goithau')}
        >
          Gói thầu
        </button>
      </div>

      {activeTab === 'hoso' && (
        <>
          <div className="main-content-header">
            <h2 className="main-content-title">HỒ SƠ MỜI THẦU</h2>
            <button className="add-plan-button" onClick={handleAdd}>
              Thêm hồ sơ mời thầu
            </button>
          </div>

          <div className="filter-container">
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)}>
              <option value="">Tất cả năm</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              <option value="">Tất cả tháng</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Tất cả trạng thái</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đang mở">Đang mở</option>
            </select>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option value="desc">Mới nhất</option>
              <option value="asc">Cũ nhất</option>
            </select>
          </div>

          <div className="table-container">
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
                {filteredData.map((item, index) => (
                  <tr key={index} onClick={() => handleDetailsolan(item.id)}>
                    <td>{item.id}</td>
                    <td>{item.tenKeHoach}</td>
                    <td>{item.ngayThucHien}</td>
                    <td>{item.ngayKetThuc}</td>
                    <td>{item.kinhPhi} VND</td>
                    <td>
                      <span className={`status-label ${item.trangThai === 'Hoàn thành' ? 'status-success' : 'status-open'}`}>
                        {item.trangThai}
                      </span>
                    </td>
                    <td className="actions ">
                      <button className="icon-button edit">
                        <Pencil size={16} />
                      </button>
                      <button className="icon-button delete">
                        <Trash size={16} />
                      </button>
                      {item.trangThai === 'Hoàn thành' && (
                        <button
                          className="icon-button create"
                          onClick={(e) => {
                            console.log(item);
                            
                            e.stopPropagation(); // Ngăn không cho click lan lên <tr>
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
              <button disabled>Previous</button>
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>Next</button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'goithau' && (
  <div className="goithau-tab">
    <h2>Danh sách gói thầu</h2>
    <div className="header-actions">
  <button className="btn btn-primary">Thêm gói thầu</button>
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
        {goiThauData.map((item, idx) => (
          <tr key={idx}>
            <td>{item.maGoiThau}</td>
            <td>{item.tenGoiThau}</td>
            <td>{item.tenLinhVuc}</td>
         
            <td className="status-cell">
              <span className={`status-label ${item.trangThai === 'Hoạt động' ? 'status-success' : 'status-pause'}`}>
                {item.trangThai}
              </span>
            </td>
            <td>{item.ngayTao}</td>
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
  </div>
)}

    </div>
  );
};

export default Moithau;
