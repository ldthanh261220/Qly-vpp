import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

import styles from './table.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const statusStyleMap = {
  "Đang soạn thảo": { backgroundColor: "#f0f0f0", color: "#555" },
  "Chờ ký": { backgroundColor: "#d0e8ff", color: "#0056b3" },
  "Đã ký": { backgroundColor: "#d4edda", color: "#155724" },
  "Đang thực hiện": { backgroundColor: "#d1ecf1", color: "#0c5460" },
  "Sắp hết hạn": { backgroundColor: "#fff3cd", color: "#856404" },
  "Hoàn thành": { backgroundColor: "#c3e6cb", color: "#155724" },
  "Đã thanh lý": { backgroundColor: "#e2e3f3", color: "#383d7c" },
  "Hết hạn": { backgroundColor: "#f8d7da", color: "#721c24" },
  "Bị hủy": { backgroundColor: "#d6d8db", color: "#1b1e21" },
};
const TableComponent = ({paginatedContracts, HandleViewDetails, setShowDelete}) => {
  return (
    <table>
        <thead>
            <tr>
                <th style={{ width: '15%' }}>Mã</th>
                <th style={{ width: '20%' }}>Tên hợp đồng</th>
                <th style={{ width: '20%' }}>Nhà thầu</th>
                <th style={{ width: '20%' }}>Ngày ký</th>
                <th style={{ width: '15%' }}>Trạng thái</th>
                <th style={{ width: '10%' }}>Action</th>
            </tr>
        </thead>
        <tbody>
            {paginatedContracts.map((item) => (
                <tr key={item.maHopDong}>
                    <td>{item.maHopDong}</td>
                    <td>{item.tenHopDong}</td>
                    <td>{item.tenNhaThau}</td>
                    <td>{new Date(item.ngayKy).toLocaleDateString('vi-VN')}</td>
                    <td><span style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        display: "inline-block",
                        fontWeight: "500",
                        ...statusStyleMap[item.trangThai]
                        }}>{item.trangThai}</span></td>
                    <td>
                        <div className={cx('icons')}>
                            <button><FontAwesomeIcon icon={faEye} onClick={()=>HandleViewDetails(item.maHopDong)} className={cx('btn-view')}/></button>
                            {/* <button className={cx('btn-update')}><FontAwesomeIcon icon={faPenToSquare} /></button> */}
                            <button className={cx('btn-del')} onClick={() => setShowDelete(item)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
  )
}

export default TableComponent
