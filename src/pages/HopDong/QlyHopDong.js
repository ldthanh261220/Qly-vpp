import React, { useState } from 'react';

import styles from './QlyHopDong.module.scss';
import classNames from 'classnames/bind';

import { contracts } from './data';
import { contractStatus } from '~/constants/contractStatus';
import { useNavigate } from 'react-router-dom';
import Filter from './filter/Filter';
import TableComponent from './table/TableComponent';
import ModalDelete from './modalDelete/ModalDelete';
import Pagination from './pagination/Pagination';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const QlyHopDong = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [fieldFilter, setFieldFilter] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showDelete, setShowDelete] = useState(null);
    const navigate = useNavigate();
    const itemsPerPage = 5;

    const HandleDeleteRow = () => {
        // TODO: Xử lý xóa tại đây (gửi API hoặc cập nhật state)
        console.log('Đã xác nhận xóa:', showDelete);
        setShowDelete(null);
    };

    const HandleViewDetails = (id) => {
        navigate(`/hopdong/${id}`);
    };

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
    console.log('dateEnd: ' + dateEnd, 'dateStart: ' + dateStart);
    console.log(filteredContracts);
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
            <div>
                {/* Table */}
                <TableComponent
                    paginatedContracts={paginatedContracts}
                    HandleViewDetails={HandleViewDetails}
                    setShowDelete={setShowDelete}
                />

                {/* Phân trang */}
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
            </div>

            {/* Modal xác nhận xóa */}
            <ModalDelete showDelete={showDelete} setShowDelete={setShowDelete} HandleDeleteRow={HandleDeleteRow} />
        </div>
    );
};

export default QlyHopDong;
