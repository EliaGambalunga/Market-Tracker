import React, { useState } from 'react';
import { X, ExternalLink, Star, BellPlus } from 'lucide-react';
import MiniChart from './MiniChart';
import './AssetDetailModal.css';

// Format helpers for large numbers
const formatLargeNumber = (num) => {
    if (!num || num === 0) return 'N/A';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
};

function AssetDetailModal({ asset, categoryConfig, onClose, formatPrice, formatChange, isFavorite, onToggleFavorite, onAddAlert, activeAlerts = [], onRemoveAlert }) {
    const [timeframe, setTimeframe] = useState('1M');

    // Alert Form State
    const [alertPrice, setAlertPrice] = useState('');
    const [alertCondition, setAlertCondition] = useState('above');
    const [showForm, setShowForm] = useState(false);

    if (!asset) return null;

    const isPositive = parseFloat(asset.changePercent24Hr) >= 0;

    let activeChartData = asset.chartData || [];
    if (asset.chartData1Y) {
        switch (timeframe) {
            case '1D': activeChartData = asset.chartData1Y.slice(-24); break;
            case '1W': activeChartData = asset.chartData1Y.slice(-7); break;
            case '1M': activeChartData = asset.chartData1Y.slice(-30); break;
            case '1Y': activeChartData = asset.chartData1Y; break;
            default: activeChartData = asset.chartData1Y.slice(-30); break;
        }
    }

    const handleSetAlert = (e) => {
        e.preventDefault();
        const t = parseFloat(alertPrice);
        if (!isNaN(t) && t > 0) {
            onAddAlert(asset.id, t, alertCondition);
            setShowForm(false);
            setAlertPrice('');
        }
    };

    const getTradeUrl = (broker, symbol) => {
        switch (broker) {
            case "Binance": return `https://www.binance.com/en/trade/${symbol}_USDT`;
            case "Coinbase": return `https://www.coinbase.com/price/${symbol.toLowerCase()}`;
            case "Kraken": return `https://www.kraken.com/prices/${symbol.toLowerCase()}`;
            case "NYSE": return `https://www.nyse.com/quote/XNYS:${symbol}`;
            case "NASDAQ": return `https://www.nasdaq.com/market-activity/stocks/${symbol.toLowerCase()}`;
            case "LME": return `https://www.lme.com/`;
            case "CME": return `https://www.cmegroup.com/`;
            case "Forex.com": return `https://www.forex.com/en-us/trading/`;
            default: return `https://www.google.com/finance/quote/${symbol}:USD`;
        }
    };

    const CategoryIcon = categoryConfig?.Icon;
    const catColor = categoryConfig?.color;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content glass-effect" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} title="Close">
                    <X size={24} />
                </button>

                <header className="modal-header">
                    <div className="header-title-wrap">
                        <div className="header-title">
                            {CategoryIcon && (
                                <div className="modal-category-icon" style={{ color: catColor, background: `${catColor}15` }}>
                                    <CategoryIcon size={24} />
                                </div>
                            )}
                            <h2>{asset.name}</h2>
                            <span className="symbol-badge">{asset.symbol}</span>
                        </div>
                        <button
                            className={`modal-fav-btn ${isFavorite ? 'active' : ''}`}
                            onClick={() => onToggleFavorite(asset.id)}
                            title="Toggle Favorite"
                        >
                            <Star size={24} fill={isFavorite ? "currentColor" : "none"} />
                        </button>
                    </div>
                    <div className="header-price">
                        <h1 className={isPositive ? 'trend-up' : 'trend-down'}>
                            {formatPrice(asset.priceUsd)}
                        </h1>
                        <span className={`change-badge ${isPositive ? 'positive' : 'negative'}`}>
                            {isPositive ? '+' : ''}{formatChange(asset.changePercent24Hr)}%
                        </span>
                    </div>
                </header>

                <div className="modal-controls-row">
                    <div className="timeframe-selector">
                        {['1D', '1W', '1M', '1Y'].map(tf => (
                            <button
                                key={tf}
                                className={`tf-btn ${timeframe === tf ? 'active' : ''}`}
                                onClick={() => setTimeframe(tf)}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>

                    <button className="set-alert-toggle" onClick={() => setShowForm(!showForm)}>
                        <BellPlus size={16} /> Alert
                    </button>
                </div>

                {showForm && (
                    <div className="alert-form-container slide-down">
                        {activeAlerts.length > 0 && (
                            <div className="active-alerts-list">
                                {activeAlerts.map(alt => (
                                    <div key={alt.id} className="active-alert-item glass-effect">
                                        <span>Alert if <strong style={{ color: alt.condition === 'above' ? '#34d399' : '#ef4444' }}>CROSSES {alt.condition.toUpperCase()}</strong> {formatPrice(alt.threshold)}</span>
                                        <button className="del-alert-btn" onClick={() => onRemoveAlert(alt.id)}><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <form className="alert-form" onSubmit={handleSetAlert}>
                            <div className="alert-inputs">
                                <select
                                    value={alertCondition}
                                    onChange={(e) => setAlertCondition(e.target.value)}
                                    className="alert-select"
                                >
                                    <option value="above">Crosses Above</option>
                                    <option value="below">Crosses Below</option>
                                </select>
                                <div className="price-input-wrap">
                                    <span className="currency-prefix">$</span>
                                    <input
                                        type="number"
                                        step="any"
                                        placeholder="Target Price"
                                        value={alertPrice}
                                        onChange={(e) => setAlertPrice(e.target.value)}
                                        className="alert-input"
                                        required
                                    />
                                </div>
                                <button type="submit" className="alert-submit">Save</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="modal-chart-container">
                    <MiniChart data={activeChartData} isPositive={isPositive} />
                </div>

                <div className="modal-body">
                    <section className="about-section">
                        <h3>About {asset.name}</h3>
                        <p className="description-text">{asset.description}</p>
                    </section>

                    {/* New Enterprise Stats Section */}
                    <section className="stats-grid-section">
                        <h3>Key Statistics</h3>
                        <div className="stats-grid">
                            <div className="stat-box">
                                <span className="stat-lbl">Market Cap</span>
                                <span className="stat-val">{formatLargeNumber(asset.marketCap)}</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-lbl">Volume (24h)</span>
                                <span className="stat-val">{formatLargeNumber(asset.volume24h)}</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-lbl">Circulating Supply</span>
                                <span className="stat-val">{formatLargeNumber(asset.supply).replace('$', '')} {asset.symbol}</span>
                            </div>
                        </div>
                    </section>

                    <section className="buy-section">
                        <h3>Where to Trade</h3>
                        <div className="buy-links">
                            {asset.buyLinks?.map((link, i) => (
                                <a
                                    key={i}
                                    href={getTradeUrl(link, asset.symbol)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="trade-btn glass-effect"
                                >
                                    {link} <ExternalLink size={14} />
                                </a>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default AssetDetailModal;
