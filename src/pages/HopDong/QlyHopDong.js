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

    const navigate = useNavigate();
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const response = await hopDongService.getAllHopDongService();
                setContracts(response.danhsachhopdong || []);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách hợp đồng:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContracts();
    }, []);

    const HandleDeleteRow = () => {
        console.log('Đã xác nhận xóa:', showDelete);
        setShowDelete(null);
        // TODO: Gọi API xóa nếu cần
    };

    const HandleViewDetails = (id) => {
        navigate(`/hopdong/${id}`);
    };

    // Lọc dữ liệu
    const filteredContracts = contracts.filter((contract) => {
        const matchesSearch = contract.tenNhaThau.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? contract.trangThai === statusFilter : true;
        const matchesField = fieldFilter ? contract.linhVuc === fieldFilter : true;

        const contractDate = new Date(contract.ngayKy);
        const start = dateStart ? new Date(dateStart) : null;
        const end = dateEnd ? new Date(dateEnd) : null;
        const matchesDate = (!start || contractDate >= start) && (!end || contractDate <= end);

        return matchesSearch && matchesStatus && matchesField && matchesDate;
    });

    const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
    const paginatedContracts = filteredContracts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className={cx('manage-contract')}>
            <h3>
                <FontAwesomeIcon icon={faFileContract} /> Danh sách hợp đồng
            </h3>

            {/* Bộ lọc */}
            <Filter
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
