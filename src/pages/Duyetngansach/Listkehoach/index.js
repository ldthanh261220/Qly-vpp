import React, { useState } from 'react'; 
import TabNavigation from './../Tab';
import PlanCard from './../Kehoach';
import './PlanList.scss';

const mockData = [
  {
    id: 'KH001',
    title: 'Mua sắm giấy in, bút lông ',
    type: 'Mua sắm ',
    unit: 'Phòng CTSV ',
    sum: '10.000.000 VND',
    field: 'Hàng hóa',
    address: '48 Cao Thắng, Đà Nẵng',
    status: 'pending',
  },
  {
    id: 'KH003',
    title: 'Sửa chữa máy in ',
    type: 'Sửa chữa ',
    unit: 'Phòng CTSV ',
    sum: '20.000.000 VND',
    field: 'Hàng hóa',
    address: '48 Cao Thắng, Đà Nẵng',
    status: 'pending',
  },
  {
    id: 'KH004',
    title: 'Mua sắm giấy in, bút lông ',
    type: 'Mua sắm ',
    unit: 'Phòng CTSV ',
    sum: '10.000.000 VND',
    field: 'Hàng hóa',
    address: '48 Cao Thắng, Đà Nẵng',
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
          <h1 className="plan-list__title">Danh sách hợp đồng</h1>
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
  <div className="header">
    <h2>Kế hoạch 01</h2>
  </div>


  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Đơn vị tính</th>
          <th>Số lượng</th>
          <th>Giá</th>
          <th>Tổng tiền</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <img src="/printer-icon.png" className="product-icon" />
            Máy in XP3
          </td>
          <td>cái</td>
          <td>20</td>
          <td>500.000 vnd</td>
          <td>10.000.000 vnd</td>
        </tr>
        <tr>
          <td>
            <img src="/printer-icon.png" className="product-icon" />
            Máy in SND1
          </td>
          <td>Cái</td>
          <td>10</td>
          <td>300.000 vnd</td>
          <td>3.000.000 vnd</td>
        </tr>
        <tr>
          <td>
            <img src="/printer-icon.png" className="product-icon" />
            Máy in DKC
          </td>
          <td>cái</td>
          <td>20</td>
          <td>200.000 vnd</td>
          <td>4.000.000 vnd</td>
        </tr>
        <tr>
          <td>
            <img src="/printer-icon.png" className="product-icon" />
            Máy in mực khô
          </td>
          <td>cái</td>
          <td>10</td>
          <td>100.000 vnd</td>
          <td>1.000.000 vnd</td>
        </tr>
      </tbody>
    </table>
    
    <div className="total">
      Tổng tiền: <span>18.000.000 vnd</span>
    </div>
  </div>

  <div className="actions">
    <button onClick={handleRejectAll} className="reject">
      Từ chối
    </button>
    <button onClick={handleApproveAll} className="approve">
      Duyệt
    </button>
  </div>
</div>
      )}
    </div>
  );
};

export default PlanList;
