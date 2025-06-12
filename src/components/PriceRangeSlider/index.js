import React, { useState, useEffect } from 'react';
import styles from './PriceRangeSlider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const PriceRangeSlider = ({ onPriceChange, initialMin = 0, initialMax = 100000000 }) => {
    const [priceRange, setPriceRange] = useState({
        min: initialMin,
        max: initialMax,
    });

    const MIN_PRICE = 0;
    const MAX_PRICE = 100000000;
    const STEP = 1000000; // 1 triệu VND mỗi bước

    // Gọi callback khi giá trị thay đổi (với debounce để tránh gọi quá nhiều)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onPriceChange) {
                onPriceChange(priceRange);
            }
        }, 300); // Debounce 300ms

        return () => clearTimeout(timeoutId);
    }, [priceRange, onPriceChange]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const handleMinChange = (e) => {
        const value = parseInt(e.target.value);
        if (value <= priceRange.max) {
            setPriceRange((prev) => ({
                ...prev,
                min: value,
            }));
        }
    };

    const handleMaxChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= priceRange.min) {
            setPriceRange((prev) => ({
                ...prev,
                max: value,
            }));
        }
    };

    const handleMinInputChange = (e) => {
        const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
        if (value <= priceRange.max && value >= MIN_PRICE) {
            setPriceRange((prev) => ({
                ...prev,
                min: value,
            }));
        }
    };

    const handleMaxInputChange = (e) => {
        const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || MAX_PRICE;
        if (value >= priceRange.min && value <= MAX_PRICE) {
            setPriceRange((prev) => ({
                ...prev,
                max: value,
            }));
        }
    };

    const applyFilter = () => {
        if (onPriceChange) {
            onPriceChange(priceRange);
        }
    };

    const resetFilter = () => {
        const resetRange = {
            min: MIN_PRICE,
            max: MAX_PRICE,
        };
        setPriceRange(resetRange);
        if (onPriceChange) {
            onPriceChange(resetRange);
        }
    };

    return (
        <div className={cx('price-filter-container')}>
            <div className={cx('filter-header')}>
                <h3 className={cx('filter-title')}>
                    Giá trị (VNĐ)
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={cx('chevron-icon')}>
                        <path
                            d="M18 15l-6-6-6 6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </h3>
            </div>

            <div className={cx('filter-content')}>
                {/* Input fields */}
                <div className={cx('price-inputs')}>
                    <div className={cx('input-group')}>
                        <label>Từ</label>
                        <input
                            type="text"
                            value={formatPrice(priceRange.min)}
                            onChange={handleMinInputChange}
                            className={cx('price-input')}
                            placeholder="0"
                        />
                    </div>
                    <div className={cx('input-group')}>
                        <label>Đến</label>
                        <input
                            type="text"
                            value={formatPrice(priceRange.max)}
                            onChange={handleMaxInputChange}
                            className={cx('price-input')}
                            placeholder="100.000.000"
                        />
                    </div>
                </div>

                {/* Dual Range Slider */}
                <div className={cx('slider-container')}>
                    <div className={cx('slider-track')}>
                        <div
                            className={cx('slider-range')}
                            style={{
                                left: `${(priceRange.min / MAX_PRICE) * 100}%`,
                                right: `${100 - (priceRange.max / MAX_PRICE) * 100}%`,
                            }}
                        ></div>
                    </div>

                    <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        step={STEP}
                        value={priceRange.min}
                        onChange={handleMinChange}
                        className={cx('slider', 'slider-min')}
                    />

                    <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        step={STEP}
                        value={priceRange.max}
                        onChange={handleMaxChange}
                        className={cx('slider', 'slider-max')}
                    />
                </div>

                {/* Price Labels */}
                <div className={cx('price-labels')}>
                    <span className={cx('price-label')}>{formatPrice(MIN_PRICE)}đ</span>
                    <span className={cx('price-label')}>{formatPrice(MAX_PRICE)}đ</span>
                </div>

                {/* Action Buttons */}
                <div className={cx('action-buttons')}>
                    <button onClick={applyFilter} className={cx('apply-btn')}>
                        ÁP DỤNG
                    </button>
                    <button onClick={resetFilter} className={cx('reset-btn')}>
                        ĐẶT LẠI
                    </button>
                </div>

                {/* Current Selection Display */}
                <div className={cx('current-selection')}>
                    <p>
                        Đã chọn:{' '}
                        <strong>
                            {formatPrice(priceRange.min)}đ - {formatPrice(priceRange.max)}đ
                        </strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PriceRangeSlider;
