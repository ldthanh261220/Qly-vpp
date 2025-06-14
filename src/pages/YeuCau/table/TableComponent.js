import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

import styles from './table.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const TableComponent = ({ paginatedRequests, HandleViewDetails, setShowDelete }) => {
  return (
    <table className={cx('table')}>
      <thead>
        <tr>
          <th style={{ width: '23%' }}>Tên vật dụng</th>
          <th style={{ width: '25%' }}>Lý do đề xuất</th>
          <th style={{ width: '17%' }}>Người tạo</th>
          <th style={{ width: '12%' }}>Loại yêu cầu</th>
          <th style={{ width: '15%' }}>Trạng thái</th>
          <th style={{ width: '8%' }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {paginatedRequests.map((item) => (
          <tr key={item.maYeuCau}>
            <td>{item.tenVatDung}</td>
            <td>{item.lyDoDeXuat}</td>
            <td>{item.tenNguoiTao}</td>
            <td>{item.loaiYeuCau}</td>
            <td>
              <span
                className={cx('text-status', {
                  approved: item.trangThai === 'Đã duyệt',
                  rejected: item.trangThai === 'Đã từ chối',
                  pending: item.trangThai === 'Đang chờ duyệt',
                })}
              >
                {item.trangThai}
              </span>
            </td>
            <td>
              <div className={cx('icons')}>
                <button onClick={() => HandleViewDetails(item.maYeuCau)}>
                  <FontAwesomeIcon icon={faEye} className={cx('btn-view')} />
                </button>
                <button className={cx('btn-del')} onClick={() => setShowDelete(item)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
