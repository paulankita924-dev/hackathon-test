const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Live crypto price simulation API
app.get('/api/crypto', (req, res) => {
    const prices = [
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', price: Math.floor(91000 + Math.random() * 1500) },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', price: Math.floor(3300 + Math.random() * 80) }
    ];
    res.json(prices);
});

// Post route with input validation check
app.post('/api/alerts', (req, res) => {
    const { coin, targetPrice } = req.body;

    // Robust Validation Check
    if (!coin || !targetPrice) {
        return res.status(400).json({ error: "Both coin name and target price are required!" });
    }
    if (isNaN(targetPrice) || Number(targetPrice) <= 0) {
        return res.status(400).json({ error: "Target price must be a valid number greater than 0!" });
    }

    res.json({ message: `Alert successfully set for ${coin.toUpperCase()} at $${targetPrice}!` });
});

app.listen(PORT, () => {
    console.log(`Backend engine is cooking at http://localhost:${PORT}`);
});