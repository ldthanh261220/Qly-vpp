import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Locthietbi.module.scss';
import { Link } from 'react-router-dom';
import config from '~/config';
import PriceRangeSlider from '~/components/PriceRangeSlider';
const cx = classNames.bind(styles);

const Locthietbi = () => {
    const [filters, setFilters] = useState({
        locations: {
            phonghoc: false,
            thuvien: true,
            phonghop: false,
            phongthinghiem: false,
        },
        condition: {
            hoatdong: true,
            khonghoatdong: false,
            huhong: false,
        },
        brands: {
            hp: false,
            canon: false,
            sony: false,
            ricoh: false,
            dell: false,
            epson: false,
        },
        origins: {
            vietnam: false,
            japan: false,
            usa: false,
            korea: false,
            china: false,
        },
        priceRange: {
            min: 0,
            max: 10000000,
        },
    });

    const [sortOption, setSortOption] = useState('featured');
    const [equipments] = useState([
        {
            id: 1,
            name: 'Máy in HP LaserJet Pro M404dn',
            price: 4500000,
            condition: 'Hoạt động',
            location: 'Phòng cơ sở vật chất',
            brand: 'HP',
            model: 'M404dn',
            origin: 'USA',
            status: 'available',
            image: '/api/placeholder/200/200',
        },
        {
            id: 2,
            name: 'Máy scan Canon DR-C240',
            price: 7200000,
            condition: 'Hoạt động',
            location: 'Thư viện',
            brand: 'Canon',
            model: 'DR-C240',
            origin: 'Japan',
            status: 'available',
            image: '/api/placeholder/200/200',
        },
        {
            id: 3,
            name: 'Máy in Canon LBP6030',
            price: 2500000,
            condition: 'Hoạt động',
            location: 'Phòng đào tạo',
            brand: 'Canon',
            model: 'LBP6030',
            origin: 'Japan',
            status: 'available',
            image: '/api/placeholder/200/200',
        },
        {
            id: 4,
            name: 'Máy chiếu Sony VPL-EX430',
            price: 9500000,
            condition: 'Hư hỏng',
            location: 'Phòng hội đông',
            brand: 'Sony',
            model: 'VPL-EX430',
            origin: 'Japan',
            status: 'maintenance',
            image: '/api/placeholder/200/200',
        },
        {
            id: 5,
            name: 'Máy photocopy Ricoh MP 2014AD',
            price: 8500000,
            condition: 'Hoạt động',
            location: 'Văn phòng khoa',
            brand: 'Ricoh',
            model: 'MP 2014AD',
            origin: 'Japan',
            status: 'available',
            image: '/api/placeholder/200/200',
        },
        {
            id: 6,
            name: 'Máy tính bảng Dell OptiPlex 3080',
            price: 12000000,
            condition: 'Không hoạt động',
            location: 'Phòng tin học',
            brand: 'Dell',
            model: 'OptiPlex 3080',
            origin: 'USA',
            status: 'repair',
            image: '/api/placeholder/200/200',
        },
    ]);

    const [topEquipments] = useState([
        {
            id: 1,
            name: 'Máy in HP LaserJet Pro',
            price: 4500000,
            oldPrice: 5000000,
            image: '/api/placeholder/60/60',
        },
        {
            id: 2,
            name: 'Máy chiếu Epson EB-X41',
            price: 8500000,
            oldPrice: 9200000,
            image: '/api/placeholder/60/60',
        },
        {
            id: 3,
            name: 'Máy scan Canon DR-C225W',
            price: 6800000,
            oldPrice: 7500000,
            image: '/api/placeholder/60/60',
        },
    ]);

    const [chatVisible, setChatVisible] = useState(false);

    const handleLocationChange = (location) => {
        setFilters((prev) => ({
            ...prev,
            locations: {
                ...prev.locations,
                [location]: !prev.locations[location],
            },
        }));
    };

    const handleConditionChange = (condition) => {
        setFilters((prev) => ({
            ...prev,
            condition: {
                ...prev.condition,
                [condition]: !prev.condition[condition],
            },
        }));
    };

    const handleBrandChange = (brand) => {
        setFilters((prev) => ({
            ...prev,
            brands: {
                ...prev.brands,
                [brand]: !prev.brands[brand],
            },
        }));
    };

    const handleOriginChange = (origin) => {
        setFilters((prev) => ({
            ...prev,
            origins: {
                ...prev.origins,
                [origin]: !prev.origins[origin],
            },
        }));
    };

    const handlePriceChange = (type, value) => {
        setFilters((prev) => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [type]: parseInt(value) || 0,
            },
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            locations: {
                phonghoc: false,
                thuvien: false,
                phonghop: false,
                phongthinghiem: false,
            },
            condition: {
                hoatdong: false,
                khonghoatdong: false,
                huhong: false,
            },
            brands: {
                hp: false,
                canon: false,
                sony: false,
                ricoh: false,
                dell: false,
                epson: false,
            },
            origins: {
                vietnam: false,
                japan: false,
                usa: false,
                korea: false,
                china: false,
            },
            priceRange: {
                min: 0,
                max: 10000000,
            },
        });
    };

    const formatPrice = (price) => {
        return price.toLocaleString('vi-VN') + 'đ';
    };

    const getStatusBadge = (condition, status) => {
        if (condition === 'Hoạt động') {
            return { class: 'badge-available', text: 'Có sẵn' };
        } else if (condition === 'Hư hỏng') {
            return { class: 'badge-maintenance', text: 'Bảo trì' };
        } else {
            return { class: 'badge-repair', text: 'Sửa chữa' };
        }
    };

    return (
        <div className={cx('product-listing')}>
            {/* Breadcrumb */}
            <div className={cx('breadcrumb-section')}>
                <div className={cx('main-container')}>
                    <div className={cx('breadcrumb-nav')}>
                        <Link to={config.routes.home} className={cx('breadcrumb-item')}>
                            <i className="fas fa-home"></i> Trang chủ
                        </Link>
                        <span className={cx('breadcrumb-separator')}>{'>'}</span>
                        <Link to={config.routes.Dsthietbi} className={cx('breadcrumb-item')}>
                            Danh mục thiết bị
                        </Link>
                        <span className={cx('breadcrumb-separator')}>{'>'}</span>
                        <span className={cx('breadcrumb-item', 'active')}>Thiết bị văn phòng</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={cx('main-container')}>
                <div className={cx('content-wrapper')}>
                    {/* Filter Sidebar */}
                    <div className={cx('filter-sidebar')}>
                        {/* Location Filter */}
                        <div className={cx('filter-section')}>
                            <div className={cx('filter-header')}>
                                <div className={cx('filter-title')}>
                                    <span>Bộ lọc</span>
                                </div>
                                <span className={cx('clear-all')} onClick={clearAllFilters}>
                                    Xóa tất cả
                                </span>
                            </div>

                            <div className={cx('filter-title', 'filter-section-title')}>
                                <span>Vị trí</span>
                                <i className="fas fa-chevron-up"></i>
                            </div>

                            <div className={cx('filter-content')}>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="phonghoc"
                                        checked={filters.locations.phonghoc}
                                        onChange={() => handleLocationChange('phonghoc')}
                                    />
                                    <label htmlFor="phonghoc">Phòng học</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="thuvien"
                                        checked={filters.locations.thuvien}
                                        onChange={() => handleLocationChange('thuvien')}
                                    />
                                    <label htmlFor="thuvien">Thư viện</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="phonghop"
                                        checked={filters.locations.phonghop}
                                        onChange={() => handleLocationChange('phonghop')}
                                    />
                                    <label htmlFor="phonghop">Phòng họp</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="phongthinghiem"
                                        checked={filters.locations.phongthinghiem}
                                        onChange={() => handleLocationChange('phongthinghiem')}
                                    />
                                    <label htmlFor="phongthinghiem">Phòng thí nghiệm</label>
                                </div>
                            </div>

                            {/* Condition Filter */}
                            <div className={cx('filter-title', 'condition', 'filter-section-title')}>
                                <span>Tình trạng thiết bị</span>
                                <i className="fas fa-chevron-up"></i>
                            </div>

                            <div className={cx('filter-content')}>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="hoatdong"
                                        checked={filters.condition.hoatdong}
                                        onChange={() => handleConditionChange('hoatdong')}
                                    />
                                    <label htmlFor="hoatdong">Hoạt động</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="khonghoatdong"
                                        checked={filters.condition.khonghoatdong}
                                        onChange={() => handleConditionChange('khonghoatdong')}
                                    />
                                    <label htmlFor="khonghoatdong">Không hoạt động</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="huhong"
                                        checked={filters.condition.huhong}
                                        onChange={() => handleConditionChange('huhong')}
                                    />
                                    <label htmlFor="huhong">Hư hỏng</label>
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <div className={cx('filter-title', 'brand', 'filter-section-title')}>
                                <span>Thương hiệu</span>
                                <i className="fas fa-chevron-up"></i>
                            </div>

                            <div className={cx('filter-content')}>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="hp"
                                        checked={filters.brands.hp}
                                        onChange={() => handleBrandChange('hp')}
                                    />
                                    <label htmlFor="hp">HP</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="canon"
                                        checked={filters.brands.canon}
                                        onChange={() => handleBrandChange('canon')}
                                    />
                                    <label htmlFor="canon">Canon</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="sony"
                                        checked={filters.brands.sony}
                                        onChange={() => handleBrandChange('sony')}
                                    />
                                    <label htmlFor="sony">Sony</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="ricoh"
                                        checked={filters.brands.ricoh}
                                        onChange={() => handleBrandChange('ricoh')}
                                    />
                                    <label htmlFor="ricoh">Ricoh</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="dell"
                                        checked={filters.brands.dell}
                                        onChange={() => handleBrandChange('dell')}
                                    />
                                    <label htmlFor="dell">Dell</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="epson"
                                        checked={filters.brands.epson}
                                        onChange={() => handleBrandChange('epson')}
                                    />
                                    <label htmlFor="epson">Epson</label>
                                </div>
                            </div>

                            {/* Origin Filter */}
                            <div className={cx('filter-title', 'origin', 'filter-section-title')}>
                                <span>Xuất xứ</span>
                                <i className="fas fa-chevron-up"></i>
                            </div>

                            <div className={cx('filter-content')}>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="vietnam"
                                        checked={filters.origins.vietnam}
                                        onChange={() => handleOriginChange('vietnam')}
                                    />
                                    <label htmlFor="vietnam">Việt Nam</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="japan"
                                        checked={filters.origins.japan}
                                        onChange={() => handleOriginChange('japan')}
                                    />
                                    <label htmlFor="japan">Nhật Bản</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="usa"
                                        checked={filters.origins.usa}
                                        onChange={() => handleOriginChange('usa')}
                                    />
                                    <label htmlFor="usa">Hoa Kỳ</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="korea"
                                        checked={filters.origins.korea}
                                        onChange={() => handleOriginChange('korea')}
                                    />
                                    <label htmlFor="korea">Hàn Quốc</label>
                                </div>
                                <div className={cx('checkbox-item')}>
                                    <input
                                        type="checkbox"
                                        id="china"
                                        checked={filters.origins.china}
                                        onChange={() => handleOriginChange('china')}
                                    />
                                    <label htmlFor="china">Trung Quốc</label>
                                </div>
                            </div>
                        </div>

                        <PriceRangeSlider />

                        {/* Categories Filter */}
                        <div className={cx('filter-section')}>
                            <div className={cx('filter-title')}>
                                <span>Danh mục thiết bị</span>
                            </div>
                            <div className={cx('filter-content')}>
                                <ul className={cx('category-list')}>
                                    <li className={cx('category-item')}>
                                        <Link to="#" className={cx('category-link')}>
                                            Máy in & Máy scan
                                        </Link>
                                    </li>
                                    <li className={cx('category-item')}>
                                        <Link to="#" className={cx('category-link')}>
                                            Máy chiếu
                                        </Link>
                                    </li>
                                    <li className={cx('category-item')}>
                                        <Link to="#" className={cx('category-link')}>
                                            Máy tính & Laptop
                                        </Link>
                                    </li>
                                    <li className={cx('category-item')}>
                                        <Link to="#" className={cx('category-link')}>
                                            Thiết bị âm thanh
                                        </Link>
                                    </li>
                                    <li className={cx('category-item')}>
                                        <Link to="#" className={cx('category-link')}>
                                            Điều hòa & Quạt
                                        </Link>
                                    </li>
                                    <li className={cx('category-item')}>
                                        <Link to="#" className={cx('category-link')}>
                                            Bàn ghế văn phòng
                                        </Link>
                                    </li>
                                    <li className={cx('category-item')}>
                                        <Link to="#" className={cx('category-link')}>
                                            Tủ hồ sơ
                                        </Link>
                                    </li>
                                    <li className={cx('category-item')}>
                                        <Link to="#" className={cx('category-link')}>
                                            Thiết bị mạng
                                        </Link>
                                    </li>
                                    <li className={cx('category-item')}>
                                        <Link to="#" className={cx('category-link')}>
                                            Dụng cụ văn phòng phẩm
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Equipment Listing */}
                    <div className={cx('product-content')}>
                        <h1 className={cx('page-title')}>Thiết bị văn phòng</h1>
                        <p className={cx('page-subtitle')}>
                            Danh sách các thiết bị văn phòng hiện có tại trường đại học. Hệ thống quản lý thiết bị giúp
                            theo dõi tình trạng, vị trí và thông tin chi tiết của từng thiết bị, đảm bảo việc sử dụng
                            hiệu quả và bảo trì kịp thời.
                        </p>

                        {/* Sorting Options */}
                        <div className={cx('sorting-section')}>
                            <div className={cx('sorting-options')}>
                                <span className={cx('sorting-label')}>Sắp xếp theo:</span>
                                <select
                                    className={cx('sort-select')}
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="featured">Nổi bật</option>
                                    <option value="price-low">Giá trị: Thấp đến cao</option>
                                    <option value="price-high">Giá trị: Cao đến thấp</option>
                                    <option value="newest">Mới nhất</option>
                                    <option value="condition">Tình trạng</option>
                                </select>
                            </div>
                            <div className={cx('result-count')}>
                                <span>Hiển thị: 1-6 trong {equipments.length} thiết bị</span>
                            </div>
                        </div>

                        {/* Equipment Grid */}
                        <div className={cx('product-grid')}>
                            {equipments.map((equipment) => {
                                const statusBadge = getStatusBadge(equipment.condition, equipment.status);
                                return (
                                    <div key={equipment.id} className={cx('product-card')}>
                                        <div className={cx('badge-status', statusBadge.class)}>{statusBadge.text}</div>

                                        <div className={cx('product-image')}>
                                            <img src={equipment.image} alt={equipment.name} />
                                        </div>

                                        <div className={cx('product-info')}>
                                            <Link to="#" className={cx('product-name')}>
                                                {equipment.name}
                                            </Link>

                                            <div className={cx('equipment-details')}>
                                                <div className={cx('detail-row')}>
                                                    <span className={cx('detail-label')}>Thương hiệu:</span>
                                                    <span className={cx('detail-value')}>{equipment.brand}</span>
                                                </div>
                                                <div className={cx('detail-row')}>
                                                    <span className={cx('detail-label')}>Model:</span>
                                                    <span className={cx('detail-value')}>{equipment.model}</span>
                                                </div>
                                                <div className={cx('detail-row')}>
                                                    <span className={cx('detail-label')}>Xuất xứ:</span>
                                                    <span className={cx('detail-value')}>{equipment.origin}</span>
                                                </div>
                                                <div className={cx('detail-row')}>
                                                    <span className={cx('detail-label')}>Vị trí:</span>
                                                    <span className={cx('detail-value')}>{equipment.location}</span>
                                                </div>
                                                <div className={cx('detail-row')}>
                                                    <span className={cx('detail-label')}>Tình trạng:</span>
                                                    <span className={cx('detail-value', 'status', equipment.status)}>
                                                        {equipment.condition}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={cx('product-price')}>
                                                Giá trị: {formatPrice(equipment.price)}
                                            </div>

                                            <div className={cx('product-actions')}>
                                                <button className={cx('view-detail-btn')}>
                                                    <i className="fas fa-eye"></i> Xem chi tiết
                                                </button>
                                                <button className={cx('request-btn')}>
                                                    <i className="fas fa-clipboard-list"></i> Hướng dẫn sử dụng
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <div className={cx('pagination')}>
                            <div className={cx('page-item')}>
                                <span className={cx('page-active')}>1</span>
                            </div>
                            <div className={cx('page-item')}>
                                <Link to="#" className={cx('page-link')}>
                                    2
                                </Link>
                            </div>
                            <div className={cx('page-item')}>
                                <Link to="#" className={cx('page-link')}>
                                    3
                                </Link>
                            </div>
                            <div className={cx('page-item')}>
                                <Link to="#" className={cx('page-link')}>
                                    4
                                </Link>
                            </div>
                            <div className={cx('page-item')}>
                                <span className={cx('page-text')}>...</span>
                            </div>
                            <div className={cx('page-item')}>
                                <Link to="#" className={cx('page-link', 'next-page')}>
                                    <i className="fas fa-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Widget */}
            <div className={cx('chat-widget')}>
                <div className={cx('chat-button')} onClick={() => setChatVisible(!chatVisible)}>
                    Hỗ trợ quản lý thiết bị
                    <i className={chatVisible ? 'fas fa-times' : 'fas fa-comment'}></i>
                </div>
                {chatVisible && (
                    <div className={cx('chat-message')}>
                        Bạn cần hỗ trợ về thiết bị văn phòng? Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ kỹ
                        thuật.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Locthietbi;
