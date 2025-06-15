import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Suaphiendauthau.scss';

export default function CapNhatPhienThau() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('');
  const [nhaThauList, setNhaThauList] = useState([]);
  const [selectedNhaThau, setSelectedNhaThau] = useState('');
  const [giaTrungThauInput, setGiaTrungThauInput] = useState('');
  const [showAddNhaThau, setShowAddNhaThau] = useState(false);
  const [linhVucList, setLinhVucList] = useState([]);
  const [dschonYeuCau, setDsChonYeuCau] = useState([]);

  const [newNhaThau, setNewNhaThau] = useState({
    tenNhaThau: '',
    hoTenNguoiDaiDien: '',
    chucVuNguoiDaiDien: '',
    loaiHinhDoanhNGhiep: '',
    diaChi: '',
    website: '',
    soDieDanh: '',
    soGiayPhepKinhDoanh: '',
    Email: '',
    linhVuc: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailRes, nhaThauRes, linhVucRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND}detailmoithau?maphienthau=${id}`),
          axios.get(`${process.env.REACT_APP_BACKEND}getDsNhaThau`),
          axios.get(`${process.env.REACT_APP_BACKEND}getDsLinhVuc`)
        ]);

        setData(detailRes.data);
        setStatus(detailRes.data.trangThai);
        setGiaTrungThauInput(detailRes.data.giaTrungThau || '');
        setNhaThauList(nhaThauRes.data.danhsachnhathau);
        setLinhVucList(linhVucRes.data.danhsachlinhvuc.filter(lv => lv.trangThai === "Hoạt động"));
        setDsChonYeuCau(detailRes.data.dschonYeuCau || []);
        setSelectedNhaThau(detailRes.data.maNhaThau || ''); // Cập nhật selectedNhaThau từ data
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu:', err);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdateTrangThai = async () => {
    try {
      if (status === 'Hoàn thành' && (!selectedNhaThau || !giaTrungThauInput)) {
        alert('Vui lòng chọn nhà thầu và nhập giá trúng thầu khi trạng thái là Hoàn thành');
        return;
      }
      await axios.put(`${process.env.REACT_APP_BACKEND}updatephienthau?maPhienThau=${id}`, {
        trangThai: status,
        maNhaThau: selectedNhaThau || null,
        giaTrungThau: giaTrungThauInput ? Number(giaTrungThauInput) : null,
      });
      alert('Cập nhật trạng thái thành công');
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
      alert('Cập nhật thất bại');
    }
  };

  const handleAddNhaThau = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND}createNhaThau`, newNhaThau);
      const maNhaThau = res.data.maNhaThau;
      const added = { ...newNhaThau, maNhaThau };
      setNhaThauList([...nhaThauList, added]);
      setSelectedNhaThau(maNhaThau);
      setShowAddNhaThau(false);
    } catch (err) {
      console.error('Lỗi khi thêm nhà thầu:', err);
      alert('Thêm nhà thầu thất bại');
    }
  };

  if (!data) return <p>Đang tải dữ liệu...</p>;

  const {
    kehoach, tenGoiThau, moTaChiTiet, duToanKinhPhi, trangThai,
    ngayTao, diaChi, ngayDauThau, ngayNopHoSo, ngayKetthuc,
    giaTrungThau
  } = data;

  // Kiểm tra trạng thái hoàn thành
  const isCompleted = status === 'Hoàn thành';

  return (
    <div className="goi-thau-detail">
      {/* Thông tin gói thầu */}
      <div className="section dual">
        <div className="info-block">
          <h3>{tenGoiThau}</h3>
          <p><strong>Mô tả:</strong> {moTaChiTiet}</p>
          <p><strong>Địa điểm:</strong> {diaChi}</p>
          <p><strong>Kinh phí dự toán:</strong> {Number(duToanKinhPhi).toLocaleString('vi-VN')} VND</p>
          <p><strong>Ngày tạo:</strong> {new Date(ngayTao).toLocaleDateString('vi-VN')}</p>
          <p><strong>Trạng thái:</strong> <span className={`status ${isCompleted ? 'completed' : trangThai.toLowerCase()}`}>{trangThai}</span></p>
        </div>

        <div className="info-block">
          <h3>Thông tin phiên đấu thầu</h3>
          <p><strong>Ngày nhận hồ sơ:</strong> {new Date(ngayNopHoSo).toLocaleDateString('vi-VN')}</p>
          <p><strong>Ngày đấu thầu:</strong> {new Date(ngayDauThau).toLocaleDateString('vi-VN')}</p>
          <p><strong>Ngày kết thúc:</strong> {new Date(ngayKetthuc).toLocaleDateString('vi-VN')}</p>
          <p><strong>Giá trúng thầu:</strong> {Number(giaTrungThau).toLocaleString('vi-VN')} VND</p>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="section">
        <h3>Danh sách sản phẩm</h3>
        <table className="plan-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Số lượng</th>
              {kehoach.loaiyc === 'mua sắm' ? (
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
                {kehoach.loaiyc === 'mua sắm' ? (
                  <td>{tb.moTaChiTiet}</td>
                ) : (
                  <>
                    <td>{tb.tinhTrangThietBi}</td>
                    <td>
                      {tb.hinhAnhSuaChua ? (
                        <img src={tb.hinhAnhSuaChua} alt="Ảnh sửa chữa" style={{ width: "100px" }} />
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
      </div>

      {/* Cập nhật trạng thái & nhà thầu */}
      <div className="section">
        <h3>Cập nhật phiên đấu thầu</h3>
        <p>
          <strong>Trạng thái:</strong>
          <select value={status} onChange={e => !isCompleted && setStatus(e.target.value)} disabled={isCompleted}>
            <option value="Đang mở">Đang mở</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>
        </p>

     {isCompleted && (
      <div>
        <p>
          <strong>Nhà thầu trúng thầu:</strong>
          {nhaThauList.find(n => n.maNhaThau === selectedNhaThau)?.tenNhaThau || 'Chưa có thông tin'}
        </p>
        <p>
          <strong>Người đại diện::</strong>
          {nhaThauList.find(n => n.maNhaThau === selectedNhaThau)?.hoTenNguoiDaiDien}
        </p>
        <p>
          <strong>Email:</strong>
          {nhaThauList.find(n => n.maNhaThau === selectedNhaThau)?.Email || 'Chưa có thông tin'}
        </p>
        <p>
          <strong>Website:</strong>
          {nhaThauList.find(n => n.maNhaThau === selectedNhaThau)?.soGiayPhepKinhDoanh || 'Chưa có thông tin'}
        </p>
      </div>
    )}

        {!isCompleted && status === 'Hoàn thành' && (
          <>
            <p>
              <strong>Nhà thầu trúng thầu:</strong>
              <select value={selectedNhaThau} onChange={e => setSelectedNhaThau(e.target.value)} disabled={isCompleted}>
                <option value="">-- Chọn nhà thầu --</option>
                {nhaThauList.map(n => (
                  <option key={n.maNhaThau} value={n.maNhaThau}>{n.tenNhaThau}</option>
                ))}
              </select>
              <button className="add-nhathau-btn" onClick={() => setShowAddNhaThau(!showAddNhaThau)} disabled={isCompleted}>
                Thêm nhà thầu mới
              </button>
            </p>
            <p>
              <strong>Giá trúng thầu (VND):</strong>
              <input
                type="number"
                value={giaTrungThauInput}
                onChange={e => setGiaTrungThauInput(e.target.value)}
                placeholder="Nhập giá trúng thầu"
                className="gia-trung-thau-input"
                disabled={isCompleted}
              />
            </p>
          </>
        )}
        <div className="update-status-wrapper">
          <button className="update-status-btn" onClick={handleUpdateTrangThai} disabled={isCompleted}>
            Cập nhật trạng thái
          </button>
        </div>
      </div>

      {/* Modal thêm nhà thầu */}
      {!isCompleted && showAddNhaThau && (
        <>
          <div className="backdrop" onClick={() => setShowAddNhaThau(false)} />
          <div className="add-nhathau-form">
            <button className="close-btn" onClick={() => setShowAddNhaThau(false)}>✖</button>
            <input
              placeholder="Tên nhà thầu"
              value={newNhaThau.tenNhaThau}
              onChange={e => setNewNhaThau({ ...newNhaThau, tenNhaThau: e.target.value })}
            />
            <input
              placeholder="Người đại diện"
              value={newNhaThau.hoTenNguoiDaiDien}
              onChange={e => setNewNhaThau({ ...newNhaThau, hoTenNguoiDaiDien: e.target.value })}
            />
            <input
              placeholder="Chức vụ người đại diện"
              value={newNhaThau.chucVuNguoiDaiDien}
              onChange={e => setNewNhaThau({ ...newNhaThau, chucVuNguoiDaiDien: e.target.value })}
            />
            <input
              placeholder="Loại hình doanh nghiệp"
              value={newNhaThau.loaiHinhDoanhNGhiep}
              onChange={e => setNewNhaThau({ ...newNhaThau, loaiHinhDoanhNGhiep: e.target.value })}
            />
            <input
              placeholder="Địa chỉ"
              value={newNhaThau.diaChi}
              onChange={e => setNewNhaThau({ ...newNhaThau, diaChi: e.target.value })}
            />
            <input
              placeholder="Website"
              value={newNhaThau.website}
              onChange={e => setNewNhaThau({ ...newNhaThau, website: e.target.value })}
            />
            <input
              placeholder="Số giấy tờ định danh"
              value={newNhaThau.soDieDanh}
              onChange={e => setNewNhaThau({ ...newNhaThau, soDieDanh: e.target.value })}
            />
            <input
              placeholder="Giấy phép KD"
              value={newNhaThau.soGiayPhepKinhDoanh}
              onChange={e => setNewNhaThau({ ...newNhaThau, soGiayPhepKinhDoanh: e.target.value })}
            />
            <input
              placeholder="Email"
              value={newNhaThau.Email}
              onChange={e => setNewNhaThau({ ...newNhaThau, Email: e.target.value })}
            />
            <select
              value={newNhaThau.linhVuc}
              onChange={e => setNewNhaThau({ ...newNhaThau, linhVuc: e.target.value })}
            >
              <option value="">-- Chọn lĩnh vực --</option>
              {linhVucList.map(lv => (
                <option key={lv.maLinhVuc} value={lv.maLinhVuc}>{lv.tenLinhVuc}</option>
              ))}
            </select>
            <button onClick={handleAddNhaThau} disabled={isCompleted}>Lưu</button>
          </div>
        </>
      )}
    </div>
  );
}