import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import config from '~/config';
import { Link } from 'react-router-dom';
import Menu from '~/components/Popper/Menu';
import TimeDate from '~/components/TimeDate';

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
        title: 'Văn bản pháp quy',
    },
    {
        title: 'Nhà thầu được phê duyệt',
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
    const currentUser = true;

    // Handle logic
    const handleLanguageChange = (item) => {
        console.log('Selected language:', item);
        // TODO: Thay đổi ngôn ngữ trong app tại đây (ví dụ: i18n.changeLanguage(item.code))
    };

    return (
        <header>
            {/* -- HEADER TOP-- */}
            <div className={cx('header-top')}>
                <div className={cx('container')}>
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
                <div className={cx('container')}>
                    <div className={cx('menu-left')}>
                        <div className={cx('menu-item')}>Trang chủ</div>
                        <Menu items={SEARCH_ITEMS} onChange={handleLanguageChange} V2>
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
                            <div className={cx('user-text')}>
                                <div className={cx('user-name')}>
                                    <strong>Thành Lê</strong>
                                </div>
                                <div className={cx('user-role')}>Nhà thầu</div>
                            </div>
                            <img src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" alt="Avatar" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
