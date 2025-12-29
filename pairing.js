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
            browser: ['TOXIC.a.n.t MD', 'Chrome', '1.0.0'],
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: undefined,
        });

        sock.ev.on('creds.update', saveCreds);

        if (!sock.authState.creds.registered) {
            await delay(2000);
            const code = await sock.requestPairingCode(num);
            return res.json({ code });
        } else {
            return res.json({ message: 'Already paired and logged in' });
        }

        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'open') {
                console.log('✅ TOXIC.a.n.t MD CONNECTED & ONLINE');
            }

            if (connection === 'close') {
                const reason = lastDisconnect?.error?.output?.statusCode;
                if (reason !== DisconnectReason.loggedOut) {
                    startWeb();
                } else {
                    console.log('❌ Logged out. Delete session and re-pair.');
                }
            }
        });
    });

    app.listen(port, () => {
        console.log(`🌐 TOXIC.a.n.t MD SERVER RUNNING ON PORT ${port}`);
    });
}

module.exports = { startWeb };