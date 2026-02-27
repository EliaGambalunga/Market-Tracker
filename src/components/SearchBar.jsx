import React, { useState } from 'react';
import { Search, Bell, ArrowUpDown, X } from 'lucide-react';
import './SearchBar.css';

function SearchBar({ searchQuery, setSearchQuery, sortBy, setSortBy, notifications = [] }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="search-header">
      {/* Search Input Container */}
      <div className="search-container glass-effect">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search Assets"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="clear-search-btn"
            onClick={() => setSearchQuery('')}
            title="Clear Search"
          >
            <X size={16} />
          </button>
        )}
        <div className="sort-divider"></div>
        <div className="sort-container">
          <ArrowUpDown size={16} className="search-icon" />
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="none">Sort By</option>
            <option value="price_high">Highest Price</option>
            <option value="price_low">Lowest Price</option>
            <option value="gainers">Top Gainers</option>
            <option value="losers">Top Losers</option>
          </select>
        </div>
      </div>

      {/* Notifications Dropdown */}
      <div className="notification-container">
        <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
          <Bell size={20} />
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </div>

        {showNotifications && (
          <div className="notifications-dropdown glass-effect slide-down">
            <h3 className="notif-header">Recent Alerts</h3>
            <div className="notif-list">
              {notifications.length === 0 ? (
                <div className="notif-empty">No alerts triggered yet.</div>
              ) : (
                notifications.map(notif => (
                  <div key={notif.id} className={`notif-item ${notif.read ? 'read' : 'unread'}`}>
                    <div className="notif-title">
                      <strong>{notif.assetSymbol}</strong> <span>{notif.time}</span>
                    </div>
                    <div className="notif-message">{notif.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;
