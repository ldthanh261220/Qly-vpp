// src/pages/Profile/index.jsx
import styles from './profile.module.scss';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Profile() {
    const user = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className={cx('not-logged-in')}>
                <h2>Bạn chưa đăng nhập</h2>
                <p>Vui lòng đăng nhập để xem thông tin cá nhân của bạn.</p>
                <button onClick={() => navigate('/login')} className={cx('login-btn')}>
                    Đăng nhập
                </button>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <h3>THÔNG TIN TÀI KHOẢN</h3>
        <div className={cx('profile-container')}>
            <div className={cx('profile-card')}>
                <div className={cx('avatar-section')}>
                    <img
                        src="https://i.pravatar.cc/150?img=12"
                        alt="User avatar"
                        className={cx('avatar')}
                    />
                    <h2 className={cx('name')}>{user.hoTen}</h2>
                    <p className={cx('role')}>{user.chucVu} – {user.donViCongTac}</p>
                </div>
                <div className={cx('info-section')}>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>Email:</span>
                        <span className={cx('value')}>{user.email}</span>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>Đơn vị:</span>
                        <span className={cx('value')}>{user.donViCongTac}</span>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>Chức vụ:</span>
                        <span className={cx('value')}>{user.chucVu}</span>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>Trạng thái:</span>
                        <span className={cx('value')}>{user.trangThai}</span>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Profile;
