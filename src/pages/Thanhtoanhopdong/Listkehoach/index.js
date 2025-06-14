import React, {useEffect, useState } from 'react'; 
import TabNavigation from './../Tab';
import PlanCard from './../Kehoach';
import './PlanList.scss';
import thanhtoanhopdongService from '~/services/thanhtoanhopdongService';
import moment from 'moment';
const formatMoney = (amount) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    return formatter.format(amount) + ' VNĐ';
};

const PlanList = () => {
   const [plans, setPlans] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState(null);
useEffect(() => {
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
                    status: 'pending',
                }));
                setPlans(mappedPlans);
            })
            .catch((error) => console.error('❌ Lỗi tải danh sách nhà thầu:', error));
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
          <h2 className="text-xl font-bold mb-4">{selectedPlan.title} </h2>

          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin nhà thầu </h3>
            <p><strong>Mã nhà thầu:</strong> 001</p>
            <p><strong>Tên nhà thầu:</strong> {selectedPlan.contractor }</p>
            <p><strong>Tên người đại diện pháp luật:</strong> Đoàn Hưng Thịnh</p>
          </div>

          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin chủ đầu tư</h3>
            <p><strong>Mã chủ đầu tư :</strong>CDT001</p>
            <p><strong>Tên nhà đầu tư:</strong>Lê Đại Thành</p>
          </div>
          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Thông tin hợp đồng</h3>
            <p><strong>Mã thông báo mời thâù :</strong>CDT001</p>
            <p><strong>Tên gói thầu:</strong>{selectedPlan.title}</p>
            <p><strong>Danh mục mua sắm :</strong>100 tập giấy in 
                                                  50 bút lông 
                                                  200 bìa hồ sơ</p>
            <p><strong>Tên tiền cần thanh toán:</strong>15.000.000 VND</p>
            <p><strong>Thời gian thanh toán :</strong>25/12/20252025</p>
            <p><strong>Hình thức :</strong>Chuyển khoản</p>
          </div>
          <div className="section bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold">Điều khoản chính</h3>
            <ul className="plan-card__terms">
                  <li>1.Thanh toán: Chuyển khoản 50% khi ký hợp đồng, 50% sau nghiệm thu.</li>
                  <li>2.Giao hàng: Trong 07 ngày, tại Trường ĐH Sư phạm Kỹ thuật.</li>
                  <li>3.Bảo hành: 06 tháng, sửa chữa/thay thế miễn phí nếu lỗi kỹ thuật.</li>
                  <li>4.Phạt chậm giao hàng: 1% giá trị hợp đồng/ngày nếu quá hạn 07 ngày.</li>
                  <li>5.Giải quyết tranh chấp: Thương lượng, nếu không thành sẽ đưa ra tòa án.</li>
            </ul>
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
