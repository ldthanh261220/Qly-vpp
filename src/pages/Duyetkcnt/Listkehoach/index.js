import React, { useEffect, useState } from 'react';
import TabNavigation from './../Tab';
import PlanCard from './../Kehoach';
import './PlanList.scss';
import chonnhathauService from '~/services/chonnhathauService';

const PlanList = () => {
    const [plans, setPlans] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isChecked, setIsChecked] = useState(false); // Thêm state cho checkbox

    useEffect(() => {
        chonnhathauService
            .getTatCaNhaThauService()
            .then((response) => {
                const mappedPlans = response.danhsachnhathau.map((contractor) => ({
                    id: contractor.maNhaThau,
                    title: contractor.tenNhaThau,
                    contractor: contractor.tenNhaThau,
                    investor: contractor.diaChi,
                    time: 'Chưa xác định',
                    type: contractor.tenLinhVuc,
                    status: 'pending',
                    userinterface: contractor.hoTenNguoiDaiDien,
                    code: contractor.maNhaThau
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

    const handleApprove = (id) => {
    setPlans(plans.map((plan) => (plan.id === id ? { ...plan, status: 'approved' } : plan)));
    setSelectedPlan(null); // Quay về trang danh sách
    setIsChecked(false);   // Reset checkbox
};

    const handleReject = (id) => {
        setPlans(plans.map((plan) => (plan.id === id ? { ...plan, status: 'pending' } : plan)));
        setSelectedPlan(null);
        setIsChecked(false);
    };

    const handleViewDetails = (id) => {
        const plan = plans.find((p) => p.id === id);
        setSelectedPlan(plan);
        setIsChecked(false);
    };

    const handleBackToList = () => {
        setSelectedPlan(null);
        setIsChecked(false);
    };

    return (
        <div className="plan-list">
            {!selectedPlan ? (
                <>
                    <h1 className="plan-list__title">Danh sách các nhà thầu</h1>
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
                </>
            ) : (
                <div className="plan-list__detail">
                    <h2 className="text-xl font-bold mb-4">Hồ sơ nhà thầu </h2>
                    <div className="section bg-gray-100 p-4 rounded mb-4">
                        <h3 className="font-semibold">Thông tin nhà thầu </h3>
                        <p>
                            <strong>Mã số thuế:</strong> {selectedPlan.code}
                        </p>
                        <p>
                            <strong>Tên nhà thầu:</strong> {selectedPlan.contractor}
                        </p>
                        <p>
                            <strong>Tên người đại diện Phòng:</strong> {selectedPlan.userinterface}
                        </p>
                    </div>
                    <div className="section bg-gray-100 p-4 rounded mb-4">
                        <h3 className="font-semibold">Thông tin gói thầu</h3>
                        <p>
                            <strong>Mã thông tin mời thầu :</strong>{selectedPlan.code}
                        </p>
                        <p>
                            <strong>Tên gói thầu:</strong> {selectedPlan.title}
                        </p>
                        <p>
                            <strong>Hình thức lựa chọn gói thầu:</strong> Đấu thầu mở rộng
                        </p>
                        <p>
                            <strong>Phương thức lực chọn nhà thầu:</strong> Đấu giá{' '}
                        </p>
                        <p>
                            <strong>Bên mời thầu:</strong> Trường ĐHSPKT
                        </p>
                        <p>
                            <strong>Chủ đầu tư :</strong> Trường ĐHSPKT
                        </p>
                        <p>
                            <strong>Số tiền dự kiến:</strong> 10.000.000 VND{' '}
                        </p>
                    </div>

                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="confirm"
                            className="mr-2"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                        />
                        <label htmlFor="confirm">
                            <strong>Tôi đã đọc và đồng ý với các cam kết trên</strong> (Nhà thầu phải tick vào ô này để
                            tiếp tục)
                        </label>
                    </div>

                    <div className="plan-list__batch-actions">
                        <button
                            onClick={() => handleApprove(selectedPlan.id)}
                            className="plan-list__button plan-list__button--approve"
                            disabled={!isChecked}
                        >
                            Duyệt
                        </button>
                        <button
                            onClick={() => handleReject(selectedPlan.id)}
                            className="plan-list__button plan-list__button--reject"
                        >
                            Từ chối
                        </button>
                        <button
                            onClick={handleBackToList}
                            className="plan-list__button plan-list__button--back"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanList;