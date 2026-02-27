# 📈 Market Tracker Elite

**Market Tracker Elite** is a cutting-edge professional platform for real-time monitoring of financial markets. Built to offer a seamless, premium user experience, it blends an ultra-modern *Glassmorphism* design with top-notch engineering performance.

---

## 🔥 Key Features

- **🚀 Extreme Performance**: Optimized **React** rendering engine (via `useMemo` and `React.memo`) capable of managing and rendering over **1,500 financial instruments** simultaneously.
- **⏱️ Real-Time Data**: WebSocket-style updates with customizable tick rate of **3, 5, or 7 seconds**.
- **📊 Integrated Global Markets**: Multiple categories including **Cryptocurrencies, Stocks (AAPL, TSLA...), Forex, Commodities, and Precious Metals**.
- **🔔 Smart Notification System**: Set custom dynamic price alerts. Receive animated Toast popups (and an in-app history) as soon as your assets cross your desired thresholds.
- **📱 "Sleek Dark Mode" UI/UX Design**: A visually stunning full-screen interface with dynamic blurs, vector shadows, and custom icons based on the asset category.
- **⚡ Native Desktop Applications**: Fully ported with **Electron.js**. Available for both macOS (`.dmg`) and Windows (`.exe`).

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, Lucide-React for iconography.
- **Styling**: Advanced vanilla CSS (Dynamic gradients, Backdrop filter, CSS3 animations).
- **Desktop Packaging**: Electron, Electron-Builder.
- **Architecture**: Custom React Hooks (`useRealtimeData`), LocalStorage for persistence and Virtual DOM optimization.

## 📥 Installation and Development

```bash
# 1. Clone the repository
git clone https://github.com/YOURNAME/market-tracker.git

# 2. Go to the folder and install the dependencies
cd market-tracker
npm install

# 3. Start the local development server
npm run dev
```

### Or create the Desktop Apps
```bash
# To create the Mac version (.dmg)
npm run electron:build:mac

# To create the Windows version (.exe)
npm run electron:build:win
```

---
*Designed, coded, and signed by **Elia Gambalunga**.
