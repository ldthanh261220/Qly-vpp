import React, { useState, useEffect } from 'react';
import styles from './ChiTietHopDong.module.scss';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners';

import contractService from '~/services/hopdongService'; // Cập nhật đúng path
const cx = classNames.bind(styles);

const ChiTietHopDong = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updatedMoTa, setUpdatedMoTa] = useState('');
  const [updatedTrangThai, setUpdatedTrangThai] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await contractService.getDetailHopDongService(id);
        console.log(res)
        if(res.errCode === 0){
          setContract(res.chitiethopdong);
          setUpdatedMoTa(res.chitiethopdong.moTa);
          setUpdatedTrangThai(res.chitiethopdong.trangThai);
        }
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết hợp đồng:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = () => {
    setContract((prev) => ({
      ...prev,
      moTa: updatedMoTa,
      trangThai: updatedTrangThai,
    }));
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className={cx('loading')}>
        <ClipLoader size={50} color="#007bff" loading={true} />
      </div>
    );
  }

  if (!contract) return <div>Không tìm thấy hợp đồng</div>;

  return (
    <div className={cx('wrapper')}>
      <h3>Chi tiết hợp đồng: {contract.tenHopDong}</h3>
      <div className={cx('info')}>
        <p><strong>Mã:</strong> {contract.maHopDong}</p>
        <p><strong>Tên nhà thầu:</strong> {contract.tenNhaThau}</p>
        <p><strong>Ngày ký:</strong> {new Date(contract.ngayKy).toLocaleDateString('vi-VN')}</p>
        <p><strong>Ngày thuc hien:</strong> {new Date(contract.thoiGianThucHien).toLocaleDateString('vi-VN')}</p>
        <p><strong>Ngày hoan thanh:</strong> {new Date(contract.thoiGianHoanThanh).toLocaleDateString('vi-VN')}</p>
        <p><strong>Hình thức thanh toán:</strong> {contract.hinhThucThanhToan}</p>
        <p><strong>Nội dung hợp đồng:</strong> {contract.noiDungHopDong}</p>
        <p><strong>Trạng thái:</strong> {contract.trangThai}</p>
        <p><strong>Mô tả:</strong> {contract.moTa}</p>
        <button className={cx('btn-update')} onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      </div>

      {/* <h3>Danh sách sản phẩm</h3>
      <table className={cx('table')}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Số lượng mua</th>
            <th>Đã nhận</th>
            <th>Lỗi</th>
            <th>Giá</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {contract.sanPham?.map((sp, idx) => (
            <tr key={idx}>
              <td>{sp.ten}</td>
              <td>{sp.soLuongMua}</td>
              <td>{sp.soLuongDaNhan}</td>
              <td>{sp.soLuongLoi}</td>
              <td>{sp.gia.toLocaleString()}đ</td>
              <td>{sp.ghiChu}</td>
            </tr>
          ))}
        </tbody>
      </table> */}

      <div className={cx('div-icons')}>
        <button className={cx('btn-back')} onClick={() => navigate(-1)}>← Quay lại danh sách</button>
        <button className={cx('btn-up')} onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPenToSquare} /> Cập nhật
        </button>
      </div>

      {/* Modal cập nhật */}
      {showModal && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Cập nhật thông tin</h4>
            <label>Mô tả</label>
            <textarea value={updatedMoTa} onChange={(e) => setUpdatedMoTa(e.target.value)} />
            <label>Trạng thái</label>
            <select value={updatedTrangThai} onChange={(e) => setUpdatedTrangThai(e.target.value)}>
              <option value="Còn hiệu lực">Còn hiệu lực</option>
              <option value="Sắp hết hạn">Sắp hết hạn</option>
              <option value="Hết hạn">Hết hạn</option>
            </select>
            <div className={cx('modal-actions')}>
              <button onClick={handleUpdate} className={cx('btn-save')}>Lưu</button>
              <button onClick={() => setShowModal(false)} className={cx('btn-can')}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChiTietHopDong;
