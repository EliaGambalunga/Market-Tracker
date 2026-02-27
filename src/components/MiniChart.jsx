import React from 'react';
import './MiniChart.css';

function MiniChart({ data, isPositive }) {
    // SVG drawing dimensions
    const width = 200;
    const height = 60;

    // Find min/max and normalize data to SVG path coordinates
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    const step = width / (data.length - 1);
    const points = data.map((val, i) => {
        const x = i * step;
        const y = height - ((val - min) / range) * height;
        return `${x},${y}`;
    });

    const pathD = `M ${points.join(' L ')}`;
    const color = isPositive ? 'var(--accent-green)' : 'var(--accent-red)';
    const glowId = isPositive ? 'glow-green' : 'glow-red';

    return (
        <div className="mini-chart-container">
            <svg viewBox={`0 0 ${width} ${height}`} className="mini-chart">
                <defs>
                    <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                <path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={`url(#${glowId})`}
                />
            </svg>
        </div>
    );
}

export default MiniChart;
