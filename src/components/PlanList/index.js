import React, { useEffect, useState } from 'react';
import TabNavigation from './../TabNavigation';
import PlanCard from './../PlanCard';
import './PlanList.scss';
import chonmuasamService from '~/services/chonmuasamService';
import moment from 'moment';

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const formatMoney = (amount) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    return formatter.format(amount) + ' VNĐ';
  };

  useEffect(() => {
    chonmuasamService
      .getChonMuaSamService()
      .then((response) => {
        const mappedPlans = response.danhsachkehoach.map((contractor) => ({
          id: contractor.maKeHoach,
          title: contractor.tenKeHoach,
          type: contractor.loaiyeucau,
          department: contractor.donViCongTac,
          budget: formatMoney(contractor.chiPhiKeHoach),
          user : contractor.hoTen,
          category: 'hàng hóa',
          location: 'số 48 Cao Thắng, TP. Đà Nẵng',
          status: 'pending',
          time: `${moment(contractor.thoiGianBatDau).format('DD/MM/YYYY')} - ${moment(contractor.thoiGianKetThuc).format('DD/MM/YYYY')}`
        }));
        setPlans(mappedPlans);
      })
      .catch((error) => console.error('❌ Lỗi tải danh sách kế hoạch:', error));
  }, []);

  // Chỉ cập nhật state local khi duyệt
  const handleApprove = (id) => {
    setPlans(plans.map(plan => 
      plan.id === id ? { ...plan, status: 'approved' } : plan
    ));
  };

  // Chỉ cập nhật state local khi từ chối
  const handleReject = (id) => {
    setPlans(plans.map(plan => 
      plan.id === id ? { ...plan, status: 'pending' } : plan
    ));
  };

  const handleViewDetails = (id) => {
    const plan = plans.find(p => p.id === id);
    setSelectedPlan(plan);
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
    setIsConfirmed(false);
  };

  // Duyệt tất cả
  const handleApproveAll = () => {
    setPlans(plans.map(plan => 
      plan.status === 'pending' ? { ...plan, status: 'approved' } : plan
    ));
  };

  // Từ chối tất cả
  const handleRejectAll = () => {
    setPlans(plans.map(plan => 
      plan.status === 'pending' ? { ...plan, status: 'pending' } : plan
    ));
  };

  const handleDetailApprove = () => {
    if (!isConfirmed) {
      alert('Vui lòng xác nhận trước khi duyệt!');
      return;
    }
    handleApprove(selectedPlan.id);
    handleBackToList();
  };

  const handleDetailReject = () => {
    if (!isConfirmed) {
      alert('Vui lòng xác nhận trước khi từ chối!');
      return;
    }
    handleReject(selectedPlan.id);
    handleBackToList();
  };

  const filteredPlans = plans.filter(plan => {
    if (activeTab === 'all') return true;
    return plan.status === activeTab;
  });

  const counts = {
    all: plans.length,
    pending: plans.filter(plan => plan.status === 'pending').length,
    approved: plans.filter(plan => plan.status === 'approved').length
  };

  return (
    <div className="plan-list">
      {!selectedPlan ? (
        <>
          <h1 className="plan-list__title">Danh sách kế hoạch</h1>
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />

          <div className="plan-list__cards">
            {filteredPlans.map((plan, index) => (
              <PlanCard 
                key={`${plan.id}-${index}`}
                plan={plan}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewDetails={() => handleViewDetails(plan.id)}
              />
            ))}
          </div>

          {filteredPlans.length > 0 && (
            <div className="plan-list__batch-actions">
              <button 
                onClick={handleApproveAll}
                className="plan-list__button plan-list__button--approve"
              >
                Duyệt tất cả
              </button>
              <button 
                onClick={handleRejectAll}
                className="plan-list__button plan-list__button--reject"
              >
                Từ chối
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="plan-list__detail">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Chi tiết kế hoạch mua sắm</h2>
            <button
              onClick={handleBackToList}
              className="plan-list__button"
            >
              Quay lại
            </button>
          </div>

          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin đề xuất</h3>
            <p><strong>Mã số phòng:</strong> 001</p>
            <p><strong>Tên phòng:</strong> {selectedPlan.department}</p>
            <p><strong>Tên người đại diện Phòng:</strong>{selectedPlan.user}</p>
          </div>

          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin kế hoạch</h3>
            <p><strong>Mã kế hoạch:</strong> {selectedPlan.id}</p>
            <p><strong>Tên kế hoạch:</strong> {selectedPlan.title}</p>
            <p><strong>Loại:</strong> {selectedPlan.type}</p>
            <p><strong>Thời gian:</strong> {selectedPlan.time}</p>
            <p><strong>Địa điểm:</strong> {selectedPlan.location}</p>
            <p><strong>Lĩnh vực:</strong> {selectedPlan.category}</p>
            <p><strong>Số tiền dự kiến:</strong> {selectedPlan.budget}</p>
          </div>

          <div className="flex items-center mb-4">
            <input 
              type="checkbox" 
              id="confirm" 
              className="mr-2"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
            />
            <label htmlFor="confirm">
              <strong>Tôi đã đọc và đồng ý với các cam kết trên</strong>
              {' '} (Bắt buộc tick vào ô này để tiếp tục)
            </label>
          </div>

          <div className="plan-list__batch-actions">
            <button 
              onClick={handleDetailApprove}
              className="plan-list__button plan-list__button--approve"
              disabled={!isConfirmed}
            >
              Duyệt
            </button>
            <button 
              onClick={handleDetailReject}
              className="plan-list__button plan-list__button--reject"
              disabled={!isConfirmed}
            >
              Từ chối
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanList;