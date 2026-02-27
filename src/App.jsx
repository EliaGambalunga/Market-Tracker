import React, { useState, useEffect } from 'react';
import { Bitcoin, Activity, Coins, LineChart, Gem, TreePine, Building2 } from 'lucide-react';
import SearchBar from './components/SearchBar';
import AssetCard from './components/AssetCard';
import Sidebar from './components/Sidebar';
import AssetDetailModal from './components/AssetDetailModal';
import AlertToast from './components/AlertToast';
import { useRealtimeData } from './hooks/useRealtimeData';
import './App.css';

// Format helpers
const formatPrice = (p) => {
  const num = parseFloat(p);
  if (num < 1) return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumSignificantDigits: 3, maximumSignificantDigits: 4 }).format(num);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
};
const formatChange = (c) => parseFloat(c).toFixed(2);

function App() {
  // App Settings State (must be before useRealtimeData)
  const [appSettings, setAppSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('crypto_tracker_settings');
      return saved ? JSON.parse(saved) : { notifications: true, theme: 'dark', speed: 3 };
    } catch { return { notifications: true, theme: 'dark', speed: 3 }; }
  });

  const { assets, loading, error } = useRealtimeData(appSettings.speed * 1000);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [selectedAsset, setSelectedAsset] = useState(null); // Modal State

  // Favorites State
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('crypto_tracker_favs');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  // Active Alerts State
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('crypto_tracker_alerts');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  // Notification History State
  const [notificationsHistory, setNotificationsHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('crypto_tracker_history');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  });

  const [activeToast, setActiveToast] = useState(null);

  // Theme Application
  useEffect(() => {
    document.body.className = appSettings.theme === 'light' ? 'light-mode' : '';
  }, [appSettings.theme]);

  // Heartbeat to check Alerts
  useEffect(() => {
    if (!assets.length || !appSettings.notifications) return;

    let alertsToRemove = [];
    let newHistoryItems = [];
    alerts.forEach(alert => {
      const targetAsset = assets.find(a => a.id === alert.assetId);
      if (targetAsset) {
        const currentPrice = parseFloat(targetAsset.priceUsd);
        if ((alert.condition === 'above' && currentPrice >= alert.threshold) ||
          (alert.condition === 'below' && currentPrice <= alert.threshold)) {
          triggerNotification(targetAsset, alert.threshold, alert.condition);
          alertsToRemove.push(alert.id);
          newHistoryItems.push({
            id: Date.now() + Math.random(),
            assetName: targetAsset.name,
            assetSymbol: targetAsset.symbol,
            message: `Price crossed ${alert.condition.toUpperCase()} ${formatPrice(alert.threshold)}`,
            time: new Date().toLocaleTimeString(),
            read: false
          });
        }
      }
    });

    if (alertsToRemove.length > 0) {
      setAlerts(prev => {
        const remaining = prev.filter(a => !alertsToRemove.includes(a.id));
        localStorage.setItem('crypto_tracker_alerts', JSON.stringify(remaining));
        return remaining;
      });
      setNotificationsHistory(prev => {
        const next = [...newHistoryItems, ...prev].slice(0, 30); // Keep last 30
        localStorage.setItem('crypto_tracker_history', JSON.stringify(next));
        return next;
      });
    }
  }, [assets]); // Runs every time useRealtimeData generates a new tick

  const triggerNotification = (asset, threshold, condition) => {
    setActiveToast({
      id: Date.now(),
      title: `Price Alert!`,
      message: `${asset.name} crossed ${condition.toUpperCase()} ${formatPrice(threshold)}`,
      icon: asset.category === 'crypto' ? Bitcoin : LineChart,
      time: new Date().toLocaleTimeString()
    });
    setTimeout(() => setActiveToast(null), 6000); // Auto-hide
  };

  const addAlert = (assetId, threshold, condition) => {
    setAlerts(prev => {
      const newAlerts = [...prev, { id: Date.now(), assetId, threshold, condition }];
      localStorage.setItem('crypto_tracker_alerts', JSON.stringify(newAlerts));
      return newAlerts;
    });
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const newFavs = isFav ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('crypto_tracker_favs', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  // Filter & Sort Logic Optimized with useMemo
  const processedAssets = React.useMemo(() => {
    let result = assets;

    // 1. Category Filter
    if (selectedCategory === 'favorites') {
      result = result.filter(a => favorites.includes(a.id));
    } else if (selectedCategory !== 'all') {
      result = result.filter(a => a.category === selectedCategory);
    }

    // 2. Search Filter (Robust Case-Insensitive)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(a =>
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.symbol && a.symbol.toLowerCase().includes(q))
      );
    }

    // 3. Sorting
    if (sortBy !== 'none') {
      result = [...result].sort((a, b) => {
        const priceA = parseFloat(a.priceUsd);
        const priceB = parseFloat(b.priceUsd);
        const changeA = parseFloat(a.changePercent24Hr);
        const changeB = parseFloat(b.changePercent24Hr);

        switch (sortBy) {
          case 'price_high': return priceB - priceA;
          case 'price_low': return priceA - priceB;
          case 'gainers': return changeB - changeA;
          case 'losers': return changeA - changeB;
          default: return 0;
        }
      });
    }

    return result;
  }, [assets, selectedCategory, searchQuery, sortBy, favorites]);

  const getCategoryConfig = (category, symbol) => {
    let Icon = LineChart;
    let color = '#a855f7';
    if (category === 'crypto') { Icon = Bitcoin; color = '#3b82f6'; }
    if (symbol === 'BTC') color = '#34d399';
    if (category === 'metals') { Icon = Gem; color = '#fef08a'; }
    if (category === 'commodity') { Icon = Coins; color = '#fbbf24'; }
    if (category === 'natural_resources') { Icon = TreePine; color = '#22c55e'; }
    if (category === 'companies') { Icon = Building2; color = '#60a5fa'; }
    if (category === 'stocks') { Icon = LineChart; color = '#a855f7'; }
    if (category === 'forex') { Icon = Activity; color = '#ec4899'; }
    return { Icon, color };
  };

  return (
    <div className="mockup-container layout-wrap">
      {/* Toast Notification Mount */}
      {activeToast && (
        <AlertToast toast={activeToast} onClose={() => setActiveToast(null)} />
      )}

      {/* Detail Modal Overlay */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          categoryConfig={getCategoryConfig(selectedAsset.category, selectedAsset.symbol)}
          onClose={() => setSelectedAsset(null)}
          formatPrice={formatPrice}
          formatChange={formatChange}
          isFavorite={favorites.includes(selectedAsset.id)}
          onToggleFavorite={toggleFavorite}
          onAddAlert={addAlert}
          activeAlerts={alerts.filter(a => a.assetId === selectedAsset.id)}
          onRemoveAlert={(id) => setAlerts(prev => {
            const next = prev.filter(a => a.id !== id);
            localStorage.setItem('crypto_tracker_alerts', JSON.stringify(next));
            return next;
          })}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        settings={appSettings}
        updateSettings={(updates) => {
          setAppSettings(prev => {
            const next = { ...prev, ...updates };
            localStorage.setItem('crypto_tracker_settings', JSON.stringify(next));
            return next;
          });
        }}
      />

      <div className="main-content">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          notifications={notificationsHistory}
        />

        <main className="dashboard">
          {loading && assets.length === 0 ? (
            <div className="loading-state">Loading Enterprise Market Data...</div>
          ) : error ? (
            <div className="error-state">Error: {error}</div>
          ) : (
            <div className="card-grid">
              {processedAssets.map((asset) => {
                const isPositive = parseFloat(asset.changePercent24Hr) >= 0;
                const { Icon, color } = getCategoryConfig(asset.category, asset.symbol);

                return (
                  <AssetCard
                    key={asset.id}
                    id={asset.id}
                    name={asset.name}
                    symbol={asset.symbol}
                    icon={Icon}
                    iconColor={color}
                    price={formatPrice(asset.priceUsd)}
                    change={formatChange(asset.changePercent24Hr)}
                    high24h={`~${formatPrice(parseFloat(asset.priceUsd) * 1.05 * 1000)}`}
                    chartData={asset.chartData}
                    isPositive={isPositive}
                    flash={asset.flash}
                    isFavorite={favorites.includes(asset.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={() => setSelectedAsset(asset)}
                  />
                );
              })}
            </div>
          )}
        </main>

        {/* Author Signature */}
        <div className="app-signature">
          Software Signed by <strong>Elia Gambalunga</strong>
        </div>
      </div>
    </div>
  );
}

export default App;
