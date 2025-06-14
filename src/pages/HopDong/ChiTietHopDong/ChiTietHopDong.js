import React, { useState, useEffect, useRef } from 'react';
import styles from './ChiTietHopDong.module.scss';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners';

import contractService from '~/services/hopdongService';
import { toast } from 'react-toastify';
import hopdongService from '~/services/hopdongService';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import nhathauService from '~/services/nhathauService';

const cx = classNames.bind(styles);

const ChiTietHopDong = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updatedMoTa, setUpdatedMoTa] = useState('');
  const [updatedTrangThai, setUpdatedTrangThai] = useState('');
  const [nhaThau, setNhaThau] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await contractService.getDetailHopDongService(id);
        if (res.errCode === 0) {
          setContract(res.chitiethopdong);
          setUpdatedMoTa(res.chitiethopdong.moTa);
          setUpdatedTrangThai(res.chitiethopdong.trangThai);

          const nhaThauId = res.chitiethopdong.maNhaThau;
          const nhaThauRes = await nhathauService.getDetailNhaThauService(nhaThauId);
          if (nhaThauRes.errCode === 0) {
            setNhaThau(nhaThauRes.chitietnhathau);
          }
        }
      } catch (error) {
        toast.error('Lỗi khi tải chi tiết hợp đồng!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await hopdongService.updateHopDongService({
        maHopDong: contract.maHopDong,
        moTa: updatedMoTa,
        trangThai: updatedTrangThai,
      });

      setContract((prev) => ({
        ...prev,
        moTa: updatedMoTa,
        trangThai: updatedTrangThai,
      }));

      toast.success('Cập nhật thành công!');
      setShowModal(false);
    } catch (err) {
      toast.error('Cập nhật thất bại!');
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN');
    let y = 20;

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', 105, y, null, null, 'center'); y += 7;
    doc.text('Độc lập - Tự do - Hạnh phúc', 105, y, null, null, 'center'); y += 7;
    doc.line(75, y, 135, y); y += 10;

    doc.setFontSize(13);
    doc.text('HỢP ĐỒNG MUA BÁN HÀNG HÓA', 105, y, null, null, 'center'); y += 7;
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(`Số: ${contract.maHopDong}`, 105, y, null, null, 'center'); y += 10;

    doc.text('* Căn cứ Bộ luật Dân sự 2015;', 15, y); y += 6;
    doc.text('* Căn cứ Luật Thương mại 2005;', 15, y); y += 6;
    doc.text('* Căn cứ vào nhu cầu và khả năng của hai bên;', 15, y); y += 10;

    doc.text(`Hôm nay, ngày ${formatDate(contract.ngayKy)}, tại địa chỉ: ...............`, 15, y); y += 10;
    doc.text('Chúng tôi gồm có:', 15, y); y += 8;

    doc.setFont(undefined, 'bold');
    doc.text('BÊN BÁN (Bên A):', 15, y); y += 6;
    doc.setFont(undefined, 'normal');
    doc.text('Tên doanh nghiệp: Trường Đại học XYZ', 15, y); y += 6;
    doc.text('Mã số doanh nghiệp: 1234567890', 15, y); y += 6;
    doc.text('Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM', 15, y); y += 6;
    doc.text('Người đại diện: Nguyễn Văn A', 15, y); y += 6;
    doc.text('Chức vụ: Trưởng phòng vật tư', 15, y); y += 8;

    doc.setFont(undefined, 'bold');
    doc.text('BÊN MUA (Bên B):', 15, y); y += 6;
    doc.setFont(undefined, 'normal');
    doc.text(`Tên doanh nghiệp: ${nhaThau?.tenNhaThau || '...........'}`, 15, y); y += 6;
    doc.text(`Mã số doanh nghiệp: ${nhaThau?.maSoThue || '...........'}`, 15, y); y += 6;
    doc.text(`Địa chỉ: ${nhaThau?.diaChi || '...........'}`, 15, y); y += 6;
    doc.text(`Người đại diện: ${nhaThau?.hoTenNguoiDaiDien || '...........'}`, 15, y); y += 6;
    doc.text(`Chức vụ: ${nhaThau?.chucVuNguoiDaiDien || '...........'}`, 15, y); y += 10;

    doc.setFont(undefined, 'bold');
    doc.text('ĐIỀU 1: NỘI DUNG HỢP ĐỒNG', 15, y); y += 6;
    doc.setFont(undefined, 'normal');
    const noiDung = doc.splitTextToSize(contract.noiDungHopDong || 'Cam kết giao hàng đúng hạn.', 180);
    doc.text(noiDung, 15, y); y += noiDung.length * 6 + 4;
    doc.text(`Thời gian thực hiện: ${formatDate(contract.thoiGianThucHien)} đến ${formatDate(contract.thoiGianHoanThanh)}`, 15, y); y += 6;
    doc.text(`Hình thức thanh toán: ${contract.hinhThucThanhToan}`, 15, y); y += 6;
    doc.text(`Trạng thái hiện tại: ${contract.trangThai}`, 15, y); y += 10;

    if (contract.moTa) {
      doc.setFont(undefined, 'bold');
      doc.text('Ghi chú:', 15, y); y += 6;
      doc.setFont(undefined, 'normal');
      const moTa = doc.splitTextToSize(contract.moTa, 180);
      doc.text(moTa, 15, y); y += moTa.length * 6;
    }

    doc.save(`HopDong_${contract.maHopDong}.pdf`);
  };

  if (loading) {
    return (
      <div className={cx('loading')}>
        <ClipLoader size={50} color="#007bff" loading={true} />
      </div>
    );
  }

  if (!contract) return <div className={cx('wrapper')}>Không tìm thấy hợp đồng</div>;

  const statusStyleMap = {
    "Đang soạn thảo": { backgroundColor: "#f0f0f0", color: "#555" },
    "Chờ ký": { backgroundColor: "#d0e8ff", color: "#0056b3" },
    "Đã ký": { backgroundColor: "#d4edda", color: "#155724" },
    "Đang thực hiện": { backgroundColor: "#d1ecf1", color: "#0c5460" },
    "Sắp hết hạn": { backgroundColor: "#fff3cd", color: "#856404" },
    "Hoàn thành": { backgroundColor: "#c3e6cb", color: "#155724" },
    "Đã thanh lý": { backgroundColor: "#e2e3f3", color: "#383d7c" },
    "Hết hạn": { backgroundColor: "#f8d7da", color: "#721c24" },
    "Bị hủy": { backgroundColor: "#d6d8db", color: "#1b1e21" },
  };

  const statusStyle = {
    padding: "6px 12px",
    borderRadius: "8px",
    display: "inline-block",
    fontWeight: "500",
    ...statusStyleMap[contract.trangThai]
  };

  return (
    <div className={cx('wrapper')}>
      <div ref={printRef}>
        <h3>Chi tiết hợp đồng: {contract.tenHopDong}</h3>
        <div className={cx('info')}>
          <p><strong>Mã:</strong> {contract.maHopDong}</p>
          <p><strong>Tên nhà thầu:</strong> {contract.tenNhaThau}</p>
          <p><strong>Ngày ký:</strong> {new Date(contract.ngayKy).toLocaleDateString('vi-VN')}</p>
          <p><strong>Ngày thực hiện:</strong> {new Date(contract.thoiGianThucHien).toLocaleDateString('vi-VN')}</p>
          <p><strong>Ngày hoàn thành:</strong> {new Date(contract.thoiGianHoanThanh).toLocaleDateString('vi-VN')}</p>
          <p><strong>Hình thức thanh toán:</strong> {contract.hinhThucThanhToan}</p>
          <p><strong>Nội dung hợp đồng:</strong> {contract.noiDungHopDong}</p>
          <p style={statusStyle}>
            <strong>Trạng thái:</strong> {contract.trangThai}
          </p>
          <p><strong>Mô tả:</strong> {contract.moTa}</p>
        </div>
      </div>

      <div className={cx('div-icons')}>
        <button className={cx('btn-back')} onClick={() => navigate(-1)}>← Quay lại danh sách</button>
        <button className={cx('btn-up')} onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPenToSquare} /> Cập nhật
        </button>
        <button className={cx('btn-export')} onClick={handleExportPDF}>
          📄 Xuất PDF
        </button>
      </div>

      {showModal && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Cập nhật thông tin</h4>
            <label>Mô tả</label>
            <textarea value={updatedMoTa} onChange={(e) => setUpdatedMoTa(e.target.value)} />
            <label>Trạng thái</label>
            <select value={updatedTrangThai} onChange={(e) => setUpdatedTrangThai(e.target.value)}>
              <option value="Đã ký">Đã ký</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Sắp hết hạn">Sắp hết hạn</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Đã thanh lý">Đã thanh lý</option>
              <option value="Hết hạn">Hết hạn</option>
              <option value="Bị hủy">Bị hủy</option>
            </select>
            <div className={cx('modal-actions')}>
              <button onClick={handleUpdate} className={cx('btn-save')}>Lưu</button>
              <button onClick={() => setShowModal(false)} className={cx('btn-can')}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChiTietHopDong;
