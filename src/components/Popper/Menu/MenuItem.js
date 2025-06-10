import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import { Link } from 'react-router-dom'; // Dùng Link nếu có `to`

const cx = classNames.bind(styles);

function MenuItem({ data, onClick }) {
    const classes = cx('menu-item', {
        separate: data.separate,
    });

    // Nếu có đường dẫn `to`, dùng Link; nếu không thì dùng button
    const Component = data.to ? Link : 'button';

    return (
        <Component className={classes} to={data.to} onClick={onClick}>
            <span>{data.icon}</span>
            {data.title}
        </Component>
    );
}

MenuItem.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func,
};

export default MenuItem;
