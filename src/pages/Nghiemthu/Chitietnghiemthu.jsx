import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './chitietnghiemthu.scss';

const ChitietNghiemThu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [KeHoach, setKeHoach] = useState(null);
  const [ghiChuList, setGhiChuList] = useState({});
  const [hinhAnhList, setHinhAnhList] = useState({}); // State for images
  const [selectedImage, setSelectedImage] = useState(null); // State for modal image
  const [trangThaiNghiemThu, setTrangThaiNghiemThu] = useState('Đạt yêu cầu');

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}detailnghiemthu?maNghiemthu=${id}`)
      .then((response) => {
        setKeHoach(response.data);
        const initialGhiChu = response.data.sanpham.reduce((acc, sp) => {
          acc[sp.mayc_ms] = '';
          return acc;
        }, {});
        const initialHinhAnh = response.data.sanpham.reduce((acc, sp) => {
          acc[sp.mayc_ms] = null;
          return acc;
        }, {});
        setGhiChuList(initialGhiChu);
        setHinhAnhList(initialHinhAnh);
      })
      .catch((error) => {
        console.error('Axios error:', error);
      });
  }, [id]);

  const handleGhiChuChange = (mayc_ms, value) => {
    setGhiChuList((prev) => ({
      ...prev,
      [mayc_ms]: value,
    }));
  };

  const handleHinhAnhChange = (mayc_ms, event) => {
    const file = event.target.files[0];
    setHinhAnhList((prev) => ({
      ...prev,
      [mayc_ms]: file,
    }));
  };

  const handleRemoveImage = (mayc_ms) => {
    setHinhAnhList((prev) => ({
      ...prev,
      [mayc_ms]: null,
    }));
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handleTrangThaiChange = (e) => {
    setTrangThaiNghiemThu(e.target.value);
  };

  const handleXacNhan = async () => {
    try {
      const noiDung = Object.entries(ghiChuList)
        .map(([mayc_ms, ghiChu]) => {
          const hinhAnh = hinhAnhList[mayc_ms];
          const hinhAnhName = hinhAnh ? hinhAnh.name : '';
          return `${ghiChu}${hinhAnhName ? `,${hinhAnhName}` : ''}`;
        })
        .join('|');

      const last8 = KeHoach.maKeHoach.slice(-8);
      const maNghiemThu = `NT${last8}`;
      const formData = new FormData();
      formData.append('maNghiemThu', maNghiemThu);
      formData.append('maKeHoach', KeHoach.maKeHoach);
      formData.append('trangThai', trangThaiNghiemThu);
      formData.append('noiDung', noiDung);
      formData.append('ngayTao', new Date().toISOString());

      Object.entries(hinhAnhList).forEach(([mayc_ms, file]) => {
        if (file) {
          formData.append(`hinhAnhNghiemThu_${mayc_ms}`, file);
        }
      });

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND}xacnhannghiemthu`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      alert(response.data.message || 'Xác nhận nghiệm thu thành công!');
      navigate('/Nghiemthu');
    } catch (error) {
      console.error('Lỗi xác nhận nghiệm thu:', error);
      alert(error.response?.data?.message || 'Lỗi khi xác nhận nghiệm thu, vui lòng thử lại.');
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
    yeucau: sanpham,
    nghiemThu,
    daNghiemThu,
  } = KeHoach;

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
      </div>

      <table className="sanpham-table">
        <thead>
          <tr>
            <th>Tên vật dụng</th>
            <th>Mô tả chi tiết</th>
            <th>Số lượng</th>
            <th>Ghi chú</th>
            <th>Hình ảnh</th>
          </tr>
        </thead>
        <tbody>
          {sanpham.map((sp) => (
            <tr key={sp.mayc_ms}>
              <td>{sp.tenVatDung}</td>
              <td>{sp.moTaChiTiet}</td>
              <td>{sp.soLuong}</td>
              <td>
                {daNghiemThu ? (
                  <span>{(nghiemThu?.noiDung || '').split('|').find((item) => item.split(',')[0])?.split(',')[0] || ''}</span>
                ) : (
                  <textarea
                    value={ghiChuList[sp.mayc_ms] || ''}
                    onChange={(e) => handleGhiChuChange(sp.mayc_ms, e.target.value)}
                    placeholder="Nhập ghi chú..."
                    rows={2}
                    className="ghi-chu-textarea"
                  />
                )}
              </td>
              <td>
                {daNghiemThu ? (
                  <span>{(nghiemThu?.noiDung || '').split('|').find((item) => item.split(',')[1])?.split(',')[1] || 'Không có'}</span>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleHinhAnhChange(sp.mayc_ms, e)}
                      className="hinh-anh-input"
                    />
                    {hinhAnhList[sp.mayc_ms] && (
                      <div className="image-preview">
                        <img
                          src={URL.createObjectURL(hinhAnhList[sp.mayc_ms])}
                          alt="Preview"
                          className="preview-image"
                          onClick={() => handleImageClick(hinhAnhList[sp.mayc_ms])}
                        />
                        <button className="remove-image" onClick={() => handleRemoveImage(sp.mayc_ms)}>×</button>
                      </div>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
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
          <p className="xacnhan">Đã xác nhận nghiệm thu</p>
        ) : (
          <button className="btn-xac-nhan" onClick={handleXacNhan}>
            Xác nhận nghiệm thu
          </button>
        )}
      </div>

      {selectedImage && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={URL.createObjectURL(selectedImage)} alt="Enlarged" className="modal-image" />
            <button className="close-modal" onClick={handleCloseModal}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChitietNghiemThu;