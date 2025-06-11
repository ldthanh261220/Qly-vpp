import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '~/layouts/components/Header';
import Sidebar from '~/layouts/components/Sidebar';
import styles from './DefaultLayout.module.scss';
import Footer from '~/layouts/components/Footer';
import { useLocation } from 'react-router-dom';
import config from '~/config';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const location = useLocation();
    const hideSidebar = [config.routes.Dsthietbi, config.routes.Locthietbi].includes(location.pathname);

    return (
        <div className={cx('wrapper')}>
            <Header />
            {hideSidebar ? (
                <div className={cx('content', 'full-width')}>{children}</div>
            ) : (
                <div className={cx('container')}>
                    <Sidebar />
                    <div className={cx('content')}>{children}</div>
                </div>
            )}
            <Footer />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
