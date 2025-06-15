import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './chitietnghiemthu.scss';

const ChitietNghiemThu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [KeHoach, setKeHoach] = useState(null);
  const [ghiChuList, setGhiChuList] = useState({});
  const [Data, setData] = useState({});
  const [trangThaiNghiemThu, setTrangThaiNghiemThu] = useState('Đạt yêu cầu');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}detailnghiemthu?maNghiemthu=${id}`)
      .then((response) => {
        const data = response.data;
      setData(data.data)
        setKeHoach(data);

        const initialGhiChu = data.sanpham.reduce((acc, sp, idx) => {
          acc[`${sp.mayc_ms}_${idx}`] = '';
          return acc;
        }, {});
        setGhiChuList(initialGhiChu);
      })
      .catch((error) => {
        console.error('Axios error:', error);
      });
  }, [id]);

  const handleGhiChuChange = (key, value) => {
    setGhiChuList((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTrangThaiChange = (e) => {
    setTrangThaiNghiemThu(e.target.value);
  };

  const handleXacNhan = async () => {
  try {
    // Use KeHoach.yeucau instead of undefined yeucau
    const noiDung = KeHoach.yeucau.map((sp, idx) => {
      const key = `${sp.mayc_ms}_${idx}`;
      return ghiChuList[key] || '';
    }).join('|');
  
    // Ensure maKeHoach exists and has enough characters
    if (!KeHoach.maKeHoach || KeHoach.maKeHoach.length < 8) {
      throw new Error('Mã kế hoạch không hợp lệ');
    }
    const last8 = KeHoach.maKeHoach.slice(-8);
    const maNghiemThu = `NT${last8}`;

    const payload = {
      maNghiemThu,
      maKeHoach: KeHoach.maKeHoach,
      hinhAnhNghiemThu: '',
      trangThai: trangThaiNghiemThu,
      noiDung,
      ngayTao: new Date().toISOString(),
    };

    console.log(payload)
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND}/xacnhannghiemthu`, // Add leading slash for consistency
      payload
    );

    alert(response.data.message || 'Xác nhận nghiệm thu thành công!');
    navigate('/Nghiemthu');
  } catch (error) {
    console.error('Lỗi xác nhận nghiệm thu:', error);
    alert(
      error.response?.data?.message || 'Lỗi khi xác nhận nghiệm thu, vui lòng thử lại.'
    );
  }
};

  if (!KeHoach) {
    return <div>Đang tải...</div>;
  }

  const {
    maKeHoach,
    tenKeHoach,
    chuBuTu,
    donVi,
    loaiyeucau,
    thoiGianBatDau,
    thoiGianKetThuc,
    trangThai,
    yeucau,
    nghiemThu,
    daNghiemThu,
  } = KeHoach;

  const danhSachGhiChuDaLuu = (nghiemThu?.noiDung || '').split('|');

  return (
    <div className="chitiet-KeHoach-container">
      <h2>Chi tiết nghiệm thu</h2>
      <div className="KeHoach-info">
        <h3>{tenKeHoach}</h3>
        <div className="info-columns">
          <div className="info-column info-left">
            <p><strong>Mã nghiệm thu:</strong> {nghiemThu?.maNghiemthu || 'Chưa có'}</p>
            <p><strong>Mã kế hoạch:</strong> {maKeHoach}</p>
            <p><strong>Chủ bút từ:</strong> {chuBuTu}</p>
            <p><strong>Đơn vị:</strong> {donVi}</p>
            <p><strong>Loại yêu cầu:</strong> {loaiyeucau}</p>
          </div>
          <div className="info-column info-right">
            <p><strong>Thời gian bắt đầu:</strong> {thoiGianBatDau ? new Date(thoiGianBatDau).toLocaleDateString('vi-VN') : ''}</p>
            <p><strong>Thời gian kết thúc:</strong> {thoiGianKetThuc ? new Date(thoiGianKetThuc).toLocaleDateString('vi-VN') : ''}</p>
            <p><strong>Trạng thái kế hoạch:</strong> {trangThai}</p>
            <p><strong>Nội dung nghiệm thu:</strong> {nghiemThu?.noiDung || 'Chưa có'}</p>
            <p><strong>Ngày tạo:</strong> {nghiemThu?.ngayTao ? new Date(nghiemThu.ngayTao).toLocaleDateString('vi-VN') : ''}</p>
          </div>
        </div>

        <div className="info-columns">
          <div className="info-column info-left">
            <h2>Phiên thầu-Nhà thầu</h2>
            <p><strong>Phiên thầu</strong> {nghiemThu?.maNghiemthu || 'Chưa có'}</p>
          <p><strong>Ngày đấu thầu:</strong> {new Date(Data.ngayDauThau).toLocaleDateString('vi-VN')}</p>
        <p><strong>Ngày kết thúc:</strong> {new Date(Data.ngayKetthuc).toLocaleDateString('vi-VN')}</p>

            <p><strong>Kinh phí</strong> {Data.giaTrungThau}</p>
             <p><strong>Tên nhà thầu:</strong> {Data.tenNhaThau}</p>
            <p><strong>Địa chỉ:</strong> {Data.diaChi}</p>
            <p><strong>website:</strong> {Data.website}</p>
            <p><strong>Email:</strong> {Data.Email}</p>
          </div>
          
        
          <div className="info-column info-right">
            <h2>Hợp đồng</h2>
    
            <p><strong>Hình thức thanh toán:</strong> {Data.hinhThucThanhToan}</p>
            <p><strong>Tên hợp đồng:</strong> {Data.tenHopDong}</p>
            <p><strong>Nội dung:</strong> {Data.noiDungHopDong}</p>
            <p><strong>Ngày kí:</strong> {nghiemThu?.ngayTao ? new Date(Data.ngayKy).toLocaleDateString('vi-VN') : ''}</p>
          </div>
      
      </div>
      </div>

      <table className="sanpham-table">
        <thead>
          <tr>
            <th>Tên vật dụng</th>
            <th>Mô tả chi tiết</th>
            <th>Số lượng</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {yeucau.map((sp, index) => {
            const key = `${sp.mayc_ms}_${index}`;
            return (
              <tr key={key}>
                <td>{sp.tenVatDung}</td>
                <td>{sp.moTaChiTiet}</td>
                <td>{sp.soLuong}</td>
                <td>
                  {daNghiemThu ? (
                    <span>{danhSachGhiChuDaLuu[index] || ''}</span>
                  ) : (
                    <textarea
                      value={ghiChuList[key] || ''}
                      onChange={(e) => handleGhiChuChange(key, e.target.value)}
                      placeholder="Nhập ghi chú..."
                      rows={2}
                      className="ghi-chu-textarea"
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="trangthai-wrapper" style={{ marginBottom: '20px' }}>
        <label><strong>Trạng thái nghiệm thu: </strong></label>
        <select value={trangThaiNghiemThu} onChange={handleTrangThaiChange}>
          <option value="Đạt yêu cầu">Đạt yêu cầu</option>
          <option value="Không đạt yêu cầu">Không đạt yêu cầu</option>
        </select>
      </div>

      <div className="button-wrapper">
        {daNghiemThu ? (
          <p className='xacnhan'>Đã xác nhận nghiệm thu</p>
        ) : (
          <button className="btn-xac-nhan" onClick={handleXacNhan}>
            Xác nhận nghiệm thu
          </button>
        )}
      </div>
    </div>
  );
};

export default ChitietNghiemThu;
