import React, { useState } from 'react';
import {
    LayoutDashboard,
    Bitcoin,
    Coins,
    Activity,
    Star,
    Settings,
    ChevronLeft,
    ChevronRight,
    Gem,
    TreePine,
    Building2,
    LineChart
} from 'lucide-react';
import './Sidebar.css';

const CATEGORIES = [
    { id: 'all', label: 'All Assets', icon: LayoutDashboard },
    { id: 'crypto', label: 'Cryptocurrency', icon: Bitcoin },
    { id: 'metals', label: 'Metals', icon: Gem },
    { id: 'commodity', label: 'Commodities', icon: Coins },
    { id: 'natural_resources', label: 'Resources', icon: TreePine },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'stocks', label: 'Stocks', icon: LineChart },
    { id: 'forex', label: 'Forex', icon: Activity },
    { id: 'favorites', label: 'Favorites', icon: Star },
];

function Sidebar({ isOpen, toggleSidebar, selectedCategory, onSelectCategory, settings, updateSettings }) {
    const [showSettings, setShowSettings] = useState(false);

    return (
        <aside className={`sidebar glass-effect ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                {isOpen && <h2 className="sidebar-title">Market</h2>}
                <button className="toggle-btn" onClick={toggleSidebar}>
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = selectedCategory === cat.id;
                        return (
                            <li key={cat.id}>
                                <button
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => onSelectCategory(cat.id)}
                                    title={!isOpen ? cat.label : ''}
                                >
                                    <Icon size={20} className="nav-icon" />
                                    {isOpen && <span className="nav-label">{cat.label}</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button
                    className={`nav-item ${showSettings ? 'active' : ''}`}
                    title={!isOpen ? 'Settings' : ''}
                    onClick={() => {
                        if (!isOpen) toggleSidebar();
                        setShowSettings(!showSettings);
                    }}
                >
                    <Settings size={20} className="nav-icon" />
                    {isOpen && <span className="nav-label">Settings</span>}
                </button>

                {showSettings && isOpen && settings && (
                    <div className="settings-panel slide-down">
                        <div
                            className="setting-row"
                            onClick={() => updateSettings({ notifications: !settings.notifications })}
                        >
                            <span className="setting-icon">🔔</span>
                            <span>Alerts</span>
                            <span className={settings.notifications ? "status-on" : "status-off"}>
                                {settings.notifications ? "ON" : "OFF"}
                            </span>
                        </div>
                        <div
                            className="setting-row"
                            onClick={() => {
                                const speeds = [3, 5, 7];
                                const currentIdx = speeds.indexOf(settings.speed);
                                const nextIdx = (currentIdx === -1) ? 0 : (currentIdx + 1) % speeds.length;
                                updateSettings({ speed: speeds[nextIdx] });
                            }}
                        >
                            <span className="setting-icon">⚡</span>
                            <span>Live Data</span>
                            <span className="status-on">{settings.speed}s TICK</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;
