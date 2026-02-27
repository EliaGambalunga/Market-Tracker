import { useState, useEffect, useRef } from 'react';

// --- Enterprise Realistic Data Dictionaries ---
const ENTERPRISE = [
    { s: 'SAMSUNG', n: 'Samsung Electronics', d: 'South Korean multinational electronics corporation.', b: 50.10 },
    { s: 'INTC', n: 'Intel Corporation', d: 'American multinational semiconductor chip maker.', b: 35.50 },
    { s: 'SIE', n: 'Siemens AG', d: 'German multinational conglomerate corporation.', b: 145.80 },
    { s: 'TCEHY', n: 'Tencent Holdings', d: 'Chinese multinational technology conglomerate.', b: 40.20 },
    { s: 'BABA', n: 'Alibaba Group', d: 'Chinese multinational technology company specializing in e-commerce.', b: 85.40 },
    { s: 'SONY', n: 'Sony Group', d: 'Japanese multinational conglomerate corporation.', b: 80.70 }
];

const STOCKS = [
    { s: 'AAPL', n: 'Apple Inc.', d: 'American multinational technology company specializing in consumer electronics.', b: 175.50 },
    { s: 'MSFT', n: 'Microsoft Corp.', d: 'American multinational corporation producing software & electronics.', b: 330.20 },
    { s: 'NVDA', n: 'NVIDIA Corp.', d: 'American multinational technology company known for designing GPUs.', b: 450.80 },
    { s: 'TSLA', n: 'Tesla, Inc.', d: 'American automotive and clean energy company.', b: 240.10 },
    { s: 'AMZN', n: 'Amazon.com', d: 'American e-commerce and cloud computing giant.', b: 130.40 },
    { s: 'META', n: 'Meta Platforms', d: 'American multinational technology conglomerate.', b: 300.70 },
    { s: 'GOOGL', n: 'Alphabet Inc.', d: 'American multinational technology holding company.', b: 135.20 }
];

const METALS = [
    { s: 'XAU', n: 'Gold (Oz)', d: 'A highly sought-after precious metal, traditionally used as a store of value.', b: 1950.40 },
    { s: 'XAG', n: 'Silver (Oz)', d: 'A precious metal broadly used in industrial applications and jewelry.', b: 23.50 },
    { s: 'XPT', n: 'Platinum (Oz)', d: 'A dense, malleable, and highly unreactive precious metal.', b: 920.10 },
    { s: 'XPD', n: 'Palladium (Oz)', d: 'A rare silvery-white metal used largely in catalytic converters.', b: 1250.80 },
    { s: 'COP', n: 'Copper', d: 'A ductile metal with very high thermal and electrical conductivity.', b: 3.80 }
];

const FOREX = [
    { s: 'EUR/USD', n: 'Euro / US Dollar', d: 'The most traded currency pair in the world.', b: 1.08 },
    { s: 'GBP/USD', n: 'British Pound / US Dollar', d: 'Commonly known as "Cable", a highly liquid major pair.', b: 1.25 },
    { s: 'USD/JPY', n: 'US Dollar / Japanese Yen', d: 'Major pair heavily influenced by the Bank of Japan.', b: 147.30 },
    { s: 'AUD/USD', n: 'Australian Dollar / US Dollar', d: 'Commodity-linked currency pair representing Australia.', b: 0.64 }
];

const COMMODITIES = [
    { s: 'CL', n: 'Crude Oil (WTI)', d: 'West Texas Intermediate, a major benchmark for oil pricing.', b: 85.20 },
    { s: 'NG', n: 'Natural Gas', d: 'A naturally occurring hydrocarbon gas mixture.', b: 2.80 },
    { s: 'ZC', n: 'Corn', d: 'A major agricultural commodity.', b: 480.25 },
    { s: 'ZW', n: 'Wheat', d: 'A widely cultivated cereal grain.', b: 590.50 }
];

const RESOURCES = [
    { s: 'LITH', n: 'Lithium Index', d: 'Crucial for battery manufacturing globally.', b: 25.40 },
    { s: 'URAN', n: 'Uranium Trust', d: 'A heavy metal used as an energy source.', b: 55.80 },
    { s: 'TIMB', n: 'Global Timber', d: 'Index tracking global forest management companies.', b: 32.10 }
];

// Reusable random walk generator
function generateRandomWalk(startPrice, numPoints, volatility) {
    const points = [];
    let current = startPrice;
    for (let i = 0; i < numPoints; i++) {
        const drift = (Math.random() - 0.5) * 0.001;
        const shock = (Math.random() - 0.5) * volatility;
        current = current * (1 + drift + shock);
        points.push(current);
    }
    return points;
}

// Generate MASSIVE initial dataset
const GENERATE_MOCKS = (count) => {
    const results = [];
    let eIdx = 0, sIdx = 0, mIdx = 0, fIdx = 0, cIdx = 0, rIdx = 0;

    for (let i = 0; i < count; i++) {
        let category = 'crypto';
        let data = { s: `CRP${i}`, n: `Crypto Asset ${i}`, d: "A decentralized digital asset.", b: Math.random() * 100 + 0.1 };

        // Distribute categories evenly
        if (i % 2 === 0) {
            category = 'stocks';
            data = STOCKS[sIdx % STOCKS.length];
            sIdx++;
        } else if (i % 3 === 0) {
            category = 'companies';
            data = ENTERPRISE[eIdx % ENTERPRISE.length];
            eIdx++;
        } else if (i % 5 === 0) {
            category = 'commodity';
            data = COMMODITIES[cIdx % COMMODITIES.length];
            cIdx++;
        } else if (i % 7 === 0) {
            category = 'metals';
            data = METALS[mIdx % METALS.length];
            mIdx++;
        } else if (i % 11 === 0) {
            category = 'natural_resources';
            data = RESOURCES[rIdx % RESOURCES.length];
            rIdx++;
        } else if (i % 13 === 0) {
            category = 'forex';
            data = FOREX[fIdx % FOREX.length];
            fIdx++;
        }

        const isDuplicate = i > 15;
        const symbol = isDuplicate ? `${data.s}-${i}` : data.s;
        const name = isDuplicate ? `${data.n} Tier ${Math.ceil(i / 15)}` : data.n;

        const mockSupply = Math.floor(Math.random() * 1000000000) + 10000000;
        const marketCap = data.b * mockSupply;
        const vol24h = marketCap * (Math.random() * 0.05 + 0.01);

        results.push({
            id: `mock-${category}-${i}`,
            symbol: symbol,
            name: name,
            priceUsd: data.b.toString(),
            changePercent24Hr: ((Math.random() - 0.5) * 5).toString(),
            category,
            description: data.d,
            buyLinks: ["Interactive Brokers", "TradeStation", "eToro", "Fidelity"],
            chartData1Y: generateRandomWalk(data.b * 0.7, 365, 0.02),
            marketCap: marketCap,
            supply: mockSupply,
            volume24h: vol24h
        });
    }
    return results;
};

// SCALED TO 1500 ITEMS
const INITIAL_MOCKS = GENERATE_MOCKS(1500);

export function useRealtimeData(tickSpeed = 3000) {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const previousPrices = useRef({});
    const mockState = useRef(INITIAL_MOCKS);

    const fetchData = async () => {
        try {
            let liveCrypto = [];
            try {
                const response = await fetch('https://api.coincap.io/v2/assets?limit=450');
                if (response.ok) {
                    const data = await response.json();
                    liveCrypto = data.data.map(item => {
                        const price = parseFloat(item.priceUsd);
                        return {
                            id: item.id,
                            symbol: item.symbol,
                            name: item.name,
                            priceUsd: item.priceUsd,
                            changePercent24Hr: item.changePercent24Hr,
                            category: 'crypto',
                            description: `Real-time decentralized ledger asset. Tracking standard ticker ${item.symbol}. Market capitalization is based on circulating supply.`,
                            buyLinks: ["Binance", "Coinbase", "Kraken", "Bybit"],
                            chartData1Y: generateRandomWalk(price * 0.6, 365, 0.05), // Crypto is more volatile
                            marketCap: parseFloat(item.marketCapUsd || 0),
                            supply: parseFloat(item.supply || 0),
                            volume24h: parseFloat(item.volumeUsd24Hr || 0)
                        };
                    });
                }
            } catch (e) {
                console.warn("CoinCap API unreachable. Falling back entirely to mock data.");
            }

            // Evolve mock state for live updates using a Random Walk algorithm
            mockState.current = mockState.current.map(mock => {
                const currentPrice = parseFloat(mock.priceUsd);
                // Random walk: previous price * (1 + random slight shift)
                const volatility = mock.category === 'forex' ? 0.001 : 0.004;
                const tick = currentPrice * (1 + (Math.random() - 0.5) * volatility);

                // Append tick to 1Y array, shift array to keep length constant
                const newChartData = [...mock.chartData1Y.slice(1), tick];

                return {
                    ...mock,
                    priceUsd: tick.toString(),
                    chartData1Y: newChartData,
                    // Update 24h change slightly based on the tick
                    changePercent24Hr: (parseFloat(mock.changePercent24Hr) + ((tick - currentPrice) / currentPrice * 100)).toString()
                };
            });

            // If we got live data, mix it, else use only mocks
            let combined = mockState.current;
            if (liveCrypto.length > 0) {
                // Keep non-crypto mocks, replace crypto mocks with live data
                combined = [...liveCrypto, ...mockState.current.filter(m => m.category !== 'crypto')];
            }

            const formattedAssets = combined.map(asset => {
                const prev = previousPrices.current[asset.id];
                const current = parseFloat(asset.priceUsd);
                let flash = null;
                if (prev && prev !== current) {
                    flash = current > prev ? 'up' : 'down';
                }
                previousPrices.current[asset.id] = current;

                // Populate standard chartData prop for the MiniCards (we use the last 24 points to represent 1D)
                const chartData1D = asset.chartData1Y.slice(-24);

                return { ...asset, flash, chartData: chartData1D };
            });

            setAssets(formattedAssets);
            setLoading(false);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Failed to generate data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, tickSpeed);
        return () => clearInterval(intervalId);
    }, [tickSpeed]);

    return { assets, loading, error };
}
