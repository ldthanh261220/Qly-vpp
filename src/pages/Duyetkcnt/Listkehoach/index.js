import React, { useState, useEffect } from 'react';
import TabNavigation from './../Tab';
import PlanCard from './../Kehoach';
import './PlanList.scss';

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch data from backend API
  useEffect(() => {
    setLoading(true);
    fetch('/api/kehoachchonnhathau')
      .then(res => res.json())
      .then(data => setPlans(data.danhsachkehoach || []))
      .finally(() => setLoading(false));
  }, []);

  const filteredPlans = plans.filter(plan => {
    if (activeTab === 'all') return true;
    return plan.status === activeTab;
  });

  const counts = {
    all: plans.length,
    pending: plans.filter(plan => plan.status === 'pending').length,
    approved: plans.filter(plan => plan.status === 'approved').length
  };

  // Duyệt một kế hoạch
  const handleApprove = async (id) => {
    await fetch(`/api/kehoachchonnhathau/${id}/approve`, { method: 'POST' });
    setPlans(plans.map(plan => plan.id === id ? { ...plan, status: 'approved' } : plan));
  };

  // Từ chối một kế hoạch
  const handleReject = async (id) => {
    await fetch(`/api/kehoachchonnhathau/${id}/reject`, { method: 'POST' });
    setPlans(plans.map(plan => plan.id === id ? { ...plan, status: 'pending' } : plan));
  };

  // Xem chi tiết
  const handleViewDetails = async (id) => {
    setLoading(true);
    const res = await fetch(`/api/kehoachchonnhathau/${id}`);
    const data = await res.json();
    setSelectedPlan(data.kehoach);
    setLoading(false);
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
  };

  // Duyệt tất cả
  const handleApproveAll = async () => {
    await fetch('/api/kehoachchonnhathau/approve-all', { method: 'POST' });
    setPlans(plans.map(plan => plan.status === 'pending' ? { ...plan, status: 'approved' } : plan));
  };

  // Từ chối tất cả
  const handleRejectAll = async () => {
    await fetch('/api/kehoachchonnhathau/reject-all', { method: 'POST' });
    setPlans(plans.map(plan => plan.status === 'pending' ? { ...plan, status: 'pending' } : plan));
  };

  return (
    <div className="plan-list">
      {loading && <div>Loading...</div>}
      {!loading && !selectedPlan ? (
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
      ) : !loading && selectedPlan ? (
        <div className="plan-list__detail">
          <button onClick={handleBackToList} className="plan-list__button plan-list__button--back">
            Quay lại danh sách
          </button>
          <h2 className="text-xl font-bold mb-4">Hồ sơ nhà thầu </h2>
          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin nhà thầu </h3>
            <p><strong>Mã số thuế:</strong> {selectedPlan?.maSoThue || '---'}</p>
            <p><strong>Tên nhà thầu:</strong> {selectedPlan?.contractor}</p>
            <p><strong>Tên người đại diện Phòng:</strong> {selectedPlan?.hoTenNguoiDaiDien || '---'}</p>
          </div>
          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin gói thầu</h3>
            <p><strong>Tên kế hoạch:</strong> {selectedPlan?.title}</p>
            <p><strong>Bên mời thầu:</strong> {selectedPlan?.investor}</p>
            <p><strong>Chủ đầu tư :</strong> {selectedPlan?.investor}</p>
            <p><strong>Thời gian:</strong> {selectedPlan?.time}</p>
          </div>
          <div className="flex items-center mb-4">
            <input type="checkbox" id="confirm" className="mr-2" />
            <label htmlFor="confirm">
              <strong>Tôi đã đọc và đồng ý với các cam kết trên</strong>
              {' '} (Nhà thầu phải tick vào ô này để tiếp tục)
            </label>
          </div>
          <div className="plan-list__batch-actions">
            <button
              onClick={() => handleApprove(selectedPlan.id)}
              className="plan-list__button plan-list__button--approve"
            >
              Duyệt
            </button>
            <button
              onClick={() => handleReject(selectedPlan.id)}
              className="plan-list__button plan-list__button--reject"
            >
              Từ chối
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PlanList;