import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Qlythietbi.module.scss';
import Themthietbi from './Themthietbi';
import Chinhsuathietbi from './Chinhsuathietbi';
import Xacnhanxoa from './Xacnhanxoa';
import deviceService from '~/services/thietbiService';
import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const cx = classNames.bind(styles);

const DEVICE_TYPES = [
    { id: null, name: '--Tất cả--' },
    { id: 1, name: 'Máy tính để bàn' },
    { id: 2, name: 'Máy in' },
    { id: 3, name: 'Bàn phím & Chuột' },
    { id: 4, name: 'Bộ phát Wi-Fi, Router, Switch' },
    { id: 5, name: 'Máy chiếu' },
    { id: 6, name: 'TV/Smart TV' },
    { id: 7, name: 'Màn hình trình chiếu' },
    { id: 8, name: 'Loa & Micro' },
    { id: 9, name: 'Điều hòa không khí' },
    { id: 10, name: 'Quạt điện' },
    { id: 11, name: 'Đèn chiếu sáng' },
    { id: 12, name: 'Tủ tài liệu' },
    { id: 13, name: 'Bàn ghế văn phòng' },
    { id: 14, name: 'Dụng cụ văn phòng phẩm' },
];

const DEVICE_STATES = ['-- Tất cả trạng thái --', 'Hoạt động', 'Hư hỏng', 'Bảo trì', 'Ngừng sử dụng'];
const SORT_OPTIONS = ['Mã thiết bị', 'Tên thiết bị', 'Giá bán'];

function Qlythietbi() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [listDevice, setListDevice] = useState([]);
    const [modals, setModals] = useState({
        add: false,
        edit: false,
        view: false,
        delete: false,
    });
    const [currentDevice, setCurrentDevice] = useState(null);
    const [filters, setFilters] = useState({
        unit: '--Tất cả--',
        state: '-- Tất cả trạng thái --',
        sort: 'Mã thiết bị',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const itemsPerPage = 5;

    const getAllDevices = async () => {
        try {
            // Tìm idDanhMuc từ tên danh mục được chọn
            const selectedCategory = DEVICE_TYPES.find((type) => type.name === filters.unit);
            const idDanhMuc = selectedCategory?.id;

            // Nếu chọn "Tất cả" (id = null) thì không truyền tham số
            const response = idDanhMuc
                ? await deviceService.getAllThietbiService(idDanhMuc)
                : await deviceService.getAllThietbiService();

            if (response?.errCode === 0) {
                setListDevice(response.danhsachthietbi);
                setFilteredData(response.danhsachthietbi);
                setIsSearching(false);
                setIsInitialLoad(false);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách thiết bị:', error);
        }
    };

    const handleFilterData = () => {
        const filtered = (listDevice || [])
            .filter((device) => {
                const matchUnit = filters.unit === '--Tất cả--' || device.tenPhong === filters.unit;
                const matchState = filters.state === '-- Tất cả trạng thái --' || device.trangThai === filters.state;
                const keyword = searchTerm.toLowerCase();
                const matchSearch = [
                    'maThietBi',
                    'tenThietBi',
                    'maDanhMuc',
                    'giaBan',
                    'viTriTrongPhong',
                    'moTa',
                    'hang',
                    'xuatXu',
                    'hinhAnh',
                    'tenPhong',
                ].some((field) => device[field]?.toString().toLowerCase().includes(keyword));
                return matchUnit && matchState && matchSearch;
            })
            .sort((a, b) => {
                const sortMap = {
                    'Mã thiết bị': 'maThietBi',
                    'Tên thiết bị': 'tenThietBi',
                    'Giá bán': 'giaBan',
                };
                const field = sortMap[filters.sort];
                if (field === 'giaBan') {
                    return a[field] - b[field];
                }
                return field ? a[field].toString().localeCompare(b[field].toString()) : 0;
            });

        setFilteredData(filtered);
        setIsSearching(false);
    };

    useEffect(() => {
        if (isInitialLoad) return;
        const delayDebounce = setTimeout(handleFilterData, 800);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm, filters.state, filters.sort]);

    // Separate useEffect for unit filter changes to call API
    useEffect(() => {
        if (isInitialLoad) return;
        setIsSearching(true);
        getAllDevices();
    }, [filters.unit]);

    useEffect(() => {
        setIsSearching(true);
        getAllDevices();
    }, []);

    const handleModalAction = (type, device = null) => {
        setCurrentDevice(device);
        setModals((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);

        // Nếu không phải filter unit thì set searching
        if (key !== 'unit') {
            setIsSearching(true);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setIsSearching(true);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        if (searchTerm) {
            setSearchTerm('');
            setIsSearching(true);
            setCurrentPage(1);
        }
    };

    const createNewDevice = async (data) => {
        try {
            const response = await deviceService.createNewDeviceService(data);
            if (response?.errCode !== 0) {
                alert(response.message);
            } else {
                await getAllDevices();
                handleModalAction('add');
            }
        } catch (error) {
            console.log('Lỗi khi tạo thiết bị mới:', error);
        }
    };

    const editDevice = async (data) => {
        try {
            const response = await deviceService.editDeviceService(data);
            if (response?.errCode !== 0) {
                alert(response.message);
            } else {
                await getAllDevices();
                handleModalAction('edit');
            }
        } catch (error) {
            console.log('Lỗi khi sửa thiết bị:', error);
        }
    };

    const confirmDeleteDevice = async (device) => {
        try {
            const res = await deviceService.deleteDeviceService(device.maThietBi);
            if (res?.errCode === 0) {
                await getAllDevices();
                handleModalAction('delete');
            } else {
                alert(res.errMessage);
            }
        } catch (error) {
            console.error('Lỗi khi xóa thiết bị:', error);
        }
    };

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentDevices = (filteredData || []).slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil((filteredData || []).length / itemsPerPage);

    const renderSelect = (options, value, onChange, placeholder) => (
        <select className={cx('filter-select')} value={value} onChange={onChange}>
            {options.map((option, idx) => (
                <option key={idx} value={typeof option === 'object' ? option.name : option}>
                    {typeof option === 'object' ? option.name : option}
                </option>
            ))}
        </select>
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };
    // Helper function for rendering page numbers with ellipsis
    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Maximum visible page numbers

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(
                    <button
                        key={i}
                        className={cx('pagination-btn', { active: currentPage === i })}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </button>,
                );
            }
        } else {
            // Show pages with ellipsis logic
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, currentPage + 2);

            // First page
            if (startPage > 1) {
                pages.push(
                    <button
                        key={1}
                        className={cx('pagination-btn', { active: currentPage === 1 })}
                        onClick={() => setCurrentPage(1)}
                    >
                        1
                    </button>,
                );

                if (startPage > 2) {
                    pages.push(
                        <span key="ellipsis1" className={cx('pagination-ellipsis')}>
                            ...
                        </span>,
                    );
                }
            }

            // Middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(
                    <button
                        key={i}
                        className={cx('pagination-btn', { active: currentPage === i })}
                        onClick={() => setCurrentPage(i)}
                    >
                        {i}
                    </button>,
                );
            }

            // Last page
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push(
                        <span key="ellipsis2" className={cx('pagination-ellipsis')}>
                            ...
                        </span>,
                    );
                }

                pages.push(
                    <button
                        key={totalPages}
                        className={cx('pagination-btn', { active: currentPage === totalPages })}
                        onClick={() => setCurrentPage(totalPages)}
                    >
                        {totalPages}
                    </button>,
                );
            }
        }

        return pages;
    };
    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>Quản lý thiết bị văn phòng UTE</h1>

            <div className={cx('search-bar')}>
                <div className={cx('search-input')}>
                    <i className={cx('search-icon')}>🔍</i>
                    {searchTerm && (
                        <div className={cx('icon-wrapper')} onClick={handleClearSearch}>
                            <FontAwesomeIcon
                                className={cx(isSearching ? 'loading' : 'clear')}
                                icon={isSearching ? faSpinner : faCircleXmark}
                            />
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Tìm kiếm thiết bị..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={cx('input')}
                    />
                </div>
                <button className={cx('btn', 'btn-filter')}>
                    <span>🔍</span> Bộ lọc nâng cao
                </button>
                <button className={cx('btn', 'btn-add')} onClick={() => handleModalAction('add')}>
                    <span>➕</span> Thêm thiết bị mới
                </button>
            </div>

            <div className={cx('filter-section')}>
                <div className={cx('filter-group')}>
                    <label className={cx('filter-label')}>Lọc theo danh mục:</label>
                    {renderSelect(DEVICE_TYPES, filters.unit, (e) => handleFilterChange('unit', e.target.value))}
                </div>
                <div className={cx('filter-group')}>
                    <label className={cx('filter-label')}>Lọc theo trạng thái:</label>
                    {renderSelect(DEVICE_STATES, filters.state, (e) => handleFilterChange('state', e.target.value))}
                </div>
            </div>

            <div className={cx('sort-section')}>
                <label className={cx('sort-label')}>Sắp xếp theo:</label>
                {renderSelect(SORT_OPTIONS, filters.sort, (e) => handleFilterChange('sort', e.target.value))}
            </div>

            <table className={cx('table')}>
                <thead className={cx('table-header')}>
                    <tr>
                        {['STT', 'Tên thiết bị', 'Hãng', 'Giá bán', 'Phòng', 'Trạng thái', 'Hành động'].map(
                            (header) => (
                                <th key={header} className={cx('header-cell')}>
                                    {header}
                                </th>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {isSearching ? (
                        <tr>
                            <td colSpan="8" className={cx('loading-row')}>
                                <div className={cx('loading-container')}>
                                    <FontAwesomeIcon className={cx('loading-icon')} icon={faSpinner} />
                                    <span>Đang tải dữ liệu...</span>
                                </div>
                            </td>
                        </tr>
                    ) : currentDevices?.length > 0 ? (
                        currentDevices.map((item, index) => (
                            <tr key={item.maThietBi} className={cx('table-row')}>
                                <td className={cx('cell')}>{indexOfFirstItem + index + 1}</td>
                                <td className={cx('cell')}>{item.tenThietBi}</td>
                                <td className={cx('cell')}>{item.Hang}</td>
                                <td className={cx('cell')}>{formatCurrency(item.giaBan)}</td>
                                <td className={cx('cell')}>{item.tenPhong}</td>
                                <td className={cx('cell')}>
                                    <span
                                        className={cx('status', {
                                            active: item.trangThai === 'Hoạt động',
                                            broken: item.trangThai === 'Hỏng',
                                            maintenance: item.trangThai === 'Bảo trì',
                                            inactive: item.trangThai === 'Ngừng sử dụng',
                                        })}
                                    >
                                        {item.trangThai}
                                    </span>
                                </td>
                                <td className={cx('cell')}>
                                    <div className={cx('action-buttons')}>
                                        <button
                                            className={cx('btn-edit')}
                                            onClick={() => handleModalAction('edit', item)}
                                            title="Chỉnh sửa thiết bị"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className={cx('btn-delete')}
                                            onClick={() => handleModalAction('delete', item)}
                                            title="Xóa thiết bị"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className={cx('no-data')}>
                                Không có thiết bị nào được tìm thấy
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {!isSearching && totalPages > 0 && (
                <div className={cx('pagination')}>
                    <div className={cx('pagination-info')}>
                        Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} của{' '}
                        {filteredData.length} thiết bị
                    </div>
                    <div className={cx('pagination-controls')}>
                        {/* Previous button */}
                        <button
                            className={cx('pagination-btn', 'prev-btn', {
                                disabled: currentPage === 1,
                            })}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            ‹
                        </button>

                        {/* Page numbers */}
                        <div className={cx('pagination-numbers')}>{renderPageNumbers()}</div>

                        {/* Next button */}
                        <button
                            className={cx('pagination-btn', 'next-btn', {
                                disabled: currentPage === totalPages,
                            })}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}

            {modals.add && <Themthietbi onClose={() => handleModalAction('add')} createNewDevice={createNewDevice} />}
            {modals.edit && (
                <Chinhsuathietbi
                    onClose={() => handleModalAction('edit')}
                    editDevice={editDevice}
                    deviceData={currentDevice}
                />
            )}
            {modals.delete && (
                <Xacnhanxoa
                    onClose={() => handleModalAction('delete')}
                    onConfirm={confirmDeleteDevice}
                    deviceData={currentDevice}
                    itemType="thiết bị"
                />
            )}
        </div>
    );
}

export default Qlythietbi;
