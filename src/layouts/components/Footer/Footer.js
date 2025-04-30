import styles from './Footer.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export default function Footer() {
    return (
        <footer className={cx('footer')}>
            <div className={cx('footer-container')}>
                <div className={cx('footer-column')}>
                    <strong>Trường Đại học Sư phạm kỹ thuật</strong>
                    <br />
                    Cơ sở 1: 48 Cao Thắng, Thanh Bình, Hải Châu, Đà Nẵng
                    <br />
                    Cơ sở 2: Khu Đô thị đại học, Hòa Quý, Ngũ Hành Sơn, Đà Nẵng
                </div>

                <div className={cx('footer-column')}>
                    <strong>Liên hệ</strong>
                    <br />
                    Số điện thoại: 0702-500-238
                    <br />
                    Email: <a href="mailto:pcsvc@ute.udn.vn">pcsvc@ute.udn.vn</a>
                </div>

                <div className={cx('footer-column')}>
                    <strong>Liên kết</strong>
                    <br />
                    <div className={cx('social-icons')}>
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
                        <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" />
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
