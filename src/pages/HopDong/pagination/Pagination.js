import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import styles from './pagination.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Pagination = ({currentPage, setCurrentPage, totalPages}) => {
  return (
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
  )
}

export default Pagination
