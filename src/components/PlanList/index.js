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
            maximumFractionDigits: 0,
        });
        return formatter.format(amount) + ' VNĐ';
    };

    // Tách hàm loadPlans để có thể tái sử dụng
    const loadPlans = async () => {
        try {
            const response = await chonmuasamService.getChonMuaSamService();

            // Lọc chỉ lấy trạng thái "Đã duyệt ngân sách" và "Đang chờ duyệt"
            const filteredContractors = response.danhsachkehoach.filter((contractor) => {
                const status = contractor.trangThai?.trim();
                return status === 'Đã duyệt' || status === 'Đã duyệt ngân sách';
            });

            const mappedPlans = filteredContractors.map((contractor) => ({
                id: contractor.maKeHoach,
                title: contractor.tenKeHoach,
                type: contractor.loaiyeucau,
                department: contractor.donViCongTac,
                budget: formatMoney(contractor.chiPhiKeHoach),
                user: contractor.hoTen,
                category: 'hàng hóa',
                location: 'số 48 Cao Thắng, TP. Đà Nẵng',
                status: contractor.trangThai?.trim() === 'Đã duyệt' ? 'approved' : 'pending',
                originalStatus: contractor.trangThai, // Lưu trạng thái gốc để debug
                time: `${moment(contractor.thoiGianBatDau).format('DD/MM/YYYY')} - ${moment(
                    contractor.thoiGianKetThuc,
                ).format('DD/MM/YYYY')}`,
            }));

            setPlans(mappedPlans);

            // Debug: In ra console để kiểm tra dữ liệu
            console.log('📊 Danh sách kế hoạch từ API (tất cả):', response.danhsachkehoach);
            console.log('📊 Danh sách kế hoạch sau khi lọc trạng thái:', filteredContractors);
            console.log('📊 Danh sách kế hoạch sau khi map:', mappedPlans);
            console.log('📊 Số lượng theo trạng thái:', {
                total: mappedPlans.length,
                approved: mappedPlans.filter((p) => p.status === 'approved').length,
                pending: mappedPlans.filter((p) => p.status === 'pending').length,
            });
        } catch (error) {
            console.error('❌ Lỗi tải danh sách kế hoạch:', error);
        }
    };

    useEffect(() => {
        loadPlans();
    }, []);

    // Duyệt kế hoạch và reload data
    const handleApprove = async (id) => {
        try {
            await chonmuasamService.duyetKeHoach(id);
            // Reload data từ server thay vì chỉ update state local
            await loadPlans();
        } catch (error) {
            console.error('❌ Lỗi khi duyệt kế hoạch:', error);
            alert('Duyệt kế hoạch thất bại!');
        }
    };

    // Từ chối kế hoạch và reload data
    const handleReject = async (id) => {
        try {
            await chonmuasamService.tuchoiKeHoach(id);
            // Reload data từ server thay vì chỉ update state local
            await loadPlans();
        } catch (error) {
            console.error('❌ Lỗi khi từ chối kế hoạch:', error);
            alert('Từ chối kế hoạch thất bại!');
        }
    };

    const handleViewDetails = (id) => {
        const plan = plans.find((p) => p.id === id);
        setSelectedPlan(plan);
    };

    const handleBackToList = () => {
        setSelectedPlan(null);
        setIsConfirmed(false);
    };

    // Duyệt tất cả - cần gọi API cho từng item
    const handleApproveAll = async () => {
        const pendingPlans = plans.filter((plan) => plan.status === 'pending');

        try {
            // Gọi API duyệt cho từng kế hoạch pending
            await Promise.all(pendingPlans.map((plan) => chonmuasamService.duyetKeHoach(plan.id)));

            // Reload data sau khi duyệt tất cả
            await loadPlans();
        } catch (error) {
            console.error('❌ Lỗi khi duyệt tất cả:', error);
            alert('Duyệt tất cả thất bại!');
        }
    };

    // Từ chối tất cả - cần gọi API cho từng item
    const handleRejectAll = async () => {
        const approvedPlans = plans.filter((plan) => plan.status === 'approved');

        try {
            // Gọi API từ chối cho từng kế hoạch approved
            await Promise.all(approvedPlans.map((plan) => chonmuasamService.tuchoiKeHoach(plan.id)));

            // Reload data sau khi từ chối tất cả
            await loadPlans();
        } catch (error) {
            console.error('❌ Lỗi khi từ chối tất cả:', error);
            alert('Từ chối tất cả thất bại!');
        }
    };

    const handleDetailApprove = async () => {
        if (!isConfirmed) {
            alert('Vui lòng xác nhận trước khi duyệt!');
            return;
        }

        try {
            await chonmuasamService.duyetKeHoach(selectedPlan.id);
            // Reload data và quay về danh sách
            await loadPlans();
            handleBackToList();
        } catch (error) {
            console.error('❌ Lỗi khi duyệt chi tiết:', error);
            alert('Duyệt kế hoạch thất bại!');
        }
    };

    const handleDetailReject = async () => {
        if (!isConfirmed) {
            alert('Vui lòng xác nhận trước khi từ chối!');
            return;
        }

        try {
            await chonmuasamService.tuchoiKeHoach(selectedPlan.id);
            // Reload data và quay về danh sách
            await loadPlans();
            handleBackToList();
        } catch (error) {
            console.error('❌ Lỗi khi từ chối chi tiết:', error);
            alert('Từ chối kế hoạch thất bại!');
        }
    };

    const filteredPlans = plans.filter((plan) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'approved') return plan.status === 'approved';
        if (activeTab === 'pending') return plan.status === 'pending';
        return true;
    });

    console.log('🔍 Active tab:', activeTab);
    console.log('🔍 Filtered plans:', filteredPlans);

    const counts = {
        all: plans.length,
        pending: plans.filter((plan) => plan.status === 'pending').length,
        approved: plans.filter((plan) => plan.status === 'approved').length,
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
                            <button onClick={handleApproveAll} className="plan-list__button plan-list__button--approve">
                                Duyệt tất cả
                            </button>
                            <button onClick={handleRejectAll} className="plan-list__button plan-list__button--reject">
                                Từ chối
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="plan-list__detail">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Chi tiết kế hoạch mua sắm</h2>
                        <button onClick={handleBackToList} className="plan-list__button">
                            Quay lại
                        </button>
                    </div>

                    <div className="section bg-gray-100 p-4 rounded mb-4">
                        <h3 className="font-semibold">Thông tin đề xuất</h3>
                        <p>
                            <strong>Mã số phòng:</strong> 001
                        </p>
                        <p>
                            <strong>Tên phòng:</strong> {selectedPlan.department}
                        </p>
                        <p>
                            <strong>Tên người đại diện Phòng:</strong>
                            {selectedPlan.user}
                        </p>
                    </div>

                    <div className="section bg-gray-100 p-4 rounded mb-4">
                        <h3 className="font-semibold">Thông tin kế hoạch</h3>
                        <p>
                            <strong>Mã kế hoạch:</strong> {selectedPlan.id}
                        </p>
                        <p>
                            <strong>Tên kế hoạch:</strong> {selectedPlan.title}
                        </p>
                        <p>
                            <strong>Loại:</strong> {selectedPlan.type}
                        </p>
                        <p>
                            <strong>Thời gian:</strong> {selectedPlan.time}
                        </p>
                        <p>
                            <strong>Địa điểm:</strong> {selectedPlan.location}
                        </p>
                        <p>
                            <strong>Lĩnh vực:</strong> {selectedPlan.category}
                        </p>
                        <p>
                            <strong>Số tiền dự kiến:</strong> {selectedPlan.budget}
                        </p>
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
                            <strong>Tôi đã đọc và đồng ý với các cam kết trên</strong> (Bắt buộc tick vào ô này để tiếp
                            tục)
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
