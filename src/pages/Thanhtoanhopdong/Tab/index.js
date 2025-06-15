import React from 'react';
import './Tab.scss';

const TabNavigation = ({ activeTab, setActiveTab, counts }) => {
  return (
    <div className="tab-navigation">
      <div className="tab-navigation__tabs">
        <button
          className={`tab-navigation__tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tất cả ({counts.all})
        </button>
        <button
          className={`tab-navigation__tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Chưa thanh toán ({counts.pending})
        </button>
        <button
          className={`tab-navigation__tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Đã thanh toán ({counts.approved})
        </button>
      </div>
    </div>
  );
};

export default TabNavigation ;