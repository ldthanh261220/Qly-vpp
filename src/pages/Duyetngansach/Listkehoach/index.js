import React, { useEffect, useState } from 'react';
import TabNavigation from './../Tab';
import PlanCard from './../Kehoach';
import './PlanList.scss';
import duyetngansachService from '~/services/duyetngansachService';

const formatMoney = (amount) => {
    if (!amount || amount === 0) return '0 VNĐ';
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    return formatter.format(amount) + ' VNĐ';
};

const PlanList = () => {
    const [plans, setPlans] = useState([]);
    const [thietBiList, setThietBiList] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            setLoading(true);
            const response = await duyetngansachService.getlistmuasamService();
            if (response?.danhsachkehoach) {
                const mappedPlans = response.danhsachkehoach
                    .filter(
                        (item) =>
                            item?.trangThaiKeHoach === 'Đã duyệt ngân sách' ||
                            item?.trangThaiKeHoach === 'Đang chờ duyệt',
                    )
                    .map((item) => ({
                        id: item.maKeHoach,
                        title: item.tenKeHoach || 'Không có tiêu đề',
                        type: item.loaiyeucau || 'Không xác định',
                        unit: item.donViCongTac || 'Không xác định',
                        sum: item.chiPhiKeHoach || 0,
                        field: 'Hàng hóa',
                        address: 'số 48 Cao Thắng, TP. Đà Nẵng',
                        status: mapStatusToTabValue(item.trangThaiKeHoach),
                        originalStatus: item.trangThaiKeHoach,
                        ngayTao: item.ngayTao || new Date().toISOString().split('T')[0],
                    }));
                setPlans(mappedPlans);
            } else {
                setPlans([]);
            }
        } catch (error) {
            console.error('❌ Lỗi tải danh sách ngân sách:', error);
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm chuyển đổi trạng thái từ API sang giá trị tab
    const mapStatusToTabValue = (apiStatus) => {
        switch (apiStatus) {
            case 'Đã duyệt ngân sách':
                return 'approved';
            case 'Đang chờ duyệt':
                return 'pending';
            default:
                return 'pending';
        }
    };

    // Hàm chuyển đổi từ giá trị tab sang text hiển thị
    const getStatusText = (status) => {
        switch (status) {
            case 'approved':
                return 'Đã duyệt';
            case 'pending':
                return 'Chưa duyệt';
            default:
                return 'Chưa duyệt';
        }
    };

    const handleViewDetails = async (id) => {
        try {
            setLoading(true);
            const plan = plans.find((p) => p.id === id);
            if (!plan) {
                console.error('Không tìm thấy kế hoạch với ID:', id);
                return;
            }
            setSelectedPlan(plan);

            const response = await duyetngansachService.getlistthietbiService(id);
            if (response?.listthietbi && Array.isArray(response.listthietbi)) {
                setThietBiList(response.listthietbi);
            } else {
                setThietBiList([]);
            }
        } catch (error) {
            console.error('❌ Lỗi khi lấy thiết bị:', error);
            setThietBiList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            setLoading(true);
            await duyetngansachService.duyetngansach(id);

            // Cập nhật trạng thái trong danh sách
            setPlans((prev) =>
                prev.map((plan) =>
                    plan.id === id ? { ...plan, status: 'approved', originalStatus: 'Đã duyệt ngân sách' } : plan,
                ),
            );

            // Cập nhật trạng thái trong chi tiết nếu đang xem
            if (selectedPlan?.id === id) {
                setSelectedPlan((prev) => ({
                    ...prev,
                    status: 'approved',
                    originalStatus: 'Đã duyệt ngân sách',
                }));
            }
        } catch (err) {
            console.error('❌ Lỗi duyệt ngân sách:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (id) => {
        try {
            setLoading(true);
            await duyetngansachService.tuchoingansach(id);

            // Cập nhật trạng thái trong danh sách
            setPlans((prev) =>
                prev.map((plan) =>
                    plan.id === id ? { ...plan, status: 'pending', originalStatus: 'Đang chờ duyệt' } : plan,
                ),
            );

            // Cập nhật trạng thái trong chi tiết nếu đang xem
            if (selectedPlan?.id === id) {
                setSelectedPlan((prev) => ({
                    ...prev,
                    status: 'pending',
                    originalStatus: 'Đang chờ duyệt',
                }));
            }
        } catch (err) {
            console.error('❌ Lỗi từ chối ngân sách:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setSelectedPlan(null);
        setThietBiList([]);
    };

    const handleApproveAll = async () => {
        try {
            setLoading(true);
            const pendingPlans = plans.filter((plan) => plan.status === 'pending');

            // Gọi API duyệt cho từng kế hoạch pending
            const approvePromises = pendingPlans.map((plan) => duyetngansachService.duyetngansach(plan.id));

            await Promise.allSettled(approvePromises);

            // Cập nhật trạng thái tất cả thành approved
            setPlans((prev) =>
                prev.map((plan) => ({
                    ...plan,
                    status: 'approved',
                    originalStatus: 'Đã duyệt ngân sách',
                })),
            );

            setActiveTab('approved');
        } catch (error) {
            console.error('❌ Lỗi duyệt tất cả:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectAll = async () => {
        try {
            setLoading(true);
            const approvedPlans = plans.filter((plan) => plan.status === 'approved');

            // Gọi API từ chối cho từng kế hoạch approved
            const rejectPromises = approvedPlans.map((plan) => duyetngansachService.tuchoingansach(plan.id));

            await Promise.allSettled(rejectPromises);

            // Cập nhật trạng thái tất cả thành pending
            setPlans((prev) =>
                prev.map((plan) => ({
                    ...plan,
                    status: 'pending',
                    originalStatus: 'Đang chờ duyệt',
                })),
            );

            setActiveTab('pending');
        } catch (error) {
            console.error('❌ Lỗi từ chối tất cả:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredPlans = plans.filter((plan) => {
        if (activeTab === 'all') return true;
        return plan.status === activeTab;
    });

    const counts = {
        all: plans.length,
        pending: plans.filter((plan) => plan.status === 'pending').length,
        approved: plans.filter((plan) => plan.status === 'approved').length,
    };

    if (loading && plans.length === 0) {
        return <div className="plan-list__loading">Đang tải...</div>;
    }

    return (
        <div className="plan-list">
            {!selectedPlan ? (
                <>
                    <h1 className="plan-list__title">Danh sách kế hoạch</h1>
                    <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />
                    <div className="plan-list__cards">
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map((plan, index) => (
                                <PlanCard
                                    key={`${plan.id}-${index}`}
                                    plan={plan}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                    onViewDetails={() => handleViewDetails(plan.id)}
                                    loading={loading}
                                />
                            ))
                        ) : (
                            <div className="plan-list__empty">
                                Không có kế hoạch nào{' '}
                                {activeTab !== 'all'
                                    ? `trong trạng thái ${getStatusText(activeTab).toLowerCase()}`
                                    : ''}
                            </div>
                        )}
                    </div>
                    {filteredPlans.length > 0 && (
                        <div className="plan-list__batch-actions">
                            <button
                                onClick={handleApproveAll}
                                className="plan-list__button plan-list__button--approve"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Duyệt tất cả'}
                            </button>
                            <button
                                onClick={handleRejectAll}
                                className="plan-list__button plan-list__button--reject"
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Từ chối tất cả'}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="plan-list__detail">
                    <div className="header">
                        <h2>{selectedPlan.title}</h2>
                        <div className="status">
                            Trạng thái:
                            <span className={`status-badge ${selectedPlan.status}`}>
                                {getStatusText(selectedPlan.status)}
                            </span>
                        </div>
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
                                {thietBiList.length > 0 ? (
                                    thietBiList.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.tenThietBi || 'Không có tên'}</td>
                                            <td>{item.donViTinh || 'cái'}</td>
                                            <td>{item.soLuong || 0}</td>
                                            <td>{formatMoney(item.giaBan || 0)}</td>
                                            <td>{formatMoney((item.giaBan || 0) * (item.soLuong || 0))}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">
                                            {loading ? 'Đang tải thiết bị...' : 'Không có thiết bị nào'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="total">
                            Tổng tiền:{' '}
                            <span>
                                {formatMoney(
                                    thietBiList.reduce(
                                        (acc, item) => acc + (item.giaBan || 0) * (item.soLuong || 0),
                                        0,
                                    ),
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="actions">
                        <button onClick={() => handleReject(selectedPlan.id)} className="reject" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Từ chối'}
                        </button>
                        <button onClick={() => handleApprove(selectedPlan.id)} className="approve" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Duyệt'}
                        </button>
                        <button onClick={handleBackToList} className="back" disabled={loading}>
                            Quay lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanList;
