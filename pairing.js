const express = require('express');
const path = require('path');
const pino = require('pino');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    delay, 
    makeCacheableSignalKeyStore,
    DisconnectReason,
    Browsers
} = require("@whiskeysockets/baileys");
const fs = require('fs-extra');

const app = express();
const port = process.env.PORT || 3000;

function startWeb() {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: "No number provided" });
        num = num.replace(/[^0-9]/g, '');

        // FIX: Create a unique temp folder for EVERY attempt to avoid "Fast Errors"
        const sessionId = `${num}_${Date.now()}`;
        const sessionPath = `./temp/${sessionId}`;

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        try {
            const sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                browser: Browsers.ubuntu("Chrome"),
                connectTimeoutMs: 60000, 
                // CRITICAL: Disable history to keep Render's RAM usage low
                syncFullHistory: false, 
                shouldSyncHistoryMessage: () => false,
            });

            if (!sock.authState.creds.registered) {
                await delay(5000); 
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) res.json({ code: code });
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === 'open') {
                    console.log(`🏆 SUCCESS: ${num}`);
                    await delay(5000); 

                    const sessionFile = `${sessionPath}/creds.json`;
                    if (fs.existsSync(sessionFile)) {
                        const creds = JSON.parse(fs.readFileSync(sessionFile));
                        const sessionID = Buffer.from(JSON.stringify(creds)).toString('base64');

                        await sock.sendMessage(sock.user.id, {
                            text: `TOXICANT-MD;;${sessionID}`
                        });
                    }
                    // Clean up specific session folder
                    setTimeout(() => fs.rmSync(sessionPath, { recursive: true, force: true }), 10000);
                }

                if (connection === 'close') {
                    const reason = lastDisconnect?.error?.output?.statusCode;
                    console.log(`❌ Closed: ${reason}`);
                    // If link fails, clear the specific temp folder immediately
                    try { fs.rmSync(sessionPath, { recursive: true, force: true }); } catch(e) {}
                }
            });

        } catch (e) {
            console.log("❌ ERROR:", e);
            if (!res.headersSent) res.status(500).json({ error: "Try again" });
        }
    });

    app.listen(port, () => {
        console.log(`SERVER LIVE ON PORT ${port}`);
    });
}

module.exports = { startWeb };
