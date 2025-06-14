import React, { useState } from 'react';
import styles from './Home.module.scss';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const cx = classNames.bind(styles);

const SECTIONS = [
  { key: 'intro', label: 'Giới thiệu' },
  { key: 'features', label: 'Tính năng' },
  { key: 'benefits', label: 'Lợi ích' },
  { key: 'guide', label: 'Hướng dẫn' },
  { key: 'contact', label: 'Liên hệ' },
];

const Home = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);
  const [active, setActive] = useState('intro');

  return (
    <motion.div className={cx('wrapper')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <nav className={cx('subnav')}>
        {SECTIONS.map(s => (
          <button
            key={s.key}
            className={cx('subnav-btn', { active: active === s.key })}
            onClick={() => setActive(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {active === 'intro' && (
        <section className={cx('section', 'intro')}>
          <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            Hệ thống Quản lý Văn phòng phẩm
          </motion.h1>
          <p>
            Hệ thống hỗ trợ cán bộ, giảng viên trong việc theo dõi, đề xuất, và quản lý văn phòng phẩm
            một cách hiệu quả, minh bạch và tiết kiệm thời gian.
          </p>
          {user ? (
            <motion.div className={cx('welcome')} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale:1, opacity:1 }} transition={{ delay: 0.6 }}>
              Chào mừng thầy/cô <strong>{user.hoTen}</strong> quay trở lại hệ thống.
            </motion.div>
          ) : (
            <motion.button onClick={() => navigate('/login')} className={cx('btn')} whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              Đăng nhập hệ thống
            </motion.button>
          )}
        </section>
      )}

      {active === 'features' && (
        <section className={cx('section', 'features')}>
          <h2>Tính năng nổi bật</h2>
          <div className={cx('feature-list')}>
            {/* ... giống phần hiện tại */}
          </div>
        </section>
      )}

      {active === 'benefits' && (
        <section className={cx('section', 'benefits')}>
          <h2>Lợi ích</h2>
          <ul>
            <li>⚙️ Tự động hóa quy trình nội bộ</li>
            <li>🛡️ Quản lý minh bạch, kiểm soát ngân sách</li>
            <li>📊 Báo cáo theo thời gian thực giúp ra quyết định nhanh chóng</li>
            <li>🔍 Lưu trữ lịch sử đề xuất, hợp đồng, yêu cầu dễ tra cứu</li>
          </ul>
        </section>
      )}

      {active === 'guide' && (
        <section className={cx('section', 'guide')}>
          <h2>Hướng dẫn nhanh</h2>
          <ol>
            <li>Đăng nhập hệ thống bằng tài khoản trường.</li>
            <li>Vào “Quản lý yêu cầu” để tạo/mở yêu cầu mới.</li>
            <li>Theo dõi tình trạng phê duyệt, thực hiện và thanh toán.</li>
            <li>Xem báo cáo & thống kê tại mục “Thống kê”.</li>
          </ol>
        </section>
      )}

      {active === 'contact' && (
        <section className={cx('section', 'contact')}>
          <h2>Liên hệ hỗ trợ</h2>
          <p>Bộ phận CNTT - Trường Đại học XYZ</p>
          <p>Email: support@xyz.edu.vn | Nội bộ: 1234</p>
        </section>
      )}

      <footer className={cx('footer')}>
        <p>Trường Đại học Sư Phạm Kỹ Thuật Đà Nẵng - Khoa Công nghệ Thông tin © {new Date().getFullYear()}</p>
      </footer>
    </motion.div>
  );
};

export default Home;
