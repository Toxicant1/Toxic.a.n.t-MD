const express = require('express');
const { startRaven } = require('./main');
const pairingRouter = require('./pairing'); // Import the router we just fixed
const app = express();
const port = process.env.PORT || 10000;

async function initiate() {
    // 1. Use the pairing router on the same server
    app.use('/', pairingRouter);

    app.get('/', (req, res) => {
        res.send('☣️ TOXIC-MD is running and waiting for commands.');
    });

    // 2. ONLY ONE app.listen for the whole project
    app.listen(port, () => {
        console.log(`✅ TOXIC-MD Web Server live on port ${port}`);
    });

    try {
        console.log("⚙️ Starting WhatsApp connection...");
        await startRaven();
    } catch (e) {
        console.error("Connection Error:", e);
    }
}

initiate();
