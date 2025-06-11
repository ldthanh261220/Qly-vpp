import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ChiTietNhaThau.module.scss';
import classNames from 'classnames/bind';
import nhaThauService from '~/services/nhathauService';
import { ClipLoader } from 'react-spinners';

const cx = classNames.bind(styles);

const ChiTietNhaThau = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await nhaThauService.getDetailNhaThauService(id);
        if (response.errCode === 0) {
                setData(response.chitietnhathau);
            }
      } catch (err) {
        setError('Không thể tải dữ liệu nhà thầu!' +id);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className={cx('spinner-wrapper')}>
        <ClipLoader color="#3498db" size={50} />
      </div>
    );
  }

  if (error || !data) {
    return <p>{error || 'Không tìm thấy nhà thầu!'}</p>;
  }

  return (
    <div className={cx('container')}>
      <h1 className={cx('header-title')}>CHI TIET NHA THAU</h1>
      <div className={cx('info')}>
        <p><strong>Mã số thuế:</strong> {data.maSoThue}</p>
        <p><strong>Nơi cấp:</strong> {data.noiCap}</p>
        <p><strong>Tên nhà thầu:</strong> {data.tenNhaThau}</p>
        <p><strong>Tên viết tắt:</strong> {data.tenVietTat}</p>
        <p><strong>Loại hình DN:</strong> {data.loaiHinhDoanhNghiep}</p>
        <p><strong>Số GPKD:</strong> {data.soGiayPhepKinhDoanh}</p>
        <p><strong>Địa chỉ:</strong> {data.diaChi}</p>
        <p><strong>Website:</strong> <a href={data.website} target="_blank" rel="noreferrer">{data.website}</a></p>
        <p><strong>Người đại diện:</strong> {data.hoTenNguoiDaiDien} - {data.chucVuNguoiDaiDien}</p>
        <p><strong>Số định danh:</strong> {data.soDienDanh}</p>
        <p><strong>Ngày tạo:</strong> {new Date(data.ngaySinh).toLocaleDateString('vi-VN')}</p>
      </div>
      <button className={cx('btn-back')} onClick={() => navigate(-1)}>← Quay lại danh sách</button>
    </div>
  );
};

export default ChiTietNhaThau;
