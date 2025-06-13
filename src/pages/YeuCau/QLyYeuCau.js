import React, { useState, useEffect } from 'react';
import styles from './QLyYeuCau.module.scss';
import classNames from 'classnames/bind';

import { useNavigate } from 'react-router-dom';
import Filter from './filter/Filter';
import TableComponent from './table/TableComponent';
import ModalDelete from './modalDelete/ModalDelete';
import Pagination from './pagination/Pagination';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import yeucauService from '~/services/yeucauService';
import { requestStatus } from '~/constants/requestStatus';
import { requestType } from '~/constants/requestType';

const cx = classNames.bind(styles);

const QLyYeuCau = () => {
  const [requests, setRequests] = useState([]);
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
    const fetchRequests = async () => {
      try {
        const response = await yeucauService.getAllYeuCauService();
        if (response.errCode === 0) {
          setRequests(response.danhsachyeucau || []);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách yêu cầu:', error);
        toast.error('Lỗi khi tải danh sách yêu cầu!');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const HandleDeleteRow = () => {
    console.log('Đã xác nhận xóa:', showDelete);
    setShowDelete(null);
    // Gọi API xóa nếu cần
  };

  const HandleViewDetails = (id) => {
    navigate(`/yeucau/${id}`);
  };

  const handleExportExcel = async () => {
    if (!filteredRequests || filteredRequests.length === 0) {
      toast.warn('Không có dữ liệu để xuất!');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Danh sách yêu cầu');

    // Header
    const header = [
      'STT',
      'Mã yêu cầu',
      'Loại yêu cầu',
      'Tên vật dụng',
      'Số lượng',
      'Tình trạng thiết bị',
      'Lý do đề xuất',
      'Mô tả chi tiết',
      'Trạng thái',
      'Ngày duyệt',
      'Ngày tạo',
      'Người tạo',
    ];
    worksheet.addRow(header);

    // Style header
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1A237E' },
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
    filteredRequests.forEach((item, index) => {
      worksheet.addRow([
        index + 1,
        item.maYeuCau,
        item.loaiYeuCau,
        item.tenVatDung,
        item.soLuong ?? 0,
        item.tinhTrangThietBi,
        item.lyDoDeXuat,
        item.moTaChiTiet,
        item.trangThai,
        item.ngayDuyet || '',
        new Date(item.createdAt).toLocaleDateString('vi-VN'),
        item.tenNguoiTao,
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
    saveAs(blob, 'DanhSachYeuCau.xlsx');
    toast.success('Xuất Excel thành công!');
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.tenVatDung?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? req.trangThai === statusFilter : true;
    const matchesField = fieldFilter ? req.loaiYeuCau === fieldFilter : true;

    const reqDate = new Date(req.createdAt);
    const start = dateStart ? new Date(dateStart) : null;
    const end = dateEnd ? new Date(dateEnd) : null;
    const matchesDate = (!start || reqDate >= start) && (!end || reqDate <= end);

    return matchesSearch && matchesStatus && matchesField && matchesDate;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={cx('manage-request')}>
      <div className={cx('header-title')}>
        <h3>
          <FontAwesomeIcon icon={faFileContract} /> Danh sách yêu cầu
        </h3>
        <button className={cx('btn-export')} onClick={handleExportExcel}>
          Xuất Excel
        </button>
      </div>
      {/* Bộ lọc */}
      <Filter
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        requestStatus={requestStatus}
        requestType={requestType}
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

      {/* Bảng */}
      {isLoading ? (
        <div className={cx('spinner-container')} style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
          <ClipLoader color="#11588B" loading={true} size={50} />
        </div>
      ) : (
        <>
          <TableComponent
            paginatedRequests={paginatedRequests}
            HandleViewDetails={HandleViewDetails}
            setShowDelete={setShowDelete}
          />
          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </>
      )}

      <ModalDelete showDelete={showDelete} setShowDelete={setShowDelete} HandleDeleteRow={HandleDeleteRow} />
    </div>
  );
};

export default QLyYeuCau;
