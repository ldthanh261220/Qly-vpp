import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './taomoithau.scss';
import { useNavigate } from 'react-router-dom';

export default function TaoMoiHoSoMoiThau() {
   const navigate = useNavigate()
  const [keHoachList, setKeHoachList] = useState([]);
  const [selectedKeHoach, setSelectedKeHoach] = useState(null);
  const [goiThauList, setGoiThauList] = useState([]);
  const [selectedGoiThau, setSelectedGoiThau] = useState(null);
  const [dschonYeuCau, setChonYeuCau] = useState([]);
   const [dsNhaThau, setDanhSachNhaThau] = useState([]);
  const [formData, setFormData] = useState({
    ngayNopHoSo: '',
    ngayDauThau: '',
    ngayKetThuc: '',
  });

  useEffect(() => {
  if (selectedGoiThau?.maLinhVuc) {
    axios.get(`${process.env.REACT_APP_BACKEND}dsnhathaulv?malinhvuc=${selectedGoiThau.maLinhVuc}`)
      .then(res => setDanhSachNhaThau(res.data))
      .catch(err => console.error("Lỗi lấy nhà thầu:", err));
  }
}, [selectedGoiThau]);


  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND}getdskehoach`)
      .then(res => {
        const active = res.data.filter(kh => kh.trangThai === '0');
        setKeHoachList(active);
      })
      .catch(err => console.error("Lỗi kế hoạch:", err));
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND}dsgoithau`)
      .then(res => {
        const active = res.data.filter(gt => gt.trangThai === 'Hoạt động');
        setGoiThauList(active);
      })
      .catch(err => console.error("Lỗi gói thầu:", err));
  }, []);

  const handleRemoveNhaThau = (maNhaThau) => {
  setDanhSachNhaThau(prev => prev.filter(nt => nt.maNhaThau !== maNhaThau));
};


  const handleSubmit = async () => {
    if (!selectedKeHoach || !selectedGoiThau) {
      alert("Vui lòng chọn kế hoạch và gói thầu");
      return;
    }
     const confirm = window.confirm(
    'Bạn có chắc chắn muốn tạo hồ sơ mời thầu?\n\nHệ thống sẽ tạo phiên đấu thầu và gửi email cho các nhà thầu đã chọn.'
      );

  if (!confirm) return;
    const body = {
      KeHoach: selectedKeHoach,
      GoiThau: selectedGoiThau,
      duToanKinhPhi:selectedKeHoach.chiPhiKeHoach,
      ...formData,
      nhathau:dsNhaThau
    };
    console.log(body)
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND}taomoithau`, body);
      alert('Tạo hồ sơ thành công');
      navigate(`/moithau`);
    } catch (err) {
      console.error('Lỗi khi tạo hồ sơ mời thầu:', err);
    }
  };

  return (
    <div className="tao-ho-so">
      <h2>Tạo hồ sơ mời thầu</h2>

      <div className="form-group">
        <label>Chọn kế hoạch:</label>
        <select onChange={e => {
          const kh = keHoachList.find(k => k.maKeHoach === e.target.value);
          setSelectedKeHoach(kh);
          setChonYeuCau(kh?.yeucau || []);
        }}>
          <option value="">-- Chọn kế hoạch --</option>
          {keHoachList.map(kh => (
            <option key={kh.maKeHoach} value={kh.maKeHoach}>
              {kh.tenKeHoach}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Chọn gói thầu:</label>
        <select onChange={e => {
          const gt = goiThauList.find(g => g.maGoiThau === e.target.value);
          setSelectedGoiThau(gt);
        }}>
          <option value="">-- Chọn gói thầu --</option>
          {goiThauList.map(gt => (
            <option key={gt.maGoiThau} value={gt.maGoiThau}>
              {gt.tenGoiThau}
            </option>
          ))}
        </select>
      </div>

      {/* Thông tin kế hoạch + thiết bị */}
      {selectedKeHoach && (
        <div className="dual-grid">
          <div className="grid-item info-box">
            <h4>Chi tiết kế hoạch</h4>
            <p><strong>Tên:</strong> {selectedKeHoach.tenKeHoach}</p>
            <p><strong>Mô tả:</strong> {selectedKeHoach.moTa}</p>
            <p><strong>Ngày tạo:</strong> {new Date(selectedKeHoach.thoiGianBatDau).toLocaleDateString('vi-VN')}</p>
            <p><strong>Loại yêu cầu:</strong> {selectedKeHoach.loaiyeucau}</p>
            <p><strong>Chi phí:</strong> {Number(selectedKeHoach.chiPhiKeHoach).toLocaleString('vi-VN')}VND</p>
          </div>

          <div className="grid-item product-box">
            <h4>Danh sách {selectedKeHoach.loaiyeucau === 'mua sắm' ? 'vật dụng cần mua' : 'thiết bị cần sửa chữa'}</h4>
            {dschonYeuCau?.length > 0 ? (
              <table className="plan-table">
                <thead>
                  <tr>
                    <th>Tên</th>
                    <th>Số lượng</th>
                    {selectedKeHoach.loaiyeucau === 'mua sắm' ? (
                      <th>Mô tả chi tiết</th>
                    ) : (
                      <>
                        <th>Tình trạng thiết bị</th>
                        <th>Hình ảnh sửa chữa</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {dschonYeuCau.map((tb, index) => (
                    <tr key={index}>
                      <td>{tb.tenVatDung}</td>
                      <td>{Number(tb.soLuong).toLocaleString()}</td>
                      {selectedKeHoach.loaiyeucau === 'mua sắm' ? (
                        <td>{tb.moTaChiTiet}</td>
                      ) : (
                        <>
                          <td>{tb.tinhTrangThietBi}</td>
                          <td>
                            {tb.hinhAnhSuaChua ? (
                              <img src={tb.hinhAnhSuaChua} alt="Ảnh sửa chữa" style={{ width: "100px", borderRadius: "4px" }} />
                            ) : (
                              "Không có ảnh"
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Không có dữ liệu yêu cầu nào.</p>
            )}
          </div>
        </div>
      )}

      {/* Thông tin gói thầu */}
   {/* Thông tin gói thầu và danh sách nhà thầu */}
{selectedGoiThau && (
  <div className="info-block mt-3">
    <h4>Chi tiết gói thầu</h4>
    <p><strong>Tên:</strong> {selectedGoiThau.tenGoiThau}</p>
    <p><strong>Mô tả chi tiết:</strong> {selectedGoiThau.moTaChiTiet}</p>
    <p><strong>Tên lĩnh vực:</strong> {selectedGoiThau.tenLinhVuc}</p>  

    {/* Danh sách nhà thầu được mời */}
    <div className="form-group mt-2">
      <label>Nhà thầu được mời:</label>
      {dsNhaThau.length > 0 ? (
        <div className="nha-thau-list">
          {dsNhaThau.map(nhaThau => (
            <div key={nhaThau.maNhaThau} className="selected-item">
              <span>{nhaThau.tenNhaThau}</span>
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleRemoveNhaThau(nhaThau.maNhaThau)}
              >
                X
              </button>
            </div>
          ))}

        </div>
        
      ) : (
        <p>Chưa có nhà thầu nào được mời.</p>
      )}
    </div>
  </div>
)}

  
    {/* <select onChange={e => handleAddNhaThau(e.target.value)}>
  <option value="">-- Chọn nhà thầu để thêm --</option>
  {dsNhaThau
    .filter(nt => !selectedNhaThauList.some(s => s.maNhaThau === nt.maNhaThau))
    .map(nt => (
      <option key={nt.maNhaThau} value={nt.maNhaThau}>
        {nt.tenNhaThau}
      </option>
    ))}
</select>
     */}

      {/* Ngày tháng */}
      <div className="form-date-group">
        <div className="form-group">
          <label>Ngày nộp hồ sơ:</label>
          <input type="date" onChange={e => setFormData({ ...formData, ngayNopHoSo: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Ngày đấu thầu:</label>
          <input type="date" onChange={e => setFormData({ ...formData, ngayDauThau: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Ngày kết thúc:</label>
          <input type="date" onChange={e => setFormData({ ...formData, ngayKetThuc: e.target.value })} />
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>Tạo hồ sơ mời thầu</button>
    </div>
  );
}
