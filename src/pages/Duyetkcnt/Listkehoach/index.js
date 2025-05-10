import React, { useState } from 'react'; 
import TabNavigation from './../Tab';
import PlanCard from './../Kehoach';
import './PlanList.scss';

const mockData = [
  {
    id: 'KH001',
    title: 'Mua sắm giấy in, bút lông ',
    contractor: 'Công ty TNHH Thiên Long ',
    investor: 'Trường ĐHSPKT Đà Nẵng ',
    time: '14/03 - 25/03/20252025',
    type: 'Mua sắm',
    status: 'pending',
  },
  {
    id: 'KH001',
    title: 'Sửa chữa máy in ',
    contractor: 'Công ty TNHH Thiên Long ',
    investor: 'Trường ĐHSPKT Đà Nẵng',
    time: '14/03 - 25/03/20252025',
    type: 'Sữa chữachữa',
    status: 'pending',
  },
  {
    id: 'KH001',
    title: 'Mua sắm giấy in, bút lông',
    contractor: 'Công ty TNHH Thiên Long ',
    investor: 'Trường ĐHSPKT Đà NẵngNẵng',
    time: '14/03 - 25/03/20252025',
    type: 'Mua sắm',
    status: 'pending',
  }
];

const PlanList = () => {
  const [plans, setPlans] = useState(mockData);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const filteredPlans = plans.filter(plan => {
    if (activeTab === 'all') return true;
    return plan.status === activeTab;
  });

  const counts = {
    all: plans.length,
    pending: plans.filter(plan => plan.status === 'pending').length,
    approved: plans.filter(plan => plan.status === 'approved').length
  };

  const handleApprove = (id) => {
    setPlans(plans.map(plan => plan.id === id ? { ...plan, status: 'approved' } : plan));
  };

  const handleReject = (id) => {
    alert(`Từ chối kế hoạch: ${id}`);
  };

  const handleViewDetails = (id) => {
    const plan = plans.find(p => p.id === id);
    setSelectedPlan(plan);
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
  };

  const handleApproveAll = () => {
    setPlans(plans.map(plan => plan.status === 'pending' ? { ...plan, status: 'approved' } : plan));
  };

  const handleRejectAll = () => {
    alert('Từ chối tất cả kế hoạch chưa duyệt');
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
          <h2 className="text-xl font-bold mb-4">Hồ sơ nhà thầu </h2>

          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin nhà thầu </h3>
            <p><strong>Mã số thuế:</strong> 001</p>
            <p><strong>Tên nhà thầu:</strong> {selectedPlan.contractor }</p>
            <p><strong>Tên người đại diện Phòng:</strong> Đoàn Hưng Thịnh</p>
          </div>

          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin gói thầu</h3>
            <p><strong>Mã thông tin mời thầu :</strong>MT001</p>
            <p><strong>Tên gói thầu:</strong> {selectedPlan.title}</p>
            <p><strong>Hình thức lựa chọn gói thầu:</strong> Đấu thầu mở rộng</p>
            <p><strong>Phương thức lực chọn nhà thầu:</strong> Đấu giá </p>
            <p><strong>Bên mời thầu:</strong> {selectedPlan.investor}</p>
            <p><strong>Chủ đầu tư :</strong> {selectedPlan.investor }</p>
            <p><strong>Số tiền dự kiến:</strong> 10.000.000 VND </p>
          </div>

          <div className="flex items-center mb-4">
            <input type="checkbox" id="confirm" className="mr-2" />
            <label htmlFor="confirm">
              <strong>Tôi đã đọc và đồng ý với các cam kết trên</strong>
              {' '} (Nhà thầu phải tick vào ô này để tiếp tục)
            </label>
          </div>

          {filteredPlans.length > 0 && (
            <div className="plan-list__batch-actions">
              <button 
                onClick={handleApproveAll}
                className="plan-list__button plan-list__button--approve"
              >
                Duyệt 
              </button>
              <button 
                onClick={handleRejectAll}
                className="plan-list__button plan-list__button--reject"
              >
                Từ chối
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanList;
