import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import config from '~/config';
import { Link, useNavigate } from 'react-router-dom';
import Menu from '~/components/Popper/Menu';
import TimeDate from '~/components/TimeDate';
import { useEffect, useState } from 'react';
import Login from './Login';
import { useSelector } from 'react-redux';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '~/store/reducers/userReducer';
import { toast } from 'react-toastify';
import thongbaoService from '~/services/thongbaoService';
import userService from '~/services/userService';

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
    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen(!open);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
        const isClickInside = event.target.closest('.notification-wrapper');
        if (!isClickInside) {
            setOpen(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const user = useSelector((state) => state.user.currentUser);
    const [showLoginModal, setshowLoginModal] = useState(false);
    const [roleuser, setRoleuser] = useState('');

    useEffect(() => {
        const fetchRoleUser = async () => {
            if (!user || !user.id) return;
            try {
                const response = await userService.getAllRoleUsersService(user.id);
                if (response?.errCode === 0) {
                    setRoleuser(response.users[0]?.tenVaiTro || '');
                }
            } catch (error) {
                console.error('Lỗi khi tải vai trò người dùng:', error);
            }
        };

        fetchRoleUser();
    }, [user]); // Lắng nghe sự thay đổi của user

    const [thongBaoList, setThongBaoList] = useState([]);

    useEffect(() => {
        console.log(user);
        
        const fetchThongBaos = async () => {
            if (user?.id) {
                try {
                    const res = await thongbaoService.getThongBaoByTaiKhoan(user.id);
                    console.log(res);
                    
                    if(res.errCode === 0){
                        setThongBaoList(res.danhsachthongbao || []);
                    }
                } catch (err) {
                    console.error('Lỗi khi lấy danh sách thông báo:', err);
                    toast.error('Lỗi khi lấy danh sách thông báo')
                }
            }
        };

        fetchThongBaos();
    }, [user]);

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
                            <Link to={config.routes.home} className={cx('menu-item')}>
                                Trang chủ
                            </Link>
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
                            <div className={cx('notification-icon')} onClick={toggleDropdown}>
                                <span>🔔</span>
                                {thongBaoList?.length > 0 && (
                                    <span className={cx('badge')}>{thongBaoList.length}</span>
                                )}
                                {open && (
                                    <div className={cx('dropdown')}>
                                        <div className={cx('header')}>Thông báo</div>
                                        {thongBaoList.length === 0 ? (
                                            <div className={cx('empty')}>Không có thông báo nào</div>
                                        ) : (
                                            thongBaoList.map((tb, index) => (
                                                <div key={index} className={cx('item', { unread: tb.trangThai === 'Chưa đọc' })}>
                                                    <div className={cx('noi-dung')}>{tb.noiDungThongBao}</div>
                                                    <div className={cx('ngay')}>{new Date(tb.ngayThongBao).toLocaleDateString('vi-VN')}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
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
                                                <div className={cx('user-role')}>{roleuser}</div>
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
