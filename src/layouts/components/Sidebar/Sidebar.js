import { NavLink, useNavigate } from 'react-router-dom';
import { Home, FileText, UserCircle, Users, Key, ShoppingCart, Book, ChartColumnBig, Layers } from 'lucide-react';
import styles from './Sidebar.module.scss';
import classNames from 'classnames/bind';
import config from '~/config';

const cx = classNames.bind(styles);

export default function Sidebar() {
    const navigate = useNavigate();

    const menu = [
        { name: 'Tổng quan', icon: <Home size={18} />, to: config.routes.home },
        { name: 'Gửi yêu cầu', icon: <FileText size={18} />, to: config.routes.sendrequest },
        { name: 'Quản lý tài khoản', icon: <Users size={18} />, to: config.routes.Qlytaikhoan },
        { name: 'Phân quyền tài khoản', icon: <Key size={18} />, to: config.routes.Phanquyen },
        { name: 'Thông tin tài khoản', icon: <UserCircle size={18} />, to: config.routes.profile },
        { name: 'Duyệt kế hoạch mua sắm', icon: <ShoppingCart size={18} />, to: config.routes.Duyetkehoach },
        { name: 'Duyệt KH chọn nhà thầu', icon: <Book size={18} />, to: config.routes.Duyetnhathau },
        { name: 'Duyệt ngân sách ', icon: <ChartColumnBig size={18} />, to: config.routes.Duyetngansach },
        { name: 'Thanh toán hợp đồng', icon: <Layers size={18} />, to: config.routes.Thanhtoanhopdong },
    ];

    const handleLogout = () => {
        console.log('User logged out');
        // navigate("/login");
    };

    return (
        <div className={cx('sidebar')}>
            <div className={cx('sidebar-content')}>
                <nav className={cx('sidebar-nav')}>
                    {menu.map((item, i) => (
                        <NavLink
                            key={i}
                            to={item.to}
                            className={({ isActive }) => cx('sidebar-item', { active: isActive })}
                        >
                            <span className={cx('sidebar-icon')}>{item.icon}</span>
                            <span className={cx('sidebar-text')}>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
}
