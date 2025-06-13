import React, { useEffect } from 'react';
import styles from './filter.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faRepeat } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const Filter = ({
  setStatusFilter,
  statusFilter,
  requestStatus,
  requestType,
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

      {/* Trạng thái yêu cầu */}
      <div className={cx('filter-status')}>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Trạng thái</option>
          {requestStatus.map((item) => (
            <option key={item.value} value={item.value}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Lọc theo lĩnh vực (nếu có) */}
      <div className={cx('filter-field')}>
        <select
          value={fieldFilter}
          onChange={(e) => {
            setFieldFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Loai yeu cau</option>
          {requestType.map((lv) => (
            <option key={lv.name} value={lv.value}>
              {lv.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ngày tạo từ - đến */}
      <div className={cx('filter-date')}>
        <span className={cx('text-date')}>Lọc theo ngày tạo</span>
        <input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
        <span>đến</span>
        <input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
      </div>

      {/* Tìm theo tên vật dụng */}
      <div className={cx('filter-search')}>
        <input
          placeholder="Nhập tên vat dung..."
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
