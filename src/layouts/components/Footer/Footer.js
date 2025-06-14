import styles from './Footer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function Footer() {
    return (
        <footer className={cx('footer')}>
            <div className={cx('footer-container')}>
                <div className={cx('footer-content')}>
                    <div className={cx('footer-column', 'university-info')}>
                        <h3 className={cx('footer-title')}>Trường Đại học Sư phạm kỹ thuật</h3>
                        <div className={cx('address-item')}>
                            <span className={cx('label')}>Cơ sở 1:</span>
                            <span>48 Cao Thắng, Thanh Bình, Hải Châu, Đà Nẵng</span>
                        </div>
                        <div className={cx('address-item')}>
                            <span className={cx('label')}>Cơ sở 2:</span>
                            <span>Khu Đô thị đại học, Hòa Quý, Ngũ Hành Sơn, Đà Nẵng</span>
                        </div>
                    </div>

                    <div className={cx('footer-column', 'contact-info')}>
                        <h3 className={cx('footer-title')}>Liên hệ</h3>
                        <div className={cx('contact-item')}>
                            <span className={cx('label')}>Điện thoại:</span>
                            <a href="tel:0702-500-238" className={cx('contact-link')}>
                                0702-500-238
                            </a>
                        </div>
                        <div className={cx('contact-item')}>
                            <span className={cx('label')}>Email:</span>
                            <a href="mailto:pcsvc@ute.udn.vn" className={cx('contact-link')}>
                                pcsvc@ute.udn.vn
                            </a>
                        </div>
                    </div>

                    <div className={cx('footer-column', 'social-section')}>
                        <h3 className={cx('footer-title')}>Kết nối với chúng tôi</h3>
                        <div className={cx('social-icons')}>
                            <a href="#" className={cx('social-link')} aria-label="Facebook">
                                <svg className={cx('social-icon')} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="#" className={cx('social-link')} aria-label="YouTube">
                                <svg className={cx('social-icon')} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            <a href="#" className={cx('social-link')} aria-label="Twitter">
                                <svg className={cx('social-icon')} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className={cx('footer-bottom')}>
                    <p className={cx('copyright')}>
                        © 2024 Trường Đại học Sư phạm kỹ thuật Đà Nẵng. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
