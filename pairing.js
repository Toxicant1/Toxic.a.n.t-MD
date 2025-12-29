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
    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: 'No number provided' });

        num = num.replace(/[^0-9]/g, '');

        // 1. Clean start: If session is broken, pairing often fails
        // Consider deleting the session folder manually if issues persist

        const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);

        const sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
            },
            logger: pino({ level: 'fatal' }),
            printQRInTerminal: false,
            // Use a standard browser string to avoid being blocked
            browser: ["Ubuntu", "Chrome", "20.0.04"], 
        });

        sock.ev.on('creds.update', saveCreds);

        // 2. The Fix: Request code only when the socket is ready to communicate
        try {
            if (!sock.authState.creds.registered) {
                // Wait for the socket to initialize internal listeners
                await delay(3000); 
                
                const code = await sock.requestPairingCode(num);
                console.log(`✅ Code generated for ${num}: ${code}`);
                
                if (!res.headersSent) {
                    return res.json({ code });
                }
            } else {
                return res.json({ message: 'Device already logged in' });
            }
        } catch (err) {
            console.error("Pairing Error:", err);
            res.status(500).json({ error: "Service busy, try again in 10 seconds" });
        }
    });

    app.listen(port, () => {
        console.log(`🌐 TOXIC.a.n.t MD SERVER ONLINE`);
    });
}

module.exports = { startWeb };
