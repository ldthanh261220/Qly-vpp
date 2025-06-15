import React, { useEffect, useState } from 'react';
import TabNavigation from './../Tab';
import PlanCard from './../Kehoach';
import './PlanList.scss';
import thanhtoanhopdongService from '~/services/thanhtoanhopdongService';
import moment from 'moment';

// Hàm format tiền
const formatMoney = (amount) => {
  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount) + ' VNĐ';
};

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lấy danh sách hợp đồng từ service
    thanhtoanhopdongService
      .getChonHopDongService()
      .then((response) => {
        const mappedPlans = response.danhsachhopdong.map((contractor) => ({
          id: contractor.maHopDong,
          title: contractor.tenHopDong,
          contractor: 'Đoàn Hưng Thịnh',
          investor: 'Trường ĐHSPKT Đà Nẵng ',
          time: `${moment(contractor.thoiGianThucHien).format('DD/MM/YYYY')} - ${moment(contractor.thoiGianHoanThanh).format('DD/MM/YYYY')}`,
          type: 'Mua sắm',
          status: contractor.trangThai || 'pending', // Load trạng thái từ API
        }));
        setPlans(mappedPlans);
      })
      .catch((error) => console.error('❌ Lỗi tải danh sách nhà thầu:', error));
  }, []);

  const filteredPlans = plans.filter((plan) => {
    if (activeTab === 'all') return true;
    return plan.status === activeTab;
  });

  const counts = {
    all: plans.length,
    pending: plans.filter((plan) => plan.status === 'pending').length,
    approved: plans.filter((plan) => plan.status === 'approved').length,
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
  };

  const updatePlanStatus = async (id, status) => {
    try {
      await thanhtoanhopdongService.updateTrangThaiHopDongService(id, status);
      console.log(`✅ Cập nhật trạng thái thành công: ${status}`);
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const handleApprove = async (id) => {
    await updatePlanStatus(id, 'approved');
    setPlans(plans.map((plan) => 
      plan.id === id ? { ...plan, status: 'approved' } : plan
    ));
    if (selectedPlan && selectedPlan.id === id) {
      setSelectedPlan(prev => ({
        ...prev,
        status: 'approved'
      }));
      setActiveTab('approved');
      handleBackToList();
    }
  };

  const handleReject = async (id) => {
    await updatePlanStatus(id, 'pending');
    setPlans(plans.map((plan) => 
      plan.id === id ? { ...plan, status: 'pending' } : plan
    ));
    if (selectedPlan && selectedPlan.id === id) {
      setSelectedPlan(prev => ({
        ...prev,
        status: 'pending'
      }));
      setActiveTab('pending');
      handleBackToList();
    }
  };

  const handleApproveDetail = async () => {
    if (selectedPlan) {
      await handleApprove(selectedPlan.id);
    }
  };

  const handleRejectDetail = async () => {
    if (selectedPlan) {
      await handleReject(selectedPlan.id);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      setLoading(true);
      const plan = plans.find((p) => p.id === id);
      const response = await thanhtoanhopdongService.getInforHopDongService(id);
      if (response && response.thongTinHopDong) {
        const thongTinChiTiet = response.thongTinHopDong.find(hd => hd.maHopDong === id);
        setSelectedPlan({
          ...plan,
          contractorCode: thongTinChiTiet.maNhaThau,
          contractorName: thongTinChiTiet.tenNhaThau,
          legalRepresentative: thongTinChiTiet.hoTenNguoiDaiDien,
          investorCode: thongTinChiTiet.maChuDauTu,
          investorName: 'Trường ĐHSPKT',
          tenderNoticeCode: thongTinChiTiet.maHopDong,
          packageName: thongTinChiTiet.tenHopDong,
          purchaseItems: thongTinChiTiet.moTa,
          paymentAmount: formatMoney(thongTinChiTiet.giaTrungThau),
          paymentTime: `${moment(thongTinChiTiet.ngayKetthuc).format('DD/MM/YYYY')}`,
          paymentMethod: thongTinChiTiet.hinhThucThanhToan,
        });
      } else {
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error('❌ Lỗi khi lấy thiết bị:', error);
      setSelectedPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveAll = async () => {
    const pendingPlans = plans.filter((plan) => plan.status === 'pending');
    for (const plan of pendingPlans) {
      await updatePlanStatus(plan.id, 'approved');
    }
    setPlans(plans.map((plan) => (plan.status === 'pending' ? { ...plan, status: 'approved' } : plan)));
    setActiveTab('approved');
  };

  const handleRejectAll = async () => {
    const pendingPlans = plans.filter((plan) => plan.status === 'pending');
    for (const plan of pendingPlans) {
      await updatePlanStatus(plan.id, 'pending');
    }
    setPlans(plans.map((plan) => (plan.status === 'pending' ? { ...plan, status: 'pending' } : plan)));
    setActiveTab('pending');
  };

  return (
    <div className="plan-list">
      {!selectedPlan ? (
        <>
          <h1 className="plan-list__title">Danh sách hợp đồng</h1>
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />
          <div className="plan-list__cards">
            {filteredPlans.map((plan, index) => (
              <PlanCard
                key={`${plan.id}-${index}`}
                plan={plan}
                onApprove={() => handleApprove(plan.id)}
                onReject={() => handleReject(plan.id)}
                onViewDetails={() => handleViewDetails(plan.id)}
              />
            ))}
          </div>
          {filteredPlans.length > 0 && (
            <div className="plan-list__batch-actions">
            </div>
          )}
        </>
      ) : (
        <div className="plan-list__detail">
          <h2 className="text-xl font-bold mb-4">{selectedPlan.title}</h2>
          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin nhà thầu</h3>
            <p><strong>Mã nhà thầu:</strong> {selectedPlan.contractorCode}</p>
            <p><strong>Tên nhà thầu:</strong> {selectedPlan.contractorName}</p>
            <p><strong>Tên người đại diện pháp luật:</strong> {selectedPlan.legalRepresentative}</p>
          </div>
          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin chủ đầu tư</h3>
            <p><strong>Mã chủ đầu tư:</strong> {selectedPlan.investorCode}</p>
            <p><strong>Tên nhà đầu tư:</strong> {selectedPlan.investorName}</p>
          </div>
          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin hợp đồng</h3>
            <p><strong>Mã hợp đồng:</strong> {selectedPlan.tenderNoticeCode}</p>
            <p><strong>Tên hợp đồng:</strong> {selectedPlan.packageName}</p>
            <p><strong>Danh mục mua sắm:</strong> {selectedPlan.purchaseItems}</p>
            <p><strong>Số tiền cần thanh toán:</strong> {selectedPlan.paymentAmount}</p>
            <p><strong>Thời gian thanh toán:</strong> {selectedPlan.paymentTime}</p>
            <p><strong>Hình thức:</strong> {selectedPlan.paymentMethod}</p>
          </div>
          <div className="flex items-center mb-4">
            <input type="checkbox" id="confirm" className="mr-2" />
            <label htmlFor="confirm">
              <strong>Tôi đã đọc và đồng ý với các cam kết trên</strong> (Nhà thầu phải tick vào ô này để tiếp tục)
            </label>
          </div>
          <div className="plan-list__batch-actions">
            <button
              onClick={handleApproveDetail}
              className="plan-list__button plan-list__button--approve"
            >
              Xác nhận thanh toán 
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanList;