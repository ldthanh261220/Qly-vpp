import React, { useState, useEffect } from 'react';
import styles from './QlyHopDong.module.scss';
import classNames from 'classnames/bind';

import { contractStatus } from '~/constants/contractStatus';
import { useNavigate } from 'react-router-dom';
import Filter from './filter/Filter';
import TableComponent from './table/TableComponent';
import ModalDelete from './modalDelete/ModalDelete';
import Pagination from './pagination/Pagination';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners';

import hopDongService from '~/services/hopdongService';
import { toast } from 'react-toastify';
import linhvucService from '~/services/linhvucService';

const cx = classNames.bind(styles);

const QlyHopDong = () => {
    const [contracts, setContracts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [fieldFilter, setFieldFilter] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDelete, setShowDelete] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const [linhVucList, setLinhVucList] = useState([]);
    
    const navigate = useNavigate();
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await hopDongService.getAllHopDongService();
                setContracts(response.danhsachhopdong || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách hợp đồng:', error);
                toast.error('Lỗi khi tải danh sách hop dong!');
            } finally {
                setIsLoading(false);
            }
        };

        fetchContracts();

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
    }, []);

    const HandleDeleteRow = async () => {
        if (!showDelete || !showDelete.maHopDong) {
            toast.warn('Không có hop dong để xóa!');
            return;
        }

        try {
            await hopDongService.deleteHopDongService(showDelete.maHopDong);
            toast.success('Xóa hop dong thành công!');

            // Cập nhật lại danh sách
            setContracts(prev =>
            prev.filter(item => item.maHopDong !== showDelete.maHopDong)
            );

            // Đóng modal hoặc popup xác nhận
            setShowDelete(null);
        } catch (error) {
            console.error('Lỗi khi xóa hop dong:', error);
            toast.error('Xóa hop dong thất bại!');
        }
    };

    const HandleViewDetails = (id) => {
        navigate(`/hopdong/${id}`);
    };

    // Lọc dữ liệu
    const filteredContracts = contracts.filter((contract) => {
        const matchesSearch = contract.tenNhaThau.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? contract.trangThai === statusFilter : true;
        const matchesField = fieldFilter ? contract.maLinhVuc === fieldFilter : true;
        
        const contractDate = new Date(contract.ngayKy);
        const start = dateStart ? new Date(dateStart) : null;
        const end = dateEnd ? new Date(dateEnd) : null;
        const matchesDate = (!start || contractDate >= start) && (!end || contractDate <= end);

        return matchesSearch && matchesStatus && matchesField && matchesDate;
    });

    const sortedContracts = [...filteredContracts].sort((a, b) => {
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

    const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
    const paginatedContracts = sortedContracts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className={cx('manage-contract')}>
            <div className={cx('heading-title')}>
                <h3>
                    <FontAwesomeIcon icon={faFileContract} /> Danh sách hợp đồng
                </h3>
                <div className={cx('form-group')}>
                    <label>Sắp xếp theo:</label>
                    <select value={sortConfig.key + '-' + sortConfig.direction} onChange={(e) => {
                        const [key, direction] = e.target.value.split('-');
                        handleSortSelect(key, direction);
                    }}>
                        <option value="">-- Chọn --</option>
                        <option value="tenHopDong-asc">Tên hợp đồng (A-Z)</option>
                        <option value="tenHopDong-desc">Tên hợp đồng (Z-A)</option>
                        <option value="ngayKy-asc">Ngày ký (Cũ → Mới)</option>
                        <option value="ngayKy-desc">Ngày ký (Mới → Cũ)</option>
                    </select>
                </div>
            </div>
            {/* Bộ lọc */}
            <Filter
                linhVucList={linhVucList}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                contractStatus={contractStatus}
                fieldFilter={fieldFilter}
                setFieldFilter={setFieldFilter}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                dateStart={dateStart}
                setDateStart={setDateStart}
                dateEnd={dateEnd}
                setDateEnd={setDateEnd}
                setCurrentPage={setCurrentPage}
            />

            {/* Bảng hợp đồng */}
            {isLoading ? (
                <div className={cx('spinner-container')} style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                    <ClipLoader color="#11588B" loading={true} size={50} />
                </div>
            ) : (
                <>
                    <TableComponent
                        paginatedContracts={paginatedContracts}
                        HandleViewDetails={HandleViewDetails}
                        setShowDelete={setShowDelete}
                    />
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                </>
            )}

            {/* Modal xác nhận xóa */}
            <ModalDelete showDelete={showDelete} setShowDelete={setShowDelete} HandleDeleteRow={HandleDeleteRow} />
        </div>
    );
};

export default QlyHopDong;
