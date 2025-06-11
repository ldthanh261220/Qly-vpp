import React, { useState, useEffect } from 'react';
import styles from './QlyNhaThau.module.scss';
import classNames from 'classnames/bind';
import ItemList from './ItemList/ItemList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faRectangleXmark, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import nhathauService from '~/services/nhathauService';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

const QlyNhaThau = () => {
    const [nhaThaus, setNhaThaus] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterField, setFilterField] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDelete, setShowDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 3;

    // ✅ Hàm fetch data riêng để tái sử dụng
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await nhathauService.getAllNhaThauService();
            if (res.errCode === 0) {
                setNhaThaus(res.danhsachnhathau);
            }
        } catch (error) {
            toast.error('Lỗi khi tải danh sách nhà thầu!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = nhaThaus.filter((item) => {
        const matchSearch = item.tenNhaThau.toLowerCase().includes(searchTerm.toLowerCase());
        const matchField = filterField ? item.tenLinhVuc === filterField : true;
        return matchSearch && matchField;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleDelete = async () => {
        try {
            if (showDelete) {
                await nhathauService.deleteNhaThau(showDelete.ma);
                toast.success('Xóa nhà thầu thành công!');
                setShowDelete(null);
                fetchData();
            }
        } catch (error) {
            toast.error('Xóa nhà thầu thất bại!');
        }
    };

    return (
        <div className={cx('section')}>
            <div className={cx('header')}>
                <p>Danh sách nhà thầu</p>
                <div className={cx('filter')}>
                    <div className={cx('search')}>
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

            <div className={cx('main')}>
                {isLoading ? (
                    <div className={cx('spinner-container')}>
                        <ClipLoader color="#3498db" size={50} />
                    </div>
                ) : (
                    <div className={cx('list')}>
                        {currentItems.length === 0 ? (
                            <p className={cx('no-data')}>Không có nhà thầu nào được tìm thấy.</p>
                        ) : (
                            currentItems.map((item) => (
                                <ItemList data={item} key={item.ma} setShowDelete={setShowDelete} />
                            ))
                        )}
                    </div>
                )}

                {!isLoading && totalPages > 1 && (
                    <div className={cx('pagination')}>
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
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

                        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                            <FontAwesomeIcon icon={faAngleRight} />
                        </button>
                    </div>
                )}
            </div>

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
                            <button className={cx('btn-del')} onClick={handleDelete}>
                                Xác nhận
                            </button>
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
