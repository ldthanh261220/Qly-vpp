import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import config from '~/config';
import { Link, useNavigate } from 'react-router-dom';
import Menu from '~/components/Popper/Menu';
import TimeDate from '~/components/TimeDate';
import { useState } from 'react';
import Login from './Login';
import { useSelector } from 'react-redux';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '~/store/reducers/userReducer';

const cx = classNames.bind(styles);

const LANGUAGE_ITEMS = [
    {
        code: 'vi',
        title: 'Tiếng Việt',
    },
    {
        code: 'en',
        title: 'English',
    },
];
const SEARCH_ITEMS = [
    {
        title: 'Danh sách thiết bị',
        to: config.routes.Dsthietbi,
    },
    {
        title: 'Văn bản pháp quy',
    },
    {
        id: 'approved_contractors',
        title: 'Nhà thầu được phê duyệt',
    },
];
const USER_ITEMS = [
    {
        icon: <LayoutDashboard size={18} />,
        title: 'Trang tổng quan',
        to: config.routes.home,
    },
    {
        icon: <LogOut size={18} />,
        title: 'Đăng xuất',
    },
];
const HDSD_ITEMS = [
    {
        title: 'Đơn vị sử dụng',
    },
    {
        title: 'Trưởng phòng CSVC',
    },
    {
        title: 'Phó trưởng phòng CSVC',
    },
    {
        title: 'Chuyên viên CSVC',
    },
    {
        title: 'Nhân viên kỹ thuật',
    },
    {
        title: 'Ban giám hiệu',
    },
];
function Header() {
    const user = useSelector((state) => state.user.currentUser);
    const [showLoginModal, setshowLoginModal] = useState(false);

    const navigate = useNavigate();
    const handleTracuuClick = (item) => {
        if (item.to) {
            navigate(item.to);
        }
    };
    // Handle logic
    const handleLanguageChange = (item) => {
        console.log('Selected language:', item);
        // TODO: Thay đổi ngôn ngữ trong app tại đây (ví dụ: i18n.changeLanguage(item.code))
    };
    const dispatch = useDispatch();
    const handleUserClick = (item) => {
        if (item.title === 'Đăng xuất') {
            dispatch(logout());
            navigate(config.routes.home); // Chuyển hướng sau khi đăng xuất (tùy chọn)
        } else if (item.to) {
            navigate(item.to);
        }
    };
    const handleShowLogin = () => {
        setshowLoginModal(true);
    };
    const handleCloseLoginModals = () => {
        setshowLoginModal(false);
    };
    return (
        <header>
            {/* -- HEADER TOP-- */}
            <div className={cx('header')}>
                <div className={cx('header-top')}>
                    <div className={cx('header-container')}>
                        <Link to={config.routes.home} className={cx('logo-title')}>
                            <img
                                src="https://reviewedu.net/wp-content/uploads/2021/08/dai-hoc-su-pham-ky-thuat-da-nang-ute-1.jpg"
                                alt="UTE logo"
                            />
                            <div className={cx('logo-text')}>
                                <h1>Hệ thống đấu thầu điện tử</h1>
                                <h2>Đại học sư phạm kỹ thuật</h2>
                                <div className={cx('slogan')}>
                                    Minh bạch – Công bằng – Hiệu quả: Hệ thống đấu thầu UTE vì sự phát triển bền vững.
                                </div>
                            </div>
                        </Link>
                        <div className={cx('header-right')}>
                            <div className={cx('support')}>
                                <span className={cx('phone-icon')}>📞</span> Tổng đài hỗ trợ: 19006126
                            </div>
                            <Menu items={LANGUAGE_ITEMS} onChange={handleLanguageChange}>
                                <div className={cx('language')}>
                                    <img src="https://flagcdn.com/w40/vn.png" alt="VN" />
                                    Tiếng Việt <span className={cx('dropdown-arrow')}>▼</span>
                                </div>
                            </Menu>
                        </div>
                    </div>
                </div>

                {/* -- MENU BAR-- */}
                <div className={cx('header-menu')}>
                    <div className={cx('header-container')}>
                        <div className={cx('menu-left')}>
                            <div className={cx('menu-item')}>Trang chủ</div>
                            <Menu items={SEARCH_ITEMS} onChange={handleTracuuClick} V2>
                                <div className={cx('menu-item')}>Tra cứu</div>
                            </Menu>
                            <div className={cx('menu-item')}>Câu hỏi thường gặp</div>
                            <Menu items={HDSD_ITEMS} onChange={handleLanguageChange} V2>
                                <div className={cx('menu-item')}>Hướng dẫn sử dụng</div>
                            </Menu>
                            <div className={cx('menu-item')}>Liên hệ</div>
                        </div>
                        <div className={cx('menu-right')}>
                            {/* <div className={cx('menu-item')}>Giới thiệu</div>
                        <div className={cx('menu-item')}>Tin tức</div>
                        <div className={cx('menu-item')}>Thông báo của bộ</div>
                        <div className={cx('menu-item')}>Liên hệ - Góp ý</div> */}
                            <div className={cx('notification-icon')}>
                                <span>🔔</span>
                            </div>
                            <div className={cx('time-date')}>
                                <TimeDate />
                            </div>

                            <div className={cx('user-info')}>
                                {user ? (
                                    <Menu items={USER_ITEMS} onChange={handleUserClick} V3>
                                        <div className={cx('info-container')}>
                                            <div className={cx('user-text')}>
                                                <div className={cx('user-name')}>
                                                    <strong>{user.hoTen}</strong>
                                                </div>
                                                <div className={cx('user-role')}>Nhà thầu</div>
                                            </div>
                                            <img
                                                src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
                                                alt="Avatar"
                                            />
                                        </div>
                                    </Menu>
                                ) : (
                                    <button className={cx('btn-login')} onClick={handleShowLogin}>
                                        Đăng nhập
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showLoginModal && <Login onClose={handleCloseLoginModals} />}
        </header>
    );
}

export default Header;
