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
                <th style={{ width: '10%' }}>Mã</th>
                <th style={{ width: '17%' }}>Tên hợp đồng</th>
                <th style={{ width: '18%' }}>Nhà thầu</th>
                <th style={{ width: '15%' }}>Ngày ký</th>
                <th style={{ width: '15%' }}>Ngày hết hạn</th>
                <th style={{ width: '15%' }}>Trạng thái</th>
                <th style={{ width: '10%' }}>Action</th>
            </tr>
        </thead>
        <tbody>
            {paginatedContracts.map((item) => (
                <tr key={item.ma}>
                    <td>{item.ma}</td>
                    <td>{item.ten}</td>
                    <td>{item.tenNhaThau}</td>
                    <td>{item.ngayKy}</td>
                    <td>{item.ngayHetHan}</td>
                    <td><span className={cx('text-status')}>{item.trangThai}</span></td>
                    <td>
                        <div className={cx('icons')}>
                            <button><FontAwesomeIcon icon={faEye} onClick={()=>HandleViewDetails(item.ma)} className={cx('btn-view')}/></button>
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
