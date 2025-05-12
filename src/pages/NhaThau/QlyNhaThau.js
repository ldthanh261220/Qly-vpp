import React, { useState } from 'react';

import styles from './QlyNhaThau.module.scss';
import classNames from 'classnames/bind';
import ItemList from './ItemList/ItemList';
import { DanhSachNhaThau } from './data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faRectangleXmark, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const QlyNhaThau = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDelete, setShowDelete] = useState(null);
  const itemsPerPage = 3;

  // Filter + Search
  const filteredData = DanhSachNhaThau.filter((item) => {
    const matchSearch = item.tenNhaThau.toLowerCase().includes(searchTerm.toLowerCase());
    const matchField = filterField ? item.linhVuc === filterField : true;
    return matchSearch && matchField;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={cx('section')}>
      {/* Header */}
      <div className={cx('header')}>
        <p>Danh sách nhà thầu</p>
        <div className={cx('filter')}>
          {/* Search */}
          <div className={cx('search')}>
            <input
              placeholder="Nhập tên nhà thầu..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
          </div>

          {/* Filter by Field */}
          <div className={cx('search-1')}>
            <select
              value={filterField}
              onChange={(e) => {
                setFilterField(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Tất cả</option>
              <option value="Lĩnh vực 1">Lĩnh vực 1</option>
              <option value="Lĩnh vực 2">Lĩnh vực 2</option>
              <option value="Lĩnh vực 3">Lĩnh vực 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danh sách nhà thầu */}
      <div className={cx('main')}>
        <div className={cx('list')}>
          {paginatedData.map((item) => (
            <ItemList data={item} key={item.ma} setShowDelete={setShowDelete} />
          ))}
        </div>

        {/* Pagination */}
        <div className={cx('pagination')}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={cx({ active: currentPage === page })}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showDelete && (
        <div className={cx('confirm-delete')}>
          <div className={cx('form-delete')}>
            <span className={cx('btn-close')} onClick={() => setShowDelete(null)}>
              <FontAwesomeIcon icon={faRectangleXmark} />
            </span>
            <div>
              <h4>Thông báo</h4>
            </div>
            <p>
              Bạn có chắc chắn muốn xóa nhà thầu <strong>{showDelete.tenNhaThau}</strong>?
            </p>
            <div className={cx('btn-handle')}>
              <button className={cx('btn-del')}>Xác nhận</button>
              <button className={cx('btn-cancle')} onClick={() => setShowDelete(null)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QlyNhaThau;
