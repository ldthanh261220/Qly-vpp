import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';

import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from './MenuItem';
import styles from './Menu.module.scss';

const cx = classNames.bind(styles);
const defaultFn = () => {};

function Menu({ children, items = [], hideOnClick = false, onChange = defaultFn, V2 = false, V3 = false }) {
    const renderResult = (attrs) => (
        <div className={cx('menu-list', { 'menu-v2': V2 }, { 'menu-v3': V3 })} tabIndex="-1" {...attrs}>
            <PopperWrapper className={cx('menu-popper')}>
                <div className={cx('menu-body')}>
                    {items.map((item, index) => (
                        <MenuItem key={index} data={item} onClick={() => onChange(item)} />
                    ))}
                </div>
            </PopperWrapper>
        </div>
    );

    return (
        <Tippy
            interactive
            delay={[0, 100]}
            offset={V2 ? [0, 0] : [0, 8]}
            hideOnClick={hideOnClick}
            placement={V2 ? 'bottom-start' : 'bottom-end'}
            render={renderResult}
        >
            {children}
        </Tippy>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    hideOnClick: PropTypes.bool,
    onChange: PropTypes.func,
    V2: PropTypes.bool,
};

export default Menu;
