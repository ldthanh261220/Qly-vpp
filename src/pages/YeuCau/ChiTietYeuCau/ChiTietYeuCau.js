import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import yeuCauService from '~/services/yeucauService';
import styles from './ChiTietYeuCau.module.scss';
import classNames from 'classnames/bind';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faImage } from '@fortawesome/free-solid-svg-icons';
import thongbaoService from '~/services/thongbaoService';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

const ChiTietYeuCau = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [yeuCau, setYeuCau] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const user = useSelector((state) => state.user.currentUser);
  useEffect(() => {
    const fetchYeuCau = async () => {
      try {
        const res = await yeuCauService.getDetailYeuCauService(id);
        console.log(res);
        
        if (res.errCode === 0) {
          setYeuCau(res.chitietyeucau);
        }
        else {
          toast.error('Lỗi khi lay yêu cầu!');
        }
      } catch (err) {
        console.error('Lỗi khi lấy chi tiết yêu cầu:', err);
        toast.error('Lỗi khi lay yêu cầu!');
      } finally {
        setLoading(false);
      }
    };
    fetchYeuCau();
  }, [id]);

  const handleApprove = async () => {
    try {
      const ngayDuyet = new Date().toISOString().split('T')[0];
      const res = await yeuCauService.duyetYeuCauService(id, ngayDuyet);

      if (res.errCode === 0) {
        // Tạo mã thông báo mới
        const randomId = `TB${Math.floor(Math.random() * 1000000).toString().padStart(8, '0')}`;
        const thongBao = {
          maThongBao: randomId,
          maTaiKhoan: user?.id || null,  
          ngayThongBao: ngayDuyet,
          noiDungThongBao: `Yêu cầu ${id} đã được phê duyệt.`,
          trangThai: 'Chưa đọc',
          maTaiKhoanNhan: yeuCau?.maTaiKhoan || null,
        };

        await thongbaoService.createThongBao(thongBao);

        toast.success('Phê duyệt yêu cầu thành công!');
        setYeuCau(prev => ({ ...prev, trangThai: 'Đã phê duyệt' }));
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi phê duyệt yêu cầu!');
    }
  };


  const handleReject = async () => {
    const ngayDuyet = new Date().toISOString().split('T')[0];

    if (!rejectReason.trim()) {
      toast.warn('Vui lòng nhập lý do từ chối!');
      return;
    }

    try {
      const res = await yeuCauService.tuChoiYeuCauService(id, ngayDuyet, rejectReason);

      if (res.errCode === 0) {
        // Tạo mã thông báo
        const maThongBao = `TB${Math.floor(Math.random() * 1000000).toString().padStart(8, '0')}`;

        // Gửi thông báo cho người gửi yêu cầu
        const thongBao = {
          maThongBao,
          maTaiKhoan: user?.id || null,            // Người thực hiện từ chối
          maTaiKhoanNhan: yeuCau?.maTaiKhoan || null,      // Người gửi yêu cầu
          ngayThongBao: ngayDuyet,
          noiDungThongBao: `Yêu cầu ${id} đã bị từ chối. Lý do: ${rejectReason}`,
          trangThai: 'Chưa đọc'
        };

        await thongbaoService.createThongBao(thongBao);

        toast.success('Đã từ chối yêu cầu!');
        setYeuCau(prev => ({
          ...prev,
          trangThai: 'Đã từ chối',
          lyDoTuChoi: rejectReason,
        }));
        setShowRejectModal(false);
        setRejectReason('');
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi từ chối yêu cầu!');
    }
  };


  if (loading) {
    return (
      <div className={cx('loading')}>
        <ClipLoader color="#007bff" size={50} />
      </div>
    );
  }

  if (!yeuCau) {
    return <div className={cx('error')}>Không tìm thấy yêu cầu</div>;
  }

  return (
    <div className={cx('wrapper')}>
      <h3>Chi tiết yêu cầu</h3>

      <div className={cx('info')}>
        <p><strong>Mã yêu cầu:</strong> {yeuCau.maYeuCau}</p>
        <p><strong>Loại yêu cầu:</strong> {yeuCau.loaiYeuCau}</p>
        <p><strong>Người tạo:</strong> {yeuCau.tenNguoiTao}</p>
        <p>
          <strong>Trạng thái:</strong>{' '}
          <span style={{
            color:
              yeuCau.trangThai === 'Đã phê duyệt' ? 'green' :
              yeuCau.trangThai === 'Đã từ chối' ? 'red' :
              yeuCau.trangThai === 'Đang chờ duyệt' ? '#ff9800' :
              '#007bff',
            fontWeight: 'bold'
          }}>
            {yeuCau.trangThai}
          </span>
        </p>
        <p><strong>Tên vật dụng:</strong> {yeuCau.tenVatDung}</p>
        <p><strong>Số lượng:</strong> {yeuCau.soLuong || 0}</p>
        <p><strong>Tình trạng thiết bị:</strong> {yeuCau.tinhTrangThietBi}</p>
        <p><strong>Lý do đề xuất:</strong> {yeuCau.lyDoDeXuat}</p>
        <p><strong>Mô tả chi tiết:</strong> {yeuCau.moTaChiTiet}</p>
        {yeuCau.lyDoTuChoi && (
          <p><strong>Lý do từ chối:</strong> {yeuCau.lyDoTuChoi}</p>
        )}
        {yeuCau.hinhAnhSuaChua ? (
          <div>
            <strong>Hình ảnh sửa chữa: </strong>
            <img src={yeuCau.hinhAnhSuaChua} title={yeuCau.tenVatDung} alt="Ảnh sửa chữa" style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }} />
          </div>
        ) : <div>
            <strong>Hình ảnh sửa chữa: </strong><FontAwesomeIcon style={{fontSize: '100px'}} icon={faImage} title='Chua co hinh anh cua vat pham'/></div>}
      </div>

      {yeuCau.trangThai === 'Đang chờ duyệt' ? (
        <div className={cx('actions')}>
          <button className={cx('btn', 'btn-back')} onClick={() => navigate(-1)}>← Quay lại</button>
          <div>
            <button className={cx('btn', 'btn-approve')} onClick={handleApprove}><FontAwesomeIcon icon={faThumbsUp}/> Phê duyệt</button>
            <button className={cx('btn', 'btn-reject')} onClick={() => setShowRejectModal(true)}><FontAwesomeIcon icon={faThumbsDown}/> Từ chối</button>
          </div>
        </div>
      ):<button className={cx('btn', 'btn-back')} onClick={() => navigate(-1)}>← Quay lại</button>}

      {showRejectModal && (
        <div className={cx('modal')}>
          <div className={cx('modal-content')}>
            <h4>Lý do từ chối</h4>
            <textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className={cx('modal-actions')}>
              <button onClick={handleReject} className={cx('btn', 'btn-confirm')}>Xác nhận</button>
              <button onClick={() => setShowRejectModal(false)} className={cx('btn', 'btn-cancel')}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default ChiTietYeuCau;
