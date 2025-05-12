import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DanhSachNhaThau } from '../data';
import styles from './ChiTietNhaThau.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const ChiTietNhaThau = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const data = DanhSachNhaThau.find(n => n.ma === id);

  if (!data) return <p>Không tìm thấy nhà thầu!</p>;

  return (
    <div className={cx('container')}>
      <h1>Chi tiết nhà thầu</h1>
      <div className={cx('info')}>
        <p><strong>Mã số thuế:</strong> {data.maSoThue}</p>
        <p><strong>Nơi cấp:</strong> {data.noiCap}</p>
        <p><strong>Tên nhà thầu:</strong> {data.tenNhaThau}</p>
        <p><strong>Tên viết tắt:</strong> {data.tenVietTat}</p>
        <p><strong>Loại hình DN:</strong> {data.loaiHinhDN}</p>
        <p><strong>Số GPKD:</strong> {data.soGPKD}</p>
        <p><strong>Địa chỉ:</strong> {data.diaChi}</p>
        <p><strong>Website:</strong> <a href={data.website} target="_blank" rel="noreferrer">{data.website}</a></p>
        <p><strong>Người đại diện:</strong> {data.hoTenNguoiDaiDien} - {data.chucVuNguoiDaiDien}</p>
        <p><strong>Số định danh:</strong> {data.soDinhDanh}</p>
        <p><strong>Ngày tạo:</strong> {data.ngayTao}</p>
      </div>
      <button className={cx('btn-back')} onClick={() => navigate(-1)}>← Quay lại danh sách</button>
    </div>
  );
};

export default ChiTietNhaThau;
