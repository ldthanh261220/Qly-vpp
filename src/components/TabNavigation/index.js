import React from 'react';
import './TabNavigation.scss';

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
          Chưa duyệt ({counts.pending})
        </button>
        <button
          className={`tab-navigation__tab ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Đã duyệt ({counts.approved})
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;