import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRectangleXmark } from '@fortawesome/free-solid-svg-icons';

import styles from './modalDelete.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const ModalDelete = ({showDelete, setShowDelete, HandleDeleteRow}) => {
  return (
    showDelete && (
        <div className={cx('confirm-delete')}>
            <div className={cx('form-delete')}>
                <span className={cx('btn-close')} onClick={() => setShowDelete(null)}>
                    <FontAwesomeIcon icon={faRectangleXmark} />
                </span>
                <div>
                    <h4>Thông báo</h4>
                </div>
                <p>
                    Bạn có chắc chắn muốn hủy hợp đồng <strong>{showDelete.ten}</strong> không?
                </p>
                <div className={cx('btn-handle')}>
                    <button className={cx('btn-del')} onClick={HandleDeleteRow}>Xác nhận</button>
                    <button className={cx('btn-cancle')} onClick={() => setShowDelete(null)}>
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    )
  )
}

export default ModalDelete
