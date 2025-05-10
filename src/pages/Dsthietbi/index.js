import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Dsthietbi.module.scss';

const cx = classNames.bind(styles);

const EquipmentList = () => {
    const [priceRange, setPriceRange] = useState([0, 100]); // [min, max] in millions VND
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('tivi');
    const [showFilters, setShowFilters] = useState(true);

    // Categories are already defined in the UI
    const categories = [
        { id: 'may-in', name: 'Máy in', icon: '🖨️' },
        { id: 'tivi', name: 'Tivi', icon: '📺' },
        { id: 'chieu', name: 'Máy chiếu', icon: '🎥' },
        { id: 'laptop', name: 'Laptop', icon: '💻' },
        { id: 'quat', name: 'Quạt', icon: '🌀' },
        { id: 'den', name: 'Đèn', icon: '💡' },
    ];

    // Equipment list data
    const equipments = [
        {
            id: 1,
            name: 'Tivi Samsung DHT 4K',
            location: 'Phòng: A501',
            department: 'Khoa Điện tử',
            status: 'Hoạt động tốt',
            lastMaintenance: '15/03/2025',
            quantity: 1,
            price: 21090000,
            priceFormatted: '21.090.000đ',
            condition: 'Mới',
            brand: 'Samsung',
            year: 2023,
            image: 'https://th.bing.com/th/id/OIP.Z3zzZkRrLdqoefUDNPjxNAHaEo?o=7&cb=iwp1rm=3&rs=1&pid=ImgDetMain',
        },
        {
            id: 2,
            name: 'Tivi Sony Bravia 55"',
            location: 'Phòng: B305',
            department: 'Khoa Cơ khí',
            status: 'Đang bảo trì',
            lastMaintenance: '22/04/2025',
            quantity: 1,
            price: 28500000,
            priceFormatted: '28.500.000đ',
            condition: 'Đã qua sử dụng',
            brand: 'Sony',
            year: 2024,
            image: 'https://th.bing.com/th/id/OIP.Pt91DUK-B8DEjYoJw0F9GwHaHa?o=7&cb=iwp1rm=3&rs=1&pid=ImgDetMain',
        },
        {
            id: 3,
            name: 'Tivi TCL 50"',
            location: 'Phòng: C201',
            department: 'Khoa Công nghệ thông tin',
            status: 'Hoạt động tốt',
            lastMaintenance: '02/04/2025',
            quantity: 1,
            price: 15990000,
            priceFormatted: '15.990.000đ',
            condition: 'Mới',
            brand: 'TCL',
            year: 2024,
            image: 'https://th.bing.com/th/id/OIP.5C_GFC9-SQwv23T085tyMAHaD4?cb=iwp1&rs=1&pid=ImgDetMain',
        },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search functionality
        console.log('Searching for:', searchQuery);
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handlePriceRangeChange = (e, index) => {
        const newValue = parseInt(e.target.value);
        const newRange = [...priceRange];
        newRange[index] = newValue;

        // Ensure min <= max
        if (index === 0 && newValue > priceRange[1]) {
            newRange[1] = newValue;
        } else if (index === 1 && newValue < priceRange[0]) {
            newRange[0] = newValue;
        }

        setPriceRange(newRange);
    };

    // Format price to VND
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
    };

    return (
        <div className={cx('container')}>
            <div className={cx('header')}>
                <div className={cx('menu-icon')}>
                    <span className={cx('page-title')}>Danh sách thiết bị</span>
                </div>
            </div>

            <div className={cx('content')}>
                <div className={cx('search-section')}>
                    <div className={cx('search-bar')}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm thiết bị"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="button" onClick={handleSearch}>
                            Tìm kiếm
                        </button>
                    </div>
                </div>

                {/* Categories Tab - Already existed */}
                <div className={cx('categories')}>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={cx('category-item', { active: activeTab === category.id })}
                            onClick={() => handleTabClick(category.id)}
                        >
                            <div className={cx('category-icon')}>{category.icon}</div>
                            <div className={cx('category-name')}>{category.name}</div>
                        </div>
                    ))}
                </div>

                {/* Improved Filter Section */}
                <div className={cx('horizontal-filters')}>
                    <div className={cx('filter-header')}>
                        <h3>Bộ lọc thiết bị</h3>
                        <div className={cx('filter-actions')}>
                            <button className={cx('toggle-filters')} onClick={toggleFilters}>
                                {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                            </button>
                            <a href="#" className={cx('clear-all')}>
                                Xóa tất cả
                            </a>
                        </div>
                    </div>

                    {showFilters && (
                        <div className={cx('filter-content')}>
                            <div className={cx('filter-row')}>
                                {/* Removed duplicate category filter */}

                                <div className={cx('filter-group')}>
                                    <div className={cx('filter-title')}>
                                        <h4>Tình trạng</h4>
                                        <span className={cx('arrow')}>▼</span>
                                    </div>
                                    <div className={cx('filter-options')}>
                                        <label>
                                            <input type="checkbox" checked /> Hoạt động tốt
                                        </label>
                                        <label>
                                            <input type="checkbox" /> Đang bảo trì
                                        </label>
                                        <label>
                                            <input type="checkbox" /> Hỏng
                                        </label>
                                        <label>
                                            <input type="checkbox" /> Chờ thay thế
                                        </label>
                                    </div>
                                </div>

                                <div className={cx('filter-group')}>
                                    <div className={cx('filter-title')}>
                                        <h4>Điều kiện</h4>
                                        <span className={cx('arrow')}>▼</span>
                                    </div>
                                    <div className={cx('filter-options')}>
                                        <label>
                                            <input type="checkbox" checked /> Mới
                                        </label>
                                        <label>
                                            <input type="checkbox" /> Đã qua sử dụng
                                        </label>
                                        <label>
                                            <input type="checkbox" /> Tân trang
                                        </label>
                                    </div>
                                </div>

                                <div className={cx('filter-group')}>
                                    <div className={cx('filter-title')}>
                                        <h4>Đã bảo trì</h4>
                                    </div>
                                    <div className={cx('toggle-switch')}>
                                        <label className={cx('switch')}>
                                            <input type="checkbox" checked />
                                            <span className={cx('slider')}></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className={cx('filter-row')}>
                                {/* Improved Price Range Filter */}
                                <div className={cx('filter-group', 'price-filter')}>
                                    <div className={cx('filter-title')}>
                                        <h4>Mức giá (triệu đồng)</h4>
                                        <span className={cx('arrow')}>▼</span>
                                    </div>
                                    <div className={cx('price-range')}>
                                        <div className={cx('price-displays')}>
                                            <span>{formatPrice(priceRange[0] * 1000000)}</span>
                                            <span>{formatPrice(priceRange[1] * 1000000)}</span>
                                        </div>
                                        <div className={cx('price-inputs')}>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={priceRange[0]}
                                                onChange={(e) => handlePriceRangeChange(e, 0)}
                                                className={cx('range-min')}
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={priceRange[1]}
                                                onChange={(e) => handlePriceRangeChange(e, 1)}
                                                className={cx('range-max')}
                                            />
                                            <div className={cx('range-track')}>
                                                <div
                                                    className={cx('range-selected')}
                                                    style={{
                                                        left: `${priceRange[0]}%`,
                                                        width: `${priceRange[1] - priceRange[0]}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={cx('filter-group')}>
                                    <div className={cx('filter-title')}>
                                        <h4>Năm sản xuất</h4>
                                        <span className={cx('arrow')}>▼</span>
                                    </div>
                                    <div className={cx('year-inputs')}>
                                        <input type="number" placeholder="Từ năm" min="2000" max="2025" />
                                        <span className={cx('year-separator')}>-</span>
                                        <input type="number" placeholder="Đến năm" min="2000" max="2025" />
                                    </div>
                                </div>

                                <div className={cx('filter-group')}>
                                    <div className={cx('filter-title')}>
                                        <h4>Nhãn hiệu</h4>
                                        <span className={cx('arrow')}>▼</span>
                                    </div>
                                    <div className={cx('filter-options')}>
                                        <label>
                                            <input type="checkbox" /> Samsung
                                        </label>
                                        <label>
                                            <input type="checkbox" /> Sony
                                        </label>
                                        <label>
                                            <input type="checkbox" /> Panasonic
                                        </label>
                                        <label>
                                            <input type="checkbox" checked /> TCL
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Display Controls - Grid/List view toggle */}
                <div className={cx('view-toggle')}>
                    <button className={cx('active')}>
                        <span className={cx('view-icon')}>🗃️</span> Thẻ
                    </button>
                    <button>
                        <span className={cx('view-icon')}>📋</span> Bảng
                    </button>
                </div>

                {/* Improved Card-based Equipment List */}
                <div className={cx('equipment-list')}>
                    {equipments.map((equipment) => (
                        <div key={equipment.id} className={cx('equipment-item')}>
                            <div className={cx('equipment-image')}>
                                <img src={equipment.image} alt={equipment.name} />
                                <div
                                    className={cx(
                                        'equipment-status',
                                        equipment.status === 'Hoạt động tốt' ? 'good' : 'maintenance',
                                    )}
                                >
                                    {equipment.status}
                                </div>
                            </div>
                            <div className={cx('equipment-details')}>
                                <h3 className={cx('equipment-title')}>{equipment.name}</h3>
                                <div className={cx('equipment-specs')}>
                                    <p className={cx('equipment-info')}>
                                        <span className={cx('spec-label')}>Phân loại:</span> {equipment.condition}
                                    </p>
                                    <p className={cx('equipment-info')}>
                                        <span className={cx('spec-label')}>Nhãn hiệu:</span> {equipment.brand}
                                    </p>
                                    <p className={cx('equipment-info')}>
                                        <span className={cx('spec-label')}>Năm SX:</span> {equipment.year}
                                    </p>
                                </div>
                                <p className={cx('equipment-price')}>{equipment.priceFormatted}</p>
                            </div>
                            <div className={cx('equipment-location-info')}>
                                <p>
                                    <span className={cx('location-icon')}>📍</span> {equipment.location}
                                </p>
                                <p>
                                    <span className={cx('department-icon')}>🏢</span> {equipment.department}
                                </p>
                                <p>
                                    <span className={cx('maintenance-icon')}>🔧</span> Bảo trì:{' '}
                                    {equipment.lastMaintenance}
                                </p>
                                <p>
                                    <span className={cx('quantity-icon')}>🔢</span> Số lượng: {equipment.quantity}
                                </p>
                            </div>
                            <div className={cx('equipment-action')}>
                                <button className={cx('detail-btn')}>Chi tiết</button>
                                <button className={cx('report-btn')}>Báo cáo</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table view (hidden by default) */}
                <div className={cx('equipment-table', 'hidden')}>
                    <table className={cx('table')}>
                        <thead>
                            <tr>
                                <th>Mã thiết bị</th>
                                <th>Tên thiết bị</th>
                                <th>Vị trí</th>
                                <th>Khoa quản lý</th>
                                <th>Tình trạng</th>
                                <th>Giá trị</th>
                                <th>Bảo trì gần nhất</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipments.map((equipment) => (
                                <tr key={equipment.id}>
                                    <td>TB-{equipment.id.toString().padStart(4, '0')}</td>
                                    <td>{equipment.name}</td>
                                    <td>{equipment.location}</td>
                                    <td>{equipment.department}</td>
                                    <td
                                        className={cx(
                                            'status',
                                            equipment.status === 'Hoạt động tốt' ? 'good' : 'maintenance',
                                        )}
                                    >
                                        {equipment.status}
                                    </td>
                                    <td className={cx('price')}>{equipment.priceFormatted}</td>
                                    <td>{equipment.lastMaintenance}</td>
                                    <td>
                                        <button className={cx('action-btn', 'view')}>Xem</button>
                                        <button className={cx('action-btn', 'report')}>Báo cáo</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className={cx('pagination')}>
                    <button className={cx('pagination-btn', 'prev')}>Trước</button>
                    <button className={cx('pagination-btn', 'page', 'active')}>1</button>
                    <button className={cx('pagination-btn', 'page')}>2</button>
                    <button className={cx('pagination-btn', 'page')}>3</button>
                    <button className={cx('pagination-btn', 'next')}>Sau</button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentList;
