import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './chitietmoithau.scss';

export default function ChiTietGoiThau() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [dschonYeuCau, setChonYeuCau] = useState([]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}detailmoithau?maphienthau=${id}`);
         setChonYeuCau(res.data.kehoach.yeucau)
        setData(res.data);
      } catch (err) {
        setError('Lỗi khi lấy dữ liệu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;
  if (!data) return <p>Không tìm thấy dữ liệu gói thầu</p>;

  const {
    kehoach, tenGoiThau, moTaChiTiet, duToanKinhPhi, trangThai,
    ngayTao, diaChi, ngayDauThau, ngayNopHoSo, ngayKetthuc,
    giaTrungThau, tenNhaThau, hoTenNguoiDaiDien, chucVuNguoiDaiDien,
    soGiayPhepKinhDoanh
  } = data;

  return (
    <div className="goi-thau-detail">
      <div className="section">
        <div className="section dual">

        <div className="info-block">
          <h3>{tenGoiThau}</h3>
          <p><strong>Mô tả:</strong> {moTaChiTiet}</p>
          <p><strong>Địa điểm:</strong> {diaChi}</p>
        <p><strong>Kinh phí dự toán:</strong> {Number(duToanKinhPhi).toLocaleString('vi-VN')} VND</p>


          <p><strong>Ngày tạo:</strong> {new Date(ngayTao).toLocaleDateString('vi-VN')}</p>
          <p><strong>Trạng thái:</strong> <span className={`status ${trangThai.toLowerCase()}`}>{trangThai}</span></p>
        </div>

        <div className="info-block">
          <h3>Thông tin phiên đấu thầu</h3>
          <p><strong>Ngày nhận hồ sơ:</strong> {new Date(ngayNopHoSo).toLocaleDateString('vi-VN')}</p>
          <p><strong>Ngày đấu thầu:</strong> {new Date(ngayDauThau).toLocaleDateString('vi-VN')}</p>
          <p><strong>Ngày kết thúc:</strong> {new Date(ngayKetthuc).toLocaleDateString('vi-VN')}</p>
          <p><strong>Giá trúng thầu:</strong> {Number(giaTrungThau).toLocaleString('vi-VN')} VND</p>

        </div>
        </div>
      </div>

      <div className="section">
        <h3>Danh sách sản phẩm</h3>
      {kehoach.loaiyc === 'mua sắm' ? (
          <table className="plan-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Số lượng</th>
                <th>Mô tả chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {dschonYeuCau.map((tb, index) => (
                <tr key={index}>
                  <td>{tb.tenVatDung}</td>
                  <td>{Number(tb.soLuong).toLocaleString()}</td>
                  <td>{tb.moTaChiTiet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="plan-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Số lượng</th>
                <th>Tình trạng thiết bị</th>
                <th>Hình ảnh sửa chữa</th>
              </tr>
            </thead>
            <tbody>
              {dschonYeuCau.map((tb, index) => (
                <tr key={index}>
                  <td>{tb.tenVatDung}</td>
                  <td>{Number(tb.soLuong).toLocaleString()}</td>
                  <td>{tb.tinhTrangThietBi}</td>
                  <td>
                    {tb.hinhAnhSuaChua ? (
                      <img src={tb.hinhAnhSuaChua} alt="Ảnh sửa chữa" style={{ width: "100px" }} />
                    ) : (
                      "Không có ảnh"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="section dual">
        <div className="info-block">
          <h3>Thông tin gói thầu</h3>
          <p><strong>Tên:</strong> {tenGoiThau}</p>
          <p><strong>Mô tả:</strong> {moTaChiTiet}</p>
          <p><strong>Địa điểm:</strong> {diaChi}</p>
          <p><strong>Trạng thái:</strong> {trangThai}</p>
          <p><strong>Ngày tạo:</strong> {new Date(ngayTao).toLocaleDateString('vi-VN')}</p>
        </div>
 
        {trangThai === 'Hoạt động' &&  (
          <div className="info-block">
            <h3>Thông tin nhà thầu</h3>
            <p><strong>Tên nhà thầu:</strong> {tenNhaThau}</p>
            <p><strong>Người đại diện:</strong> {hoTenNguoiDaiDien} ({chucVuNguoiDaiDien})</p>
            <p><strong>Giấy phép KD:</strong> {soGiayPhepKinhDoanh}</p>
          </div>
        )}
      </div>
       <div className="status-footer">
      {trangThai === 'Hoạt động' ? (
        <span className="status-tag hoat-dong">{trangThai}</span>
      ) : (
        <span className="status-tag khac">{trangThai}</span>
      )}
    </div>

    </div>
  );
}
