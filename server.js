const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Engine State Memory Cores
let priceAlerts = [];
let triggeredAlerts = [];

// Volatile Market Simulators (Mocking fluid real-time price feeds)
let btcPrice = 92150;
let ethPrice = 3300;

// Internal Heartbeat Loop: Simulates market fluctuations every 3 seconds
setInterval(() => {
    // Generates realistic minor price movements
    btcPrice += Math.floor((Math.random() - 0.5) * 120);
    ethPrice += Math.floor((Math.random() - 0.5) * 15);
    
    // Evaluate if any deployed rule filters match the new data state
    evaluateRuleMatrix();
}, 3000);

// Core Processing Loop for Active Rules
function evaluateRuleMatrix() {
    priceAlerts = priceAlerts.filter(alert => {
        let currentPrice = alert.coin === 'BTC' ? btcPrice : ethPrice;

        // Condition verification check (Target hit!)
        if (currentPrice >= alert.targetPrice) {
            triggeredAlerts.push({
                ...alert,
                firedAtPrice: currentPrice,
                time: new Date().toLocaleTimeString()
            });
            console.log(`🚨 CRITERIA MATCHED: ${alert.coin} broke target threshold $${alert.targetPrice} (Current: $${currentPrice})`);
            return false; // Remove from active list because it fired
        }
        return true; // Retain rule inside active matrix
    });
}

// REST Endpoint: Market Data Stream
app.get('/api/crypto', (req, res) => {
    res.json([
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: btcPrice },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: ethPrice }
    ]);
});

// REST Endpoint: Deploy a New Rule Matrix Configuration
app.post('/api/alerts', (req, res) => {
    const { coin, targetPrice } = req.body;

    if (!coin || !targetPrice) {
        return res.status(400).json({ error: "Incomplete configuration attributes received." });
    }

    const newAlert = {
        id: Date.now(),
        coin: coin.trim().toUpperCase(),
        targetPrice: Number(targetPrice)
    };

    priceAlerts.push(newAlert);
    res.json({ message: "Rule successfully committed to active execution queue.", currentAlerts: priceAlerts });
});

// REST Endpoint: Synchronize active rules & clear fired ones
app.get('/api/alerts/sync', (req, res) => {
    // Send states back down, then clear the triggered buffer so alerts only pop up once
    res.json({ active: priceAlerts, triggered: triggeredAlerts });
    triggeredAlerts = []; 
});

app.listen(PORT, () => {
    console.log(`🚀 Algorithmic Engine is operational at http://localhost:${PORT}`);
});