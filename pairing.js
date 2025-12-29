const express = require('express');
const path = require('path');
const pino = require('pino');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require('@whiskeysockets/baileys');
const fs = require('fs-extra');

const app = express();
const port = process.env.PORT || 3000;
const SESSION_PATH = path.join(__dirname, 'session');

async function startWeb() {
    // Ensure session directory exists
    if (!fs.existsSync(SESSION_PATH)) {
        fs.mkdirSync(SESSION_PATH);
    }

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: 'No number provided' });

        num = num.replace(/[^0-9]/g, '');

        const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);

        const sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
            },
            logger: pino({ level: 'fatal' }),
            printQRInTerminal: false,
            // Chrome is better for pairing codes
            browser: ["Ubuntu", "Chrome", "20.0.04"], 
        });

        // Handle connection updates
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'open') {
                console.log('✅ TOXIC.a.n.t MD CONNECTED');
            }
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                if (shouldReconnect) {
                    console.log('Connection closed, reconnecting...');
                    // Logic to restart if needed
                }
            }
        });

        sock.ev.on('creds.update', saveCreds);

        try {
            if (!sock.authState.creds.registered) {
                await delay(1500); // Give it a moment to initialize
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    return res.json({ code });
                }
            } else {
                return res.json({ message: 'Already paired' });
            }
        } catch (error) {
            console.error("Error requesting pairing code:", error);
            res.status(500).json({ error: "Failed to generate code" });
        }
    });

    app.listen(port, () => {
        console.log(`🌐 SERVER RUNNING ON: http://localhost:${port}`);
        console.log(`🔗 GET CODE VIA: http://localhost:${port}/code?number=YOUR_NUMBER`);
    });
}

module.exports = { startWeb };
