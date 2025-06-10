import React from 'react';

import styles from './filter.module.scss';
import classNames from 'classnames/bind';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faRepeat } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const Filter = ({
    setStatusFilter,
    statusFilter,
    contractStatus,
    setCurrentPage,
    setFieldFilter,
    searchTerm,
    fieldFilter,
    dateStart,
    dateEnd,
    setDateStart,
    setDateEnd,
    setSearchTerm,
}) => {
    const handleReset = () => {
        setStatusFilter('');
        setFieldFilter('');
        setSearchTerm('');
        setDateStart('');
        setDateEnd('');
        setCurrentPage(1);
    };
    return (
        <div className={cx('filter')}>
            <button className={cx('btn-reset')} onClick={handleReset}>
                <FontAwesomeIcon icon={faRepeat} /> Reset
            </button>
            {/* Trạng thái */}
            <div className={cx('filter-status')}>
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">Trạng thái</option>
                    {contractStatus.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Lĩnh vực */}
            <div className={cx('filter-field')}>
                <select
                    value={fieldFilter}
                    onChange={(e) => {
                        setFieldFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">Tất cả lĩnh vực</option>
                    <option value="Lĩnh vực 1">Lĩnh vực 1</option>
                    <option value="Lĩnh vực 2">Lĩnh vực 2</option>
                    <option value="Lĩnh vực 3">Lĩnh vực 3</option>
                </select>
            </div>

            {/* Ngày ký từ - đến */}
            <div className={cx('filter-date')}>
                <span className={cx('text-date')}>Lọc theo ngày ký</span>
                <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
                <span>đến</span>
                <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
            </div>

            {/* Tìm theo tên nhà thầu */}
            <div className={cx('filter-search')}>
                <input
                    placeholder="Nhập tên nhà thầu..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <button>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
        </div>
    );
};

export default Filter;
