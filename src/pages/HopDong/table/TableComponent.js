import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

import styles from './table.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

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
                    <td><span className={cx('text-status')}>{item.trangThai}</span></td>
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
