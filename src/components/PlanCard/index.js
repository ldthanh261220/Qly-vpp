import React from 'react';
import { Check, X, List } from 'lucide-react';
import './PlanCard.scss';

const PlanCard = ({ plan, onApprove, onReject, onViewDetails }) => {
  return (
    <div className="plan-card">
      <div className="plan-card__header">
        <div>
          <div className="plan-card__id">Mã KH: {plan.id}</div>
          <h3 className="plan-card__title">{plan.title}</h3>
        </div>
        <div>
          <span className={`plan-card__status ${plan.status === 'approved' ? 'approved' : 'pending'}`}>
            {plan.status === 'approved' ? 'Đã duyệt' : 'Chưa duyệt'}
          </span>
        </div>
      </div>
      
      <div className="plan-card__grid">
        <div>
          <div className="plan-card__field">
            <div className="plan-card__label">Loại kế hoạch:</div>
            <div className="plan-card__value">{plan.type}</div>
          </div>
          <div className="plan-card__field">
            <div className="plan-card__label">Đơn vị đề xuất:</div>
            <div className="plan-card__value">{plan.department}</div>
          </div>
          <div className="plan-card__field">
            <div className="plan-card__label">Tổng ngân sách:</div>
            <div className="plan-card__value">{plan.budget}</div>
          </div>
        </div>
        <div>
          <div className="plan-card__field">
            <div className="plan-card__label">Lĩnh vực:</div>
            <div className="plan-card__value">{plan.category}</div>
          </div>
          <div className="plan-card__field">
            <div className="plan-card__label">Địa điểm:</div>
            <div className="plan-card__value">{plan.location}</div>
          </div>
        </div>
      </div>
      
      <div className="plan-card__actions">
        <button 
          onClick={() => onViewDetails(plan.id)} 
          className="plan-card__button plan-card__button--view"
          title="Xem chi tiết"
        >
          <List size={20} />
        </button>
        <button 
          onClick={() => onApprove(plan.id)} 
          className="plan-card__button plan-card__button--approve"
          title="Duyệt"
        >
          <Check size={20} />
        </button>
        <button 
          onClick={() => onReject(plan.id)} 
          className="plan-card__button plan-card__button--reject"
          title="Từ chối"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default PlanCard;