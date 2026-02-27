import React, { memo } from 'react';
import { TrendingUp, TrendingDown, Star, CircleDollarSign } from 'lucide-react';
import MiniChart from './MiniChart';
import './AssetCard.css';

const AssetCard = memo(function AssetCard({
    id,
    name,
    symbol,
    icon: Icon,
    iconColor,
    price,
    change,
    high24h,
    chartData,
    isPositive,
    flash, // 'up' | 'down' | null
    isFavorite,
    onToggleFavorite,
    onClick
}) {
    const trendColorClass = isPositive ? 'text-green' : 'text-red';
    const FallbackIcon = CircleDollarSign;
    const RenderIcon = Icon || FallbackIcon;

    return (
        <div className={`asset-card glass-effect ${isPositive ? 'positive-wrap' : 'negative-wrap'} ${flash ? `flash-${flash}` : ''}`} onClick={() => onClick(id)}>
            <div className="card-header">
                <div className="asset-info">
                    <div className="icon-wrapper" style={{ color: iconColor || '#fff', backgroundColor: `${iconColor || '#ffffff'}20` }}>
                        <RenderIcon size={24} />
                    </div>
                    <div className="title-wrapper">
                        <span className="asset-symbol">{symbol}</span>
                        <span className="asset-name" title={name}>{name?.length > 15 ? name.substring(0, 15) + '...' : name}</span>
                    </div>
                </div>

                <div className="header-actions">
                    <button
                        className={`favorite-btn ${isFavorite ? 'is-fav' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(id);
                        }}
                    >
                        <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </button>

                    <div className={`change-badge ${trendColorClass}`}>
                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span>{isPositive ? '+' : ''}{change}%</span>
                    </div>
                </div>
            </div>

            <MiniChart data={chartData} isPositive={isPositive} />

            <div className="card-body">
                <div className="price-section">
                    <h2 className={`current-price ${flash ? `text-flash-${flash}` : ''}`}>
                        {price}
                    </h2>
                </div>

                <div className="stats-section">
                    <div className="stat">
                        <span className="stat-label">Volume (24h)</span>
                        <span className="stat-value">{high24h}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}, (prevProps, nextProps) => {
    // Only re-render if value-critical props change (ignores onClick/onToggle ref changes)
    return (
        prevProps.price === nextProps.price &&
        prevProps.flash === nextProps.flash &&
        prevProps.isFavorite === nextProps.isFavorite &&
        prevProps.isPositive === nextProps.isPositive
    );
});

export default AssetCard;
