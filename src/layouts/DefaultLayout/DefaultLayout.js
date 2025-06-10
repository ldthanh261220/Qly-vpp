import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '~/layouts/components/Header';
import Sidebar from '~/layouts/components/Sidebar';
import styles from './DefaultLayout.module.scss';
import Footer from '~/layouts/components/Footer';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const location = useLocation();
    const hideSidebar = location.pathname === '/dsthietbi';

    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                {!hideSidebar && <Sidebar />}
                <div className={cx('content', { 'full-width': hideSidebar })}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
