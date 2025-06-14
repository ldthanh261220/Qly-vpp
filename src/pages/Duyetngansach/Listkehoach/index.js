import React, { useEffect, useState } from 'react';
import TabNavigation from './../Tab';
import PlanCard from './../Kehoach';
import './PlanList.scss';
import duyetngansachService from '~/services/duyetngansachService';

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
            if (response.danhsachkehoach) {
                const mappedPlans = response.danhsachkehoach.map((item) => ({
                    id: item.maKeHoach,
                    title: item.tenKeHoach,
                    type: item.loaiYeuCau,
                    unit: item.donViCongTac,
                    sum: item.chiPhiKeHoach,
                    field: 'Hàng hóa',
                    address: 'số 48 Cao Thắng, TP. Đà Nẵng',
                    status: 'pending',
                    ngayTao: '2025-06-14'
                }));
                setPlans(mappedPlans);
            }
        } catch (error) {
            console.error('❌ Lỗi tải danh sách ngân sách:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (id) => {
        try {
            setLoading(true);
            const plan = plans.find(p => p.id === id);
            setSelectedPlan(plan);

            const response = await duyetngansachService.getlistthietbiService(id);
            if (response && response.listthietbi) {
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

    const handleApprove = (id) => {
        setPlans(plans.map(plan => 
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

    const handleReject = (id) => {
        setPlans(plans.map(plan => 
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

    const handleBackToList = () => {
        setSelectedPlan(null);
        setThietBiList([]);
    };

    const handleApproveAll = () => {
        setPlans(plans.map(plan => ({
            ...plan,
            status: 'approved'
        })));
        setActiveTab('approved');
    };

    const handleRejectAll = () => {
        setPlans(plans.map(plan => ({
            ...plan,
            status: 'pending'
        })));
        setActiveTab('pending');
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
                                Từ chối tất cả
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
                                {selectedPlan.status === 'approved' ? 'Đã duyệt' : 'Chưa duyệt'}
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
                                            <td>
                                                <img src="/printer-icon.png" className="product-icon" alt="" />
                                                {item.tenThietBi}
                                            </td>
                                            <td>{item.donViTinh || 'cái'}</td>
                                            <td>{item.soLuong}</td>
                                            <td>{formatMoney(item.giaBan)}</td>
                                            <td>{formatMoney(item.giaBan * item.soLuong)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Không có thiết bị nào</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="total">
                            Tổng tiền: <span>
                                {formatMoney(thietBiList.reduce((acc, item) => acc + item.giaBan * item.soLuong, 0))}
                            </span>
                        </div>
                    </div>
                    <div className="actions">
                        <button onClick={() => handleReject(selectedPlan.id)} className="reject">
                            Từ chối
                        </button>
                        <button onClick={() => handleApprove(selectedPlan.id)} className="approve">
                            Duyệt
                        </button>
                        <button onClick={handleBackToList} className="back">
                            Quay lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanList;