const express = require('express');
const fs = require('fs');
const path = require('path');
const { startRaven } = require('./main');
const pairingRouter = require('./pairing');
const config = require('./config');

const app = express();
const port = process.env.PORT || 10000;

app.use('/', pairingRouter);

app.get('/', (req, res) => {
    res.send('☣️ TOXIC-MD is running. Visit /code?number=2547XXXXXXXX to pair a new session.');
});

app.listen(port, () => {
    console.log(`✅ TOXIC-MD Web Server live on port ${port}`);
});

async function initiate() {
    const hasSession = fs.existsSync(path.join(__dirname, 'sessions', 'creds.json'));
    const hasSessionId = config.SESSION_ID && config.SESSION_ID !== "PASTE_YOUR_MEGA_ID_HERE";

    if (hasSession || hasSessionId) {
        console.log("⚙️ Existing session found, connecting...");
        try {
            await startRaven();
        } catch (e) {
            console.error("Connection Error:", e);
        }
    } else {
        console.log("⚠️ No session found yet.");
        console.log(`⚠️ Visit http://localhost:${port}/code?number=YOURNUMBER to generate a pairing code.`);
    }
}

initiate();
