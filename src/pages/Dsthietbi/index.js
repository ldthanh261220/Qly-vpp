import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Dsthietbi.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import thietbiService from '~/services/thietbiService';

const cx = classNames.bind(styles);

const Dsthietbi = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [isVisible, setIsVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const isMountedRef = useRef(true);
    const navigate = useNavigate();

    const getAllCategories = async () => {
        try {
            const response = await thietbiService.getAllDanhMucService();
            // Kiểm tra component còn mounted không trước khi setState
            if (response?.errCode === 0 && isMountedRef.current) {
                setCategories(response.danhsachdanhmuc);
            }
        } catch (error) {
            if (isMountedRef.current) {
                console.error('Lỗi khi tải danh sách danh mục:', error);
            }
        }
    };
    useEffect(() => {
        setIsVisible(true);
        getAllCategories();
    }, []);

    const filteredCategories = categories.filter((category) => {
        const matchesSearch = category.tenDanhMuc.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'all' || category.loai === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        console.log('Selected category:', category);
        navigate(`${config.routes.Locthietbi}?DanhMuc=${encodeURIComponent(category.tenDanhMuc)}`);
    };

    return (
        <>
            <div className={cx('page-wrapper')}>
                <div className={cx('floating-shapes')}>
                    <div className={cx('shape', 'shape-1')}></div>
                    <div className={cx('shape', 'shape-2')}></div>
                    <div className={cx('shape', 'shape-3')}></div>
                    <div className={cx('shape', 'shape-4')}></div>
                </div>

                <div className={cx('breadcrumb-section')}>
                    <div className={cx('main-container')}>
                        <div className={cx('breadcrumb-nav')}>
                            <Link to={config.routes.home} className={cx('breadcrumb-item')}>
                                <i className="fas fa-home"></i> Trang chủ
                            </Link>
                            <span className={cx('breadcrumb-separator')}>{'>'}</span>
                            <span className={cx('breadcrumb-item', 'active')}>Danh mục thiết bị</span>
                        </div>
                    </div>
                </div>

                <div className={cx('container')}>
                    <div className={cx('header', { 'fade-in': isVisible })}>
                        <div className={cx('title-wrapper')}>
                            <h1 className={cx('title')}>
                                <span className={cx('title-text')}>Thiết Bị Văn Phòng</span>
                                <span className={cx('title-highlight')}>UTE</span>
                            </h1>
                            <div className={cx('title-decoration')}></div>
                        </div>
                        <p className={cx('subtitle')}>Giải pháp toàn diện cho môi trường làm việc hiện đại</p>
                    </div>

                    <div className={cx('controls', { 'slide-up': isVisible })}>
                        <div className={cx('search-container')}>
                            <div className={cx('search-wrapper')}>
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm thiết bị..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={cx('search-input')}
                                />
                                {searchTerm && (
                                    <button className={cx('clear-search')} onClick={() => setSearchTerm('')}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className={cx('filter-container')}>
                            {[
                                { key: 'all', label: 'Tất cả', icon: '🏢' },
                                { key: 'tech', label: 'Tin học', icon: '💻' },
                                { key: 'display', label: 'Trình chiếu', icon: '📽️' },
                                { key: 'office', label: 'Văn phòng', icon: '🏪' },
                            ].map((filter) => (
                                <button
                                    key={filter.key}
                                    className={cx('filter-button', {
                                        'filter-button--active': activeFilter === filter.key,
                                    })}
                                    onClick={() => setActiveFilter(filter.key)}
                                >
                                    <span className={cx('filter-icon')}>{filter.icon}</span>
                                    <span className={cx('filter-label')}>{filter.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={cx('categories-grid')}>
                        {filteredCategories.map((category, index) => (
                            <div
                                key={category.maDanhMuc}
                                className={cx('category-card', {
                                    'category-card--selected': selectedCategory?.maDanhMuc === category.maDanhMuc,
                                    'animate-in': isVisible,
                                })}
                                style={{ animationDelay: `${index * 0.1}s` }}
                                onClick={() => handleCategoryClick(category)}
                            >
                                <div className={cx('category-image-container')}>
                                    <img
                                        src={category.anh}
                                        alt={category.tenDanhMuc}
                                        className={cx('category-image')}
                                    />
                                    <div className={cx('image-overlay')}></div>
                                </div>

                                <div className={cx('category-content')}>
                                    <h3 className={cx('category-name')}>{category.tenDanhMuc}</h3>
                                    <p className={cx('category-description')}>{category.moTa}</p>
                                    <button className={cx('category-button')}>
                                        <span>Xem sản phẩm</span>
                                        <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>

                                <div className={cx('category-glow')}></div>
                            </div>
                        ))}
                    </div>

                    {filteredCategories.length === 0 && (
                        <div className={cx('no-results')}>
                            <div className={cx('no-results-icon')}>
                                <i className="fas fa-search" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                            </div>
                            <h3 className={cx('no-results-title')}>Không tìm thấy thiết bị nào</h3>
                            <p className={cx('no-results-description')}>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                            <button
                                className={cx('reset-button')}
                                onClick={() => {
                                    setSearchTerm('');
                                    setActiveFilter('all');
                                }}
                            >
                                Đặt lại bộ lọc
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dsthietbi;
