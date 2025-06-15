import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styles from './TaoNhaThau.module.scss';
import classNames from 'classnames/bind';
import linhvucService from '~/services/linhvucService';
import nhathauService from '~/services/nhathauService';
const cx = classNames.bind(styles);

const TaoNhaThau = () => {
    const randomId = `NT${Math.floor(Math.random() * 1000000).toString().padStart(8, '0')}`;
  const [formData, setFormData] = useState({
    maNhaThau: randomId,
    maSoThue: '',
    noiCap: '',
    tenNhaThau: '',
    tenVietTat: '',
    loaiHinhDoanhNghiep: '',
    soGiayPhepKinhDoanh: '',
    diaChi: '',
    website: '',
    hoTenNguoiDaiDien: '',
    chucVuNguoiDaiDien: '',
    soDienDanh: '',
    ngaySinh: '',
    maLinhVuc: ''
  });

  const [linhVucOptions, setLinhVucOptions] = useState([]);

  useEffect(() => {
    const fetchLinhVuc = async () => {
      try {
        const res = await linhvucService.getAllLinhVucService();
        if (res.errCode === 0) {
          setLinhVucOptions(res.danhsachlinhvuc);
        }
      } catch (err) {
        toast.error('Lỗi khi lấy danh sách lĩnh vực!');
      }
    };
    fetchLinhVuc();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await nhathauService.createNhaThauService(formData);
      if (res.errCode === 0) {
        toast.success('Tạo nhà thầu thành công!');
        setFormData({
          maNhaThau: '',
          maSoThue: '',
          noiCap: '',
          tenNhaThau: '',
          tenVietTat: '',
          loaiHinhDoanhNghiep: '',
          soGiayPhepKinhDoanh: '',
          diaChi: '',
          website: '',
          hoTenNguoiDaiDien: '',
          chucVuNguoiDaiDien: '',
          soDienDanh: '',
          ngaySinh: '',
          maLinhVuc: ''
        });
      } else {
        toast.error(res.data.message || 'Tạo thất bại');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi gửi yêu cầu!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cx('create-nhathau-form')}>
      <h2 className={cx('title')}>Tạo Nhà Thầu</h2>

      {Object.entries({
        maNhaThau: 'Mã nhà thầu',
        maSoThue: 'Mã số thuế',
        noiCap: 'Nơi cấp',
        tenNhaThau: 'Tên nhà thầu',
        tenVietTat: 'Tên viết tắt',
        loaiHinhDoanhNghiep: 'Loại hình doanh nghiệp',
        soGiayPhepKinhDoanh: 'Số GPKD',
        diaChi: 'Địa chỉ',
        website: 'Website',
        hoTenNguoiDaiDien: 'Họ tên người đại diện',
        chucVuNguoiDaiDien: 'Chức vụ người đại diện',
        soDienDanh: 'Số điện danh',
        ngaySinh: 'Ngày thành lập'
      }).map(([key, label]) => (
        <div className={cx('form-group')} key={key}>
          <label>{label}</label>
          <input
            type={key === 'ngaySinh' ? 'date' : 'text'}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            required={key === 'maNhaThau' || key === 'tenNhaThau'}
          />
        </div>
      ))}

      <div className={cx('form-group')}>
        <label>Lĩnh vực</label>
        <select
          name="maLinhVuc"
          value={formData.maLinhVuc}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn lĩnh vực --</option>
          {Array.isArray(linhVucOptions) && linhVucOptions.map((lv) => (
            <option key={lv.maLinhVuc} value={lv.maLinhVuc}>{lv.tenLinhVuc}</option>
          ))}
        </select>
      </div>

      <button type="submit" className={cx('submit-btn')}>Tạo nhà thầu</button>
    </form>
  );
};

export default TaoNhaThau;
