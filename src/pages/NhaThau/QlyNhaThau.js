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
import linhvucService from '~/services/linhvucService';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const QlyNhaThau = () => {
    const [nhaThaus, setNhaThaus] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterField, setFilterField] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDelete, setShowDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [linhVucList, setLinhVucList] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

    const itemsPerPage = 3;

    const navigate = useNavigate();
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

    const handleExportExcel = async () => {
        if (!filteredData || filteredData.length === 0) {
            toast.warn('Không có dữ liệu để xuất!');
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Danh sách nhà thầu');

        // Header
        const header = [
            'STT',
            'Mã nhà thầu',
            'Mã số thuế',
            'Nơi cấp',
            'Tên nhà thầu',
            'Tên viết tắt',
            'Loại hình DN',
            'Số GPKD',
            'Địa chỉ',
            'Website',
            'Người đại diện',
            'Chức vụ',
            'Số định danh',
            'Ngày sinh',
            'Tên lĩnh vực',
        ];

        worksheet.addRow(header);

        // Style header
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '1A237E' }, // xanh đậm
            };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
            };
        });

        // Add data rows
        filteredData.forEach((item, index) => {
            worksheet.addRow([
            index + 1,
            item.ma,
            item.maSoThue,
            item.noiCap,
            item.tenNhaThau,
            item.tenVietTat,
            item.loaiHinhDoanhNghiep,
            item.soGiayPhepKinhDoanh,
            item.diaChi,
            item.website,
            item.hoTenNguoiDaiDien,
            item.chucVuNguoiDaiDien,
            item.soDienDanh,
            new Date(item.ngaySinh).toLocaleDateString('vi-VN'),
            item.tenLinhVuc,
            ]);
        });

        // Auto column width
        worksheet.columns.forEach((column) => {
            let maxLength = 12;
            column.eachCell?.((cell) => {
            const cellValue = cell.value ? cell.value.toString() : '';
            maxLength = Math.max(maxLength, cellValue.length + 2);
            });
            column.width = maxLength;
        });

        // Xuất file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, 'DanhSachNhaThau.xlsx');
        toast.success('Xuất Excel thành công!');
    };

    const handleCreate = () => {
        navigate('/taonhathau')
    }

    useEffect(() => {
        const fetchLinhVuc = async () => {
            try {
            const res = await linhvucService.getAllLinhVucService();
            if (res.errCode === 0) {
                setLinhVucList(res.danhsachlinhvuc); // hoặc `res.data` tùy API
            }
            } catch (err) {
            console.error('Lỗi khi lấy danh sách lĩnh vực:', err);
            }
        };

        fetchLinhVuc();

        fetchData();
    }, []);


    const filteredData = nhaThaus.filter((item) => {
        const matchSearch = item.tenNhaThau.toLowerCase().includes(searchTerm.toLowerCase());
        const matchField = filterField ? item.maLinhVuc === filterField : true;
        return matchSearch && matchField;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;

        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Nếu là ngày
        if (sortConfig.key === 'ngayKy') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSortSelect = (key, direction) => {
        setSortConfig({ key, direction });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleDelete = async () => {
        if (!showDelete || !showDelete.maNhaThau) {
            toast.warn('Không có nhà thầu để xóa!');
            return;
        }

        try {
            await nhathauService.deleteNhaThauService(showDelete.maNhaThau);
            toast.success('Xóa nhà thầu thành công!');

            // Cập nhật lại danh sách
            setNhaThaus(prev =>
            prev.filter(item => item.maNhaThau !== showDelete.maNhaThau)
            );

            // Đóng modal hoặc popup xác nhận
            setShowDelete(null);
        } catch (error) {
            console.error('Lỗi khi xóa nhà thầu:', error);
            toast.error('Xóa nhà thầu thất bại!');
        }
    };


    return (
        <div className={cx('section')}>
            <div className={cx('header')}>
                <p>Danh sách nhà thầu</p>
                <div>
                    <button className={cx('btn-export')} onClick={handleExportExcel}>
                        Xuất Excel
                    </button>
                    <button className={cx('btn-create')} onClick={handleCreate}>
                        Tạo nhà thầu
                    </button>
                </div>
                <div className={cx('filter')}>
                    <div className={cx('search-1')}>
                        <select
                            value={filterField}
                            onChange={(e) => {
                                setFilterField(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Tất cả lĩnh vực</option>
                            {linhVucList.map((lv) => (
                                <option key={lv.maLinhVuc} value={lv.maLinhVuc}>
                                {lv.tenLinhVuc}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={cx('form-group')}>
                        <select value={sortConfig.key + '-' + sortConfig.direction} onChange={(e) => {
                            const [key, direction] = e.target.value.split('-');
                            handleSortSelect(key, direction);
                        }}>
                            <option value="">Sắp xếp theo</option>
                            <option value="tenNhaThau-asc">Tên nhà thầu (A-Z)</option>
                            <option value="maSoThue-asc">Mã số thuế (A-Z)</option>
                            <option value="ngaySinh-asc">Ngày thành lập (A-Z)</option>
                            <option value="tenNhaThau-desc">Tên nhà thầu (Z-A)</option>
                            <option value="maSoThue-desc">Mã số thuế (Z-A)</option>
                            <option value="ngaySinh-desc">Ngày thành lập (Z-A)</option>
                        </select>
                    </div>
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
