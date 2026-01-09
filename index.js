const { startRaven } = require('./main');
const { startWeb } = require('./pairing');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

async function initiate() {
    // 1. IMMEDIATELY start a dummy server to satisfy Render
    app.get('/', (req, res) => res.send('TOXIC-MD is running...'));
    app.listen(port, () => console.log(`✅ Web Server live on port ${port}`));

    try {
        console.log("⚙️ Initializing pairing server...");
        startWeb(); 

        console.log("⚙️ Starting WhatsApp connection...");
        await startRaven();
    } catch (e) {
        console.error("Critical Start Error:", e);
    }
}

initiate();
