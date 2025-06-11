import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ItemList.module.scss';
import classNames from 'classnames/bind';

// import { IoSearch } from "react-icons/io5";

const cx = classNames.bind(styles);

const ItemList = ({ data, setShowDelete }) => {
    const navigate = useNavigate();
    const handleClickDelete = function () {
        setShowDelete(data);
    };

    const handleClickViewDetails = function () {
        navigate(`/nhathau/${data.maNhaThau}`);
    };
    return (
        <div className={cx('item')}>
            {/* Content */}
            <div className={cx('content')}>
                <div className={cx('col')}>
                    <span>Mã nhà thầu: {data.maNhaThau}</span>
                    <p>
                        {data.tenNhaThau} - {data.tenVietTat}
                    </p>
                    <span>{data.tenLinhVuc}</span>
                </div>
                <div className={cx('col')}>
                    <span>{data.diaChi}</span>
                    <span>Ngay thanh lap: {new Date(data.ngaySinh).toLocaleDateString('vi-VN')}</span>
                    <span>Loai hinh doanh nghiep: {data.loaiHinhDoanhNghiep}</span>
                </div>
            </div>
            {/* Button handle */}
            <div className={cx('handle-event')}>
                <button className={cx('btn-del')} onClick={handleClickDelete}>
                    Xóa
                </button>
                <button className={cx('btn-details')} onClick={handleClickViewDetails}>
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
};

export default ItemList;
