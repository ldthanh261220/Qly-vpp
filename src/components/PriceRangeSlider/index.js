import React, { useState, useEffect } from 'react';
import styles from './PriceRangeSlider.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const PriceRangeSlider = ({ onPriceChange, initialMin = 0, initialMax = 100000000, resetTrigger }) => {
    // Giá trị hiện tại trong slider (chưa được áp dụng)
    const [tempRange, setTempRange] = useState({
        min: initialMin,
        max: initialMax,
    });

    // Giá trị đã được áp dụng (để hiển thị trong "Đã chọn")
    const [appliedRange, setAppliedRange] = useState({
        min: initialMin,
        max: initialMax,
    });

    const MIN_PRICE = 0;
    const MAX_PRICE = 100000000;
    const STEP = 1000000; // 1 triệu VND mỗi bước

    // Lắng nghe thay đổi từ props để reset component
    useEffect(() => {
        setTempRange({
            min: initialMin,
            max: initialMax,
        });
        setAppliedRange({
            min: initialMin,
            max: initialMax,
        });
    }, [initialMin, initialMax]);

    // Lắng nghe resetTrigger để reset về default
    useEffect(() => {
        if (resetTrigger) {
            const defaultRange = {
                min: MIN_PRICE,
                max: MAX_PRICE,
            };
            setTempRange(defaultRange);
            setAppliedRange(defaultRange);
        }
    }, [resetTrigger]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const handleMinChange = (e) => {
        const value = parseInt(e.target.value);
        if (value <= tempRange.max) {
            setTempRange((prev) => ({
                ...prev,
                min: value,
            }));
        }
    };

    const handleMaxChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= tempRange.min) {
            setTempRange((prev) => ({
                ...prev,
                max: value,
            }));
        }
    };

    const handleMinInputChange = (e) => {
        const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || 0;
        if (value <= tempRange.max && value >= MIN_PRICE) {
            setTempRange((prev) => ({
                ...prev,
                min: value,
            }));
        }
    };

    const handleMaxInputChange = (e) => {
        const value = parseInt(e.target.value.replace(/[^0-9]/g, '')) || MAX_PRICE;
        if (value >= tempRange.min && value <= MAX_PRICE) {
            setTempRange((prev) => ({
                ...prev,
                max: value,
            }));
        }
    };

    // Chỉ áp dụng filter khi nhấn nút "ÁP DỤNG"
    const applyFilter = () => {
        setAppliedRange(tempRange);
        if (onPriceChange) {
            onPriceChange(tempRange);
        }
    };

    const resetFilter = () => {
        const resetRange = {
            min: MIN_PRICE,
            max: MAX_PRICE,
        };
        setTempRange(resetRange);
        setAppliedRange(resetRange);
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
                            value={formatPrice(tempRange.min)}
                            onChange={handleMinInputChange}
                            className={cx('price-input')}
                            placeholder="0"
                        />
                    </div>
                    <div className={cx('input-group')}>
                        <label>Đến</label>
                        <input
                            type="text"
                            value={formatPrice(tempRange.max)}
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
                                left: `${(tempRange.min / MAX_PRICE) * 100}%`,
                                right: `${100 - (tempRange.max / MAX_PRICE) * 100}%`,
                            }}
                        ></div>
                    </div>

                    <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        step={STEP}
                        value={tempRange.min}
                        onChange={handleMinChange}
                        className={cx('slider', 'slider-min')}
                    />

                    <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        step={STEP}
                        value={tempRange.max}
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
                            {formatPrice(appliedRange.min)}đ - {formatPrice(appliedRange.max)}đ
                        </strong>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PriceRangeSlider;
