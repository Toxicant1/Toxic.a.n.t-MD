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

        // Generate a completely fresh session ID for every single click
        const sessionId = `Session_${Math.floor(Math.random() * 10000)}`;
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
                // CHANGE: This makes WhatsApp think you are on an iPhone/Android
                browser: ["Chrome (Android)", "Chrome", "1.0.0"], 
                connectTimeoutMs: 120000, 
                syncFullHistory: false, 
                shouldSyncHistoryMessage: () => false,
            });

            if (!sock.authState.creds.registered) {
                // Wait slightly longer for the mobile handshake to stabilize
                await delay(7000); 
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) res.json({ code: code });
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === 'open') {
                    console.log(`🏆 LINKED: ${num}`);
                    await delay(5000); 

                    const sessionFile = `${sessionPath}/creds.json`;
                    if (fs.existsSync(sessionFile)) {
                        const creds = JSON.parse(fs.readFileSync(sessionFile));
                        const sessionID = Buffer.from(JSON.stringify(creds)).toString('base64');

                        // Use a very simple string to ensure no message errors
                        await sock.sendMessage(sock.user.id, {
                            text: `Toxicant;;${sessionID}`
                        });
                    }
                    setTimeout(() => fs.rmSync(sessionPath, { recursive: true, force: true }), 15000);
                }

                if (connection === 'close') {
                    const reason = lastDisconnect?.error?.output?.statusCode;
                    console.log(`❌ Failed with code: ${reason}`);
                    // Wipe the failed session immediately
                    try { fs.rmSync(sessionPath, { recursive: true, force: true }); } catch(e) {}
                }
            });

        } catch (e) {
            console.log("❌ ERROR:", e);
            if (!res.headersSent) res.status(500).json({ error: "Try a different number or VPN" });
        }
    });

    app.listen(port, () => {
        console.log(`SERVER LIVE ON PORT ${port}`);
    });
}

module.exports = { startWeb };
