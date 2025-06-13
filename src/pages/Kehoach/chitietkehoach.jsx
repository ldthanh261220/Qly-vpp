import React, { useState, useEffect } from 'react';
import './chitietkehoach.scss';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const ChiTietKeHoach = () => {
  const [keHoach, setKeHoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy mã kế hoạch từ URL hoặc location.state
  const { maKeHoach } = useParams();
  console.log(maKeHoach)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_BACKEND+`getkehoach?maKeHoach=${maKeHoach}`);
        setKeHoach(res.data);
      } catch (err) {
        console.error('Error fetching kế hoạch:', err);
        setError('Không tìm thấy kế hoạch hoặc lỗi server.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [maKeHoach]);

  const handleTaoHoSo = () => {
    if (!keHoach) return;
    navigate('/taohosomoithau', {
      state: {
        tenGoiThau: keHoach.tenKeHoach,
        duToanKinhPhi: `${keHoach.chiPhiTu || ''} - ${keHoach.chiPhiDen || ''}`,
        diaDiem: keHoach.diaDiem,
        thoiGianThucHien: keHoach.thoiGian,
        danhSachSanPham: keHoach.sanpham || [],
      }
    });
  };

  console.log(keHoach)
  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!keHoach) return <div>Không tìm thấy kế hoạch</div>;

  return (
    <div className="plan-detail">
      <button className="btn-back" onClick={() => navigate(-1)}>← Quay lại danh sách</button>
      <h2>Chi tiết kế hoạch</h2>

      <div className="plan-info">
        <div className="plan-row">
          <div><strong>Tên kế hoạch</strong><br />{keHoach.tenKeHoach}</div>
          <div><strong>Loại</strong><br />{keHoach.loaiyeucau}</div>
        </div>
        <div className="plan-row">
          <div><strong>Thời gian thực hiện</strong><br />{keHoach.thoiGianBatDau}</div>
          <div><strong>Địa điểm</strong><br />Trường đại học Sư phạm Kỹ thuật </div>
        </div>
        {/* <div className="plan-cost">
          <strong>Chi phí:</strong><br />
          <span className="highlight-cost">{keHoach.chiPhiTu} - {keHoach.chiPhiDen}</span>
        </div> */}
      </div>

     <table className="plan-table">
  {keHoach.loaiyeucau === "Mua sắm" ? (
    <>
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Số lượng</th>
        </tr>
      </thead>
      <tbody>
        {(keHoach.yeucau || []).map((sp, index) => (
          <tr key={index}>
            <td>{sp.tenVatDung}</td>
            <td>{sp.soLuong}</td>
          </tr>
        ))}
      </tbody>
    </>
  ) : (
    <>
      <thead>
        <tr>
          <th>Thiết bị</th>
          <th>Tình trạng thiết bị</th>
          <th>Số lượng</th>
        </tr>
      </thead>
      <tbody>
        {(keHoach.yeucau || []).map((sp, index) => (
          <tr key={index}>
            <td>{sp.tenVatDung}</td>
            <td>{sp.tinhTrangThietBi}</td>
            <td>{sp.soLuong}</td>
          </tr>
        ))}
      </tbody>
    </>
  )}
</table>


      <div className="plan-footer">
        <div className="status">
          Trạng thái: <span className="status-success">{keHoach.trangThai}</span>
        </div>
        <button className="btn-submit" onClick={handleTaoHoSo}>Tạo hồ sơ mời thầu</button>
      </div>
    </div>
  );
};

export default ChiTietKeHoach;
