import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Locthietbi.module.scss';
import { Link, useSearchParams } from 'react-router-dom';
import config from '~/config';
import PriceRangeSlider from '~/components/PriceRangeSlider';
import thietbiService from '~/services/thietbiService';

const cx = classNames.bind(styles);

const Locthietbi = () => {
    const [sortOption, setSortOption] = useState('featured');
    const [equipments, setEquipments] = useState([]);
    const [danhmuc, setDanhMuc] = useState([]);
    const [allDanhmuc, setAllDanhmuc] = useState([]);
    const [searchParams] = useSearchParams();
    const idDanhMuc = searchParams.get('idDanhMuc');
    const [filteredEquipments, setFilteredEquipments] = useState([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal states
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);

    // Dynamic filter options
    const [uniqueRooms, setUniqueRooms] = useState([]);
    const [uniqueConditions, setUniqueConditions] = useState([]);
    const [uniqueBrands, setUniqueBrands] = useState([]);
    const [uniqueOrigins, setUniqueOrigins] = useState([]);

    // Dynamic filter states
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedOrigins, setSelectedOrigins] = useState([]);

    // Price filter state
    const [priceRange, setPriceRange] = useState({
        min: 0,
        max: 100000000,
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentEquipments = filteredEquipments.slice(startIndex, endIndex);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedRooms, selectedConditions, selectedBrands, selectedOrigins, priceRange]);

    // Modal handlers
    const handleViewDetail = (equipment) => {
        setSelectedEquipment(equipment);
        setShowDetailModal(true);
    };

    const handleViewGuide = (equipment) => {
        setSelectedEquipment(equipment);
        setShowGuideModal(true);
    };

    const closeModal = () => {
        setShowDetailModal(false);
        setShowGuideModal(false);
        setSelectedEquipment(null);
    };

    // Handle sorting
    const sortEquipments = (equipments, sortOption) => {
        const sorted = [...equipments];

        switch (sortOption) {
            case 'price-low':
                return sorted.sort((a, b) => (a.giaBan || 0) - (b.giaBan || 0));
            case 'price-high':
                return sorted.sort((a, b) => (b.giaBan || 0) - (a.giaBan || 0));
            case 'newest':
                return sorted.sort((a, b) => new Date(b.ngayMua || 0) - new Date(a.ngayMua || 0));
            case 'condition':
                return sorted.sort((a, b) => {
                    const conditionOrder = { 'Hoạt động': 1, 'Hư hỏng': 2, 'Sửa chữa': 3 };
                    return (conditionOrder[a.trangThai] || 4) - (conditionOrder[b.trangThai] || 4);
                });
            default:
                return sorted;
        }
    };

    // Handle price range change from PriceRangeSlider
    const handlePriceChange = (newPriceRange) => {
        setPriceRange(newPriceRange);
    };

    // Filter equipments based on selected filters
    const filterEquipments = () => {
        let filtered = equipments;

        // Filter by rooms
        if (selectedRooms.length > 0) {
            filtered = filtered.filter((item) => selectedRooms.includes(item.tenPhong));
        }

        // Filter by conditions
        if (selectedConditions.length > 0) {
            filtered = filtered.filter((item) => selectedConditions.includes(item.trangThai));
        }

        // Filter by brands
        if (selectedBrands.length > 0) {
            filtered = filtered.filter((item) => selectedBrands.includes(item.Hang));
        }

        // Filter by origins
        if (selectedOrigins.length > 0) {
            filtered = filtered.filter((item) => selectedOrigins.includes(item.xuatXu));
        }

        // Filter by price range
        if (priceRange.min > 0 || priceRange.max < 100000000) {
            filtered = filtered.filter((item) => {
                const price = item.giaBan || 0;
                return price >= priceRange.min && price <= priceRange.max;
            });
        }

        // Apply sorting
        filtered = sortEquipments(filtered, sortOption);

        setFilteredEquipments(filtered);
    };

    // Apply filters whenever selections change
    useEffect(() => {
        filterEquipments();
    }, [selectedRooms, selectedConditions, selectedBrands, selectedOrigins, priceRange, equipments, sortOption]);

    // Extract unique values from equipment data
    const extractUniqueValues = (data) => {
        const rooms = [...new Set(data.map((item) => item.tenPhong).filter(Boolean))];
        const conditions = [...new Set(data.map((item) => item.trangThai).filter(Boolean))];
        const brands = [...new Set(data.map((item) => item.Hang).filter(Boolean))];
        const origins = [...new Set(data.map((item) => item.xuatXu).filter(Boolean))];

        setUniqueRooms(rooms);
        setUniqueConditions(conditions);
        setUniqueBrands(brands);
        setUniqueOrigins(origins);
    };

    useEffect(() => {
        const fetchThietBi = async () => {
            try {
                const res = await thietbiService.getAllThietbiService(idDanhMuc);
                const data = res.danhsachthietbi || [];

                setEquipments(data);
                setFilteredEquipments(data);

                // Extract unique values for dynamic filters
                extractUniqueValues(data);
            } catch (err) {
                console.error('Lỗi khi gọi API thiết bị:', err);
            }
        };

        const fetchDanhmuc = async () => {
            try {
                const res = await thietbiService.getAllDanhMucService(idDanhMuc);
                setDanhMuc(res.danhsachdanhmuc || []);
            } catch (err) {
                console.error('Lỗi khi gọi API danh mục:', err);
            }
        };

        const fetchAllDanhmuc = async () => {
            try {
                const res = await thietbiService.getAllDanhMucService();
                setAllDanhmuc(res.danhsachdanhmuc || []);
            } catch (err) {
                console.error('Lỗi khi gọi API tất cả danh mục:', err);
            }
        };

        fetchThietBi();
        fetchDanhmuc();
        fetchAllDanhmuc();
    }, [idDanhMuc]);

    // Handle filter changes
    const handleRoomChange = (room) => {
        setSelectedRooms((prev) => (prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]));
    };

    const handleConditionChange = (condition) => {
        setSelectedConditions((prev) =>
            prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
        );
    };

    const handleBrandChange = (brand) => {
        setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));
    };

    const handleOriginChange = (origin) => {
        setSelectedOrigins((prev) => (prev.includes(origin) ? prev.filter((o) => o !== origin) : [...prev, origin]));
    };

    const clearAllFilters = () => {
        setSelectedRooms([]);
        setSelectedConditions([]);
        setSelectedBrands([]);
        setSelectedOrigins([]);
        // Reset price range
        setPriceRange({
            min: 0,
            max: 100000000,
        });
    };

    const formatPrice = (price) => {
        return price ? price.toLocaleString('vi-VN') + 'đ' : 'Không có giá';
    };

    const getStatusBadge = (condition) => {
        if (condition === 'Hoạt động') {
            return { class: 'badge-available', text: 'Có sẵn' };
        } else if (condition === 'Hư hỏng') {
            return { class: 'badge-maintenance', text: 'Bảo trì' };
        } else if (condition === 'Sửa chữa') {
            return { class: 'badge-repair', text: 'Sửa chữa' };
        } else {
            return { class: 'badge-unknown', text: 'Không rõ' };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Không có thông tin';
        try {
            return new Date(dateString).toLocaleDateString('vi-VN');
        } catch {
            return 'Không có thông tin';
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
                        <span className={cx('breadcrumb-item', 'active')}>
                            {danhmuc[0]?.tenDanhMuc || 'Đang tải...'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={cx('main-container')}>
                <div className={cx('content-wrapper')}>
                    {/* Filter Sidebar */}
                    <div className={cx('filter-sidebar')}>
                        <div className={cx('filter-section')}>
                            <div className={cx('filter-header')}>
                                <div className={cx('filter-title')}>
                                    <span>Bộ lọc</span>
                                </div>
                                <span className={cx('clear-all')} onClick={clearAllFilters}>
                                    Xóa tất cả
                                </span>
                            </div>

                            {/* Dynamic Location Filter */}
                            <div className={cx('filter-title', 'filter-section-title')}>
                                <span>Vị trí ({selectedRooms.length > 0 ? selectedRooms.length : 'Tất cả'})</span>
                                <i className="fas fa-chevron-up"></i>
                            </div>
                            <div className={cx('filter-content')}>
                                {uniqueRooms.map((room) => (
                                    <div key={room} className={cx('checkbox-item')}>
                                        <input
                                            type="checkbox"
                                            id={`room-${room}`}
                                            checked={selectedRooms.includes(room)}
                                            onChange={() => handleRoomChange(room)}
                                        />
                                        <label htmlFor={`room-${room}`}>{room}</label>
                                    </div>
                                ))}
                            </div>

                            {/* Dynamic Condition Filter */}
                            <div className={cx('filter-title', 'condition', 'filter-section-title')}>
                                <span>
                                    Tình trạng thiết bị (
                                    {selectedConditions.length > 0 ? selectedConditions.length : 'Tất cả'})
                                </span>
                                <i className="fas fa-chevron-up"></i>
                            </div>
                            <div className={cx('filter-content')}>
                                {uniqueConditions.map((condition) => (
                                    <div key={condition} className={cx('checkbox-item')}>
                                        <input
                                            type="checkbox"
                                            id={`condition-${condition}`}
                                            checked={selectedConditions.includes(condition)}
                                            onChange={() => handleConditionChange(condition)}
                                        />
                                        <label htmlFor={`condition-${condition}`}>{condition}</label>
                                    </div>
                                ))}
                            </div>

                            {/* Dynamic Brand Filter */}
                            <div className={cx('filter-title', 'brand', 'filter-section-title')}>
                                <span>
                                    Thương hiệu ({selectedBrands.length > 0 ? selectedBrands.length : 'Tất cả'})
                                </span>
                                <i className="fas fa-chevron-up"></i>
                            </div>
                            <div className={cx('filter-content')}>
                                {uniqueBrands.map((brand) => (
                                    <div key={brand} className={cx('checkbox-item')}>
                                        <input
                                            type="checkbox"
                                            id={`brand-${brand}`}
                                            checked={selectedBrands.includes(brand)}
                                            onChange={() => handleBrandChange(brand)}
                                        />
                                        <label htmlFor={`brand-${brand}`}>{brand}</label>
                                    </div>
                                ))}
                            </div>

                            {/* Dynamic Origin Filter */}
                            <div className={cx('filter-title', 'origin', 'filter-section-title')}>
                                <span>Xuất xứ ({selectedOrigins.length > 0 ? selectedOrigins.length : 'Tất cả'})</span>
                                <i className="fas fa-chevron-up"></i>
                            </div>
                            <div className={cx('filter-content')}>
                                {uniqueOrigins.map((origin) => (
                                    <div key={origin} className={cx('checkbox-item')}>
                                        <input
                                            type="checkbox"
                                            id={`origin-${origin}`}
                                            checked={selectedOrigins.includes(origin)}
                                            onChange={() => handleOriginChange(origin)}
                                        />
                                        <label htmlFor={`origin-${origin}`}>{origin}</label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Price Range Slider */}
                        <PriceRangeSlider
                            onPriceChange={handlePriceChange}
                            initialMin={priceRange.min}
                            initialMax={priceRange.max}
                        />

                        {/* Categories Filter */}
                        <div className={cx('filter-section')}>
                            <div className={cx('filter-title')}>
                                <span>Danh mục thiết bị</span>
                            </div>
                            <div className={cx('filter-content')}>
                                <ul className={cx('category-list')}>
                                    {allDanhmuc.map((category) => (
                                        <li key={category.maDanhMuc} className={cx('category-item')}>
                                            <Link
                                                to={`${config.routes.Locthietbi}?idDanhMuc=${category.maDanhMuc}`}
                                                className={cx('category-link')}
                                            >
                                                {category.tenDanhMuc}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Equipment Listing */}
                    <div className={cx('product-content')}>
                        <h1 className={cx('page-title')}>{danhmuc[0]?.tenDanhMuc}</h1>
                        <p className={cx('page-subtitle')}>{danhmuc[0]?.moTa}</p>

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
                                <span>
                                    Hiển thị: {startIndex + 1}-{Math.min(endIndex, filteredEquipments.length)} trong{' '}
                                    {filteredEquipments.length} thiết bị
                                </span>
                            </div>
                        </div>

                        {/* Equipment Grid */}
                        <div className={cx('product-grid')}>
                            {currentEquipments.map((equipment) => {
                                const statusBadge = getStatusBadge(equipment.trangThai);
                                return (
                                    <div key={equipment.maThietBi} className={cx('product-card')}>
                                        <div className={cx('badge-status', statusBadge.class)}>{statusBadge.text}</div>

                                        <div className={cx('product-image')}>
                                            <img src={equipment.hinhAnh} alt={equipment.tenThietBi} />
                                        </div>

                                        <div className={cx('product-info')}>
                                            <Link to="#" className={cx('product-name')}>
                                                {equipment.tenThietBi}
                                            </Link>

                                            <div className={cx('equipment-details')}>
                                                <div className={cx('detail-row')}>
                                                    <span className={cx('detail-label')}>Thương hiệu:</span>
                                                    <span className={cx('detail-value')}>
                                                        {equipment.Hang || 'Không rõ'}
                                                    </span>
                                                </div>

                                                <div className={cx('detail-row')}>
                                                    <span className={cx('detail-label')}>Xuất xứ:</span>
                                                    <span className={cx('detail-value')}>
                                                        {equipment.xuatXu || 'Không rõ'}
                                                    </span>
                                                </div>
                                                <div className={cx('detail-row')}>
                                                    <span className={cx('detail-label')}>Thuộc phòng:</span>
                                                    <span className={cx('detail-value')}>
                                                        {equipment.tenPhong || 'Không rõ'}
                                                    </span>
                                                </div>
                                                <div className={cx('detail-row')}>
                                                    <span className={cx('detail-label')}>Tình trạng:</span>
                                                    <span
                                                        className={cx(
                                                            'detail-value',
                                                            'status',
                                                            equipment.trangThai?.toLowerCase()?.replace(/\s+/g, '-') ||
                                                                'unknown',
                                                        )}
                                                    >
                                                        {equipment.trangThai || 'Không rõ'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={cx('product-price')}>
                                                Giá trị: {formatPrice(equipment.giaBan)}
                                            </div>

                                            <div className={cx('product-actions')}>
                                                <button
                                                    className={cx('view-detail-btn')}
                                                    onClick={() => handleViewDetail(equipment)}
                                                >
                                                    <i className="fas fa-eye"></i> Xem chi tiết
                                                </button>
                                                <button
                                                    className={cx('request-btn')}
                                                    onClick={() => handleViewGuide(equipment)}
                                                >
                                                    <i className="fas fa-clipboard-list"></i> Hướng dẫn sử dụng
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Show message when no results */}
                        {filteredEquipments.length === 0 && equipments.length > 0 && (
                            <div className={cx('no-results')}>
                                <p>Không tìm thấy thiết bị nào phù hợp với bộ lọc đã chọn.</p>
                            </div>
                        )}

                        {/* Loading state */}
                        {equipments.length === 0 && (
                            <div className={cx('loading-state')}>
                                <p>Đang tải dữ liệu...</p>
                            </div>
                        )}

                        {/* Fixed Pagination */}
                        {totalPages > 1 && (
                            <div className={cx('pagination')}>
                                {/* Previous button */}
                                <button
                                    className={cx('page-btn', 'prev-btn', { disabled: currentPage === 1 })}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                </button>

                                {/* Page numbers */}
                                {getPageNumbers().map((pageNum, index) => (
                                    <div key={index}>
                                        {pageNum === '...' ? (
                                            <span className={cx('page-dots')}>...</span>
                                        ) : (
                                            <button
                                                className={cx('page-btn', 'page-num', {
                                                    active: pageNum === currentPage,
                                                })}
                                                onClick={() => handlePageChange(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {/* Next button */}
                                <button
                                    className={cx('page-btn', 'next-btn', { disabled: currentPage === totalPages })}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedEquipment && (
                <div className={cx('modal-overlay')} onClick={closeModal}>
                    <div className={cx('modal-content', 'detail-modal')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('modal-header')}>
                            <h2>Chi tiết thiết bị</h2>
                            <button className={cx('close-btn')} onClick={closeModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className={cx('modal-body')}>
                            <div className={cx('equipment-detail-content')}>
                                <div className={cx('equipment-image-section')}>
                                    <img src={selectedEquipment.hinhAnh} alt={selectedEquipment.tenThietBi} />
                                </div>
                                <div className={cx('equipment-info-section')}>
                                    <h3>{selectedEquipment.tenThietBi}</h3>
                                    <div className={cx('detail-grid')}>
                                        <div className={cx('detail-item')}>
                                            <span className={cx('label')}>Mã thiết bị:</span>
                                            <span className={cx('value')}>{selectedEquipment.maThietBi}</span>
                                        </div>
                                        <div className={cx('detail-item')}>
                                            <span className={cx('label')}>Thương hiệu:</span>
                                            <span className={cx('value')}>{selectedEquipment.Hang || 'Không rõ'}</span>
                                        </div>
                                        <div className={cx('detail-item')}>
                                            <span className={cx('label')}>Xuất xứ:</span>
                                            <span className={cx('value')}>
                                                {selectedEquipment.xuatXu || 'Không rõ'}
                                            </span>
                                        </div>
                                        <div className={cx('detail-item')}>
                                            <span className={cx('label')}>Thuộc phòng:</span>
                                            <span className={cx('value')}>
                                                {selectedEquipment.tenPhong || 'Không rõ'}
                                            </span>
                                        </div>
                                        <div className={cx('detail-item')}>
                                            <span className={cx('label')}>Tình trạng:</span>
                                            <span
                                                className={cx(
                                                    'value',
                                                    'status',
                                                    selectedEquipment.trangThai?.toLowerCase()?.replace(/\s+/g, '-') ||
                                                        'unknown',
                                                )}
                                            >
                                                {selectedEquipment.trangThai || 'Không rõ'}
                                            </span>
                                        </div>
                                        <div className={cx('detail-item')}>
                                            <span className={cx('label')}>Giá trị:</span>
                                            <span className={cx('value', 'price')}>
                                                {formatPrice(selectedEquipment.giaBan)}
                                            </span>
                                        </div>
                                        <div className={cx('detail-item')}>
                                            <span className={cx('label')}>Ngày mua:</span>
                                            <span className={cx('value')}>{formatDate(selectedEquipment.ngayMua)}</span>
                                        </div>
                                    </div>
                                    {selectedEquipment.moTa && (
                                        <div className={cx('description-section')}>
                                            <h4>Mô tả:</h4>
                                            <p>{selectedEquipment.moTa}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Guide Modal */}
            {showGuideModal && selectedEquipment && (
                <div className={cx('modal-overlay')} onClick={closeModal}>
                    <div className={cx('modal-content', 'guide-modal')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('modal-header')}>
                            <h2>Hướng dẫn sử dụng - {selectedEquipment.tenThietBi}</h2>
                            <button className={cx('close-btn')} onClick={closeModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className={cx('modal-body')}>
                            <div className={cx('guide-content')}>
                                <div className={cx('equipment-summary')}>
                                    <div className={cx('equipment-thumb')}>
                                        <img src={selectedEquipment.hinhAnh} alt={selectedEquipment.tenThietBi} />
                                    </div>
                                    <div className={cx('equipment-basic-info')}>
                                        <h4>{selectedEquipment.tenThietBi}</h4>
                                        <p>Thương hiệu: {selectedEquipment.Hang || 'Không rõ'}</p>
                                        <p>Phòng: {selectedEquipment.tenPhong || 'Không rõ'}</p>
                                    </div>
                                </div>

                                <div className={cx('guide-sections')}>
                                    <div className={cx('guide-section')}>
                                        <h4>
                                            <i className="fas fa-power-off"></i> Bật/Tắt thiết bị
                                        </h4>
                                        <ol>
                                            <li>Kiểm tra nguồn điện đã được cắm và bật</li>
                                            <li>Nhấn nút nguồn chính trên thiết bị</li>
                                            <li>Đợi 3-5 giây để thiết bị khởi động hoàn tất</li>
                                            <li>Kiểm tra đèn báo trạng thái hiển thị màu xanh</li>
                                        </ol>
                                    </div>

                                    <div className={cx('guide-section')}>
                                        <h4>
                                            <i className="fas fa-cogs"></i> Cài đặt cơ bản
                                        </h4>
                                        <ol>
                                            <li>Truy cập menu cài đặt trên màn hình chính</li>
                                            <li>Chọn ngôn ngữ hiển thị phù hợp</li>
                                            <li>Điều chỉnh các thông số cơ bản theo hướng dẫn</li>
                                            <li>Lưu cài đặt và khởi động lại thiết bị</li>
                                        </ol>
                                    </div>

                                    <div className={cx('guide-section')}>
                                        <h4>
                                            <i className="fas fa-exclamation-triangle"></i> Lưu ý an toàn
                                        </h4>
                                        <ul>
                                            <li>Không sử dụng thiết bị khi tay ướt</li>
                                            <li>Đảm bảo thiết bị được đặt ở nơi khô ráo, thoáng mát</li>
                                            <li>Không tự ý tháo rời các bộ phận</li>
                                            <li>Báo cáo ngay khi phát hiện bất thường</li>
                                        </ul>
                                    </div>

                                    <div className={cx('guide-section')}>
                                        <h4>
                                            <i className="fas fa-tools"></i> Bảo trì định kỳ
                                        </h4>
                                        <ul>
                                            <li>Vệ sinh thiết bị hàng tuần bằng khăn mềm</li>
                                            <li>Kiểm tra các kết nối định kỳ</li>
                                            <li>Thực hiện bảo trì theo lịch của nhà sản xuất</li>
                                            <li>Liên hệ bộ phận kỹ thuật khi cần hỗ trợ</li>
                                        </ul>
                                    </div>

                                    <div className={cx('guide-section')}>
                                        <h4>
                                            <i className="fas fa-phone"></i> Hỗ trợ kỹ thuật
                                        </h4>
                                        <div className={cx('support-info')}>
                                            <p>
                                                <strong>Hotline:</strong> 1900-xxxx
                                            </p>
                                            <p>
                                                <strong>Email:</strong> support@example.com
                                            </p>
                                            <p>
                                                <strong>Thời gian hỗ trợ:</strong> 8:00 - 17:00 (T2-T6)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Back to Top Button */}
            <button
                className={cx('back-to-top')}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Về đầu trang"
            >
                <i className="fas fa-chevron-up"></i>
            </button>
        </div>
    );
};

export default Locthietbi;
