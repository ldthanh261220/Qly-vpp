import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import userService from '~/services/userService';
import { loginSuccess } from '~/store/reducers/userReducer';
import { useDispatch } from 'react-redux';

const cx = classNames.bind(styles);

function Login({ onClose }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMessage, setErrMessage] = useState('');

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrMessage('');

        if (!email || !password) {
            setErrMessage('Vui lòng nhập email và mật khẩu!');
            return;
        }

        try {
            const data = await userService.handleLogin(email, password);

            if (data && data.EC !== 0) {
                throw new Error(data.EM || 'Đăng nhập thất bại');
            }

            dispatch(loginSuccess(data.user));
            onClose();
        } catch (error) {
            const message = error?.response?.data?.EM || error.EM || 'Có lỗi xảy ra!';
            setErrMessage(message);
        }
    };

    return (
        <div className={cx('modal-overlay')} onClick={handleOverlayClick}>
            <div className={cx('modal-container')}>
                <div className={cx('modal-header')}>
                    <h2>Đăng nhập</h2>
                    <button className={cx('close-button')} onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className={cx('modal-body')}>
                    <form onSubmit={handleLogin}>
                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập địa chỉ email"
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                            />
                        </div>
                        {/* Hiển thị lỗi nếu có */}
                        {errMessage && (
                            <div className={cx('error-message')} style={{ color: 'red', marginTop: '8px' }}>
                                {errMessage}
                            </div>
                        )}
                        <div className={cx('form-actions')}>
                            <button type="submit" className={cx('login-button')}>
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
