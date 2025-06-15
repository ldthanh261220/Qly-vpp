import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './TaoHopDong.module.scss';
import classNames from 'classnames/bind';
import nhathauService from '~/services/nhathauService';
import { useSearchParams } from 'react-router-dom';
import hopdongService from '~/services/hopdongService';
const cx = classNames.bind(styles);

const TaoHopDong = () => {

  const [searchParams] = useSearchParams();
  const maNhaThau = searchParams.get('maNhaThau');
  const maPhienDauThau = searchParams.get('maPhienDauThau');

  const [tenNhaThau, setTenNhaThau] = useState('');
  const [formData, setFormData] = useState({

    maHopDong: `HD${Math.floor(Math.random() * 1000000).toString().padStart(8, '0')}`,
    tenHopDong: '',
    moTa: '',
    maPhienDauThau: maPhienDauThau || '',
    ngayKy: '',
    trangThai: 'Đã ký',
    noiDungHopDong: '',
    hinhThucThanhToan: '',
    thoiGianThucHien: '',
    thoiGianHoanThanh: '',
    maNhaThau: maNhaThau || '',
    maLinhVuc: ''
  });

  const hinhThucThanhToanOptions = [
    'Thanh toán chuyển khoản',
    'Thanh toán tiền mặt',
    'Thanh toán sau khi nhận hàng'
  ];

  useEffect(() => {
    const fetchTenNhaThau = async () => {
      try {
        const res = await nhathauService.getDetailNhaThauService(maNhaThau);
        setTenNhaThau(res.chitietnhathau?.tenNhaThau || '');
      } catch (err) {
        console.error('Lỗi khi lấy tên nhà thầu:', err);
      }
    };
    if (maNhaThau) fetchTenNhaThau();
  }, [maNhaThau]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await hopdongService.createHopDongService(formData);
      if (res.errCode === 0) {
        toast.success('Tạo hợp đồng thành công!');
        await hopdongService.updateMoiThauTaoHopDongService({maPhienDauThau: maPhienDauThau});
        setFormData(prev => ({
          ...prev,
          maHopDong: '',
          tenHopDong: '',
          moTa: '',
          ngayKy: '',
          noiDungHopDong: '',
          hinhThucThanhToan: '',
          thoiGianThucHien: '',
          thoiGianHoanThanh: '',
          maLinhVuc: ''
        }));
      } else {
        toast.error(res.message || 'Tạo thất bại');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi gửi yêu cầu!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cx('create-hopdong-form')}>
      <h2 className={cx('title')}>Tạo Hợp Đồng</h2>

      <div className={cx('form-group')}>
        <label>Mã hợp đồng</label>
        <input type="text" name="maHopDong" value={formData.maHopDong} onChange={handleChange} required />
      </div>

      <div className={cx('form-group')}>
        <label>Tên hợp đồng</label>
        <input type="text" name="tenHopDong" value={formData.tenHopDong} onChange={handleChange} required />
      </div>

      <div className={cx('form-group')}>
        <label>Mô tả</label>
        <textarea name="moTa" value={formData.moTa} onChange={handleChange} />
      </div>

      <div className={cx('form-group')}>
        <label>Ngày ký</label>
        <input type="date" name="ngayKy" value={formData.ngayKy} onChange={handleChange} required />
      </div>

      <div className={cx('form-group')}>
        <label>Nội dung hợp đồng</label>
        <textarea name="noiDungHopDong" value={formData.noiDungHopDong} onChange={handleChange} />
      </div>

      <div className={cx('form-group')}>
        <label>Hình thức thanh toán</label>
        <select name="hinhThucThanhToan" value={formData.hinhThucThanhToan} onChange={handleChange} required>
          <option value="">-- Chọn hình thức --</option>
          {hinhThucThanhToanOptions.map((opt, idx) => (
            <option key={idx} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className={cx('form-group')}>
        <label>Thời gian thực hiện</label>
        <input type="date" name="thoiGianThucHien" value={formData.thoiGianThucHien} onChange={handleChange} />
      </div>

      <div className={cx('form-group')}>
        <label>Thời gian hoàn thành</label>
        <input type="date" name="thoiGianHoanThanh" value={formData.thoiGianHoanThanh} onChange={handleChange} />
      </div>

      <div className={cx('form-group')}>
        <label>Nhà thầu</label>
        <input type="text" value={tenNhaThau} readOnly className={cx('readonly')} />
        <input type="hidden" name="maNhaThau" value={maNhaThau} />
      </div>

      <input type="hidden" name="maPhienDauThau" value={maPhienDauThau} />

      <button type="submit" className={cx('submit-btn')}>Tạo hợp đồng</button>
    </form>
  );
};

export default TaoHopDong;
