import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import config from '~/config';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Menu from '~/components/Popper/Menu';
import TimeDate from '~/components/TimeDate';
import { useEffect, useState, useRef } from 'react';
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
    const location = useLocation();
    const notificationRef = useRef(null);

    const user = useSelector((state) => state.user.currentUser);
    const [showLoginModal, setshowLoginModal] = useState(false);
    const [roleuser, setRoleuser] = useState('');
    const [thongBaoList, setThongBaoList] = useState([]);

    const toggleDropdown = () => {
        setOpen((prev) => !prev);
    };

    // Effect để xử lý click outside
    useEffect(() => {
        const handleClickOutside = async (event) => {
            // Kiểm tra xem click có nằm trong notification container không
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                if (open) {
                    setOpen(false);

                    // Kiểm tra xem có thông báo chưa đọc không
                    const hasUnread = thongBaoList.some((tb) => tb.trangThai === 'Chưa đọc');

                    if (hasUnread && user?.id) {
                        try {
                            await thongbaoService.capNhatTrangThaiThongBao(user.id);

                            // Cập nhật state local
                            setThongBaoList((prevList) =>
                                prevList.map((tb) => ({
                                    ...tb,
                                    trangThai: 'Đã đọc',
                                })),
                            );
                        } catch (error) {
                            console.error('Lỗi khi cập nhật trạng thái thông báo:', error);
                            toast.error('Không thể cập nhật trạng thái thông báo!');
                        }
                    }
                }
            }
        };

        // Chỉ add event listener khi dropdown đang mở
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open, thongBaoList, user?.id]); // Thêm dependencies cần thiết

    // Effect để reset dữ liệu khi user thay đổi (đăng nhập/đăng xuất)
    useEffect(() => {
        if (!user) {
            // Reset tất cả state khi user đăng xuất
            setRoleuser('');
            setThongBaoList([]);
            setOpen(false);
        }
    }, [user]);

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
    }, [user]);

    useEffect(() => {
        console.log(user);

        const fetchThongBaos = async () => {
            if (user?.id) {
                try {
                    const res = await thongbaoService.getThongBaoByTaiKhoan(user.id);
                    console.log(res);

                    if (res.errCode === 0) {
                        setThongBaoList(res.danhsachthongbao || []);
                    }
                } catch (err) {
                    console.error('Lỗi khi lấy danh sách thông báo:', err);
                    // toast.error('Lỗi khi lấy danh sách thông báo');
                }
            } else {
                // Nếu không có user, reset thông báo
                setThongBaoList([]);
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
            // Reset dropdown trước khi đăng xuất
            setOpen(false);

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

    const soThongBaoChuaDoc = thongBaoList.filter((tb) => tb.trangThai === 'Chưa đọc').length;

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
                                <h1>Hệ thống quản lý văn phòng phẩm</h1>
                                <h2>Đại học sư phạm kỹ thuật</h2>
                                <div className={cx('slogan')}>
                                    Hiện đại – Minh bạch – Tiết kiệm: Quản lý văn phòng phẩm hiệu quả cùng UTE.
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
                            <Link
                                to={config.routes.home}
                                className={cx('menu-item', {
                                    active:
                                        location.pathname !== config.routes.Dsthietbi &&
                                        location.pathname !== config.routes.Locthietbi,
                                })}
                            >
                                Trang chủ
                            </Link>

                            <Menu items={SEARCH_ITEMS} onChange={handleTracuuClick} V2>
                                <div
                                    className={cx('menu-item', {
                                        active:
                                            location.pathname === config.routes.Dsthietbi ||
                                            location.pathname === config.routes.Locthietbi, // Đường dẫn tùy bạn
                                    })}
                                >
                                    Tra cứu
                                </div>
                            </Menu>
                            <div className={cx('menu-item')}>Câu hỏi thường gặp</div>
                            <Menu items={HDSD_ITEMS} onChange={handleLanguageChange} V2>
                                <div className={cx('menu-item')}>Hướng dẫn sử dụng</div>
                            </Menu>
                            <div className={cx('menu-item')}>Liên hệ</div>
                        </div>
                        <div className={cx('menu-right')}>
                            {/* Chỉ hiển thị notification khi có user */}
                            {user && (
                                <div className={cx('notification-icon')} onClick={toggleDropdown} ref={notificationRef}>
                                    <i className="fas fa-bell fa-shake"></i>
                                    {soThongBaoChuaDoc > 0 && <span className={cx('badge')}>{soThongBaoChuaDoc}</span>}
                                    {open && (
                                        <div className={cx('dropdown')}>
                                            <div className={cx('header')}>Thông báo</div>
                                            {thongBaoList.length === 0 ? (
                                                <div className={cx('empty')}>Không có thông báo nào</div>
                                            ) : (
                                                thongBaoList.map((tb, index) => (
                                                    <div
                                                        key={index}
                                                        className={cx('item', {
                                                            unread: tb.trangThai === 'Chưa đọc',
                                                            read: tb.trangThai === 'Đã đọc',
                                                        })}
                                                    >
                                                        <div className={cx('avatar')}>
                                                            {tb.avatar ? (
                                                                <img src={tb.avatar} alt={tb.tenNguoiGui} />
                                                            ) : (
                                                                <img
                                                                    src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
                                                                        tb.tenNguoiGui || 'Unknown',
                                                                    )}&radius=50&bold=true&backgroundColor=faa546&fontSize=30`}
                                                                    alt={tb.tenNguoiGui}
                                                                />
                                                            )}
                                                        </div>

                                                        <div className={cx('content')}>
                                                            <div className={cx('sender')}>{tb.tenNguoiGui}</div>
                                                            <div className={cx('message')}>{tb.noiDungThongBao}</div>
                                                            <div className={cx('time')}>
                                                                {formatTimeAgo(tb.ngayThongBao)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

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
                                                src={`https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
                                                    user.hoTen || 'User',
                                                )}&radius=50&bold=true&fontSize=30`}
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

function formatTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    } else if (diffInDays < 30) {
        return `${diffInDays} ngày trước`;
    } else {
        return `${diffInMonths} tháng trước`;
    }
}

export default Header;
