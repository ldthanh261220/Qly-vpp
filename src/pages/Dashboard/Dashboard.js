import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.scss';
import classNames from 'classnames/bind';
import { Bar, Pie, Line } from 'react-chartjs-2';
import dashboardService from '~/services/dashboardService';
import { ClipLoader } from 'react-spinners';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const cx = classNames.bind(styles);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1); // JS tháng bắt đầu từ 0
  const [year, setYear] = useState(now.getFullYear());
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getDashboardData(month, year);
        if (res.errCode === 0) {
          setData(res.dashboard);
        }
        else {
          setError('Lỗi lấy dữ liệu dashboard!')
          toast.error('Lỗi khi tải dashboard!');
        }
      } catch (err) {
        console.error('Lỗi lấy dữ liệu dashboard:', err);
        setError('Lỗi lấy dữ liệu dashboard!')
        toast.error('Lỗi khi tải dashboard!');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [month, year]);

  if (loading) {
    return (
      <div className={cx('loading')}>
        <ClipLoader color="#007bff" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cx('dashboard')}>
        {error}
      </div>
    );
  }
  return (
    <div className={cx('dashboard')}>
      <div className={cx('header-filter')}>
        <h2>📊 Thống kê hệ thống</h2>
        <div className={cx('filters')}>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            <option value="">-- Chọn tháng --</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
            ))}
          </select>

          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            <option value="">-- Chọn năm --</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={cx('stats')}>
        <div className={cx('card')}><p>Tổng nhà thầu</p><h3>{data.totalNhaThau}</h3></div>
        <div className={cx('card')}><p>Tổng hợp đồng</p><h3>{data.totalHopDong}</h3></div>
        <div className={cx('card')}><p>Tổng phiên đấu thầu</p><h3>{data.totalPhienDauThau}</h3></div>
        <div className={cx('card')}><p>Tổng thiết bị</p><h3>{data.totalThietBi}</h3></div>
        <div className={cx('card')}><p>Tổng yêu cầu</p><h3>{data.totalYeuCau}</h3></div>
      </div>

      <div className={cx('charts')}>
        <div className={cx('chartBox')}>
          <h4>Số lượng nhà thầu theo lĩnh vực</h4>
          <Bar
            data={{
              labels: data.nhaThauByLinhVuc.map(item => item.tenLinhVuc),
              datasets: [{
                label: 'Số lượng',
                data: data.nhaThauByLinhVuc.map(item => item.total),
                backgroundColor: '#007bff'
              }]
            }}
          />
        </div>

        <div className={cx('chartBox')}>
          <h4>Trạng thái hợp đồng</h4>
          <Pie
            data={{
              labels: data.hopDongByTrangThai.map(item => item.trangThai),
              datasets: [{
                label: 'Tỷ lệ',
                data: data.hopDongByTrangThai.map(item => item.total),
                backgroundColor: ['#28a745', '#ffc107', '#dc3545']
              }]
            }}
          />
        </div>

        <div className={cx('chartBox')}>
          <h4>Số lượng hợp đồng theo tháng</h4>
          <Line
            data={{
              labels: data.hopDongByMonth.map(item => `Tháng ${item.month}`),
              datasets: [{
                label: 'Hợp đồng',
                data: data.hopDongByMonth.map(item => item.total),
                borderColor: '#17a2b8',
                backgroundColor: 'rgba(23, 162, 184, 0.2)',
                fill: true
              }]
            }}
          />
        </div>
        <div className={cx('chartBox')}>
          <h4>Số lượng thiết bị theo danh mục</h4>
          <Bar
            data={{
              labels: data.thietBiByDanhMuc.map(i => i.tenDanhMuc),
              datasets: [{
                label: 'Thiết bị',
                data: data.thietBiByDanhMuc.map(i => i.total),
                backgroundColor: '#6f42c1'
              }]
            }}
          />
        </div>

        <div className={cx('chartBox')}>
          <h4>Phân loại yêu cầu</h4>
          <Pie
            data={{
              labels: data.yeuCauByLoai.map(i => i.loaiYeuCau),
              datasets: [{
                label: 'Yêu cầu',
                data: data.yeuCauByLoai.map(i => i.total),
                backgroundColor: ['#fd7e14', '#20c997', '#6610f2']
              }]
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
