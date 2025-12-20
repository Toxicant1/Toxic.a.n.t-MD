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

    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: "No number provided" });
        num = num.replace(/[^0-9]/g, '');

        // 1. Ensure the temp directory exists
        const sessionId = `Session_${Math.floor(Math.random() * 10000)}`;
        const sessionPath = path.join(__dirname, 'temp', sessionId);
        fs.ensureDirSync(sessionPath); 

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        try {
            const sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                // Standard browser format for pairing
                browser: Browsers.ubuntu("Chrome"), 
                connectTimeoutMs: 60000, 
            });

            // 2. Request the code
            if (!sock.authState.creds.registered) {
                await delay(3000); // Give it a short moment to initialize
                const code = await sock.requestPairingCode(num);
                
                // Return both the code AND the sessionId to the frontend
                if (!res.headersSent) {
                    res.json({ 
                        code: code,
                        sessionId: sessionId 
                    });
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === 'open') {
                    console.log(`🏆 LINKED: ${num}`);
                    await delay(5000); 

                    const sessionFile = path.join(sessionPath, 'creds.json');
                    if (fs.existsSync(sessionFile)) {
                        const creds = JSON.parse(fs.readFileSync(sessionFile));
                        const base64Session = Buffer.from(JSON.stringify(creds)).toString('base64');

                        // Send the session ID to the linked WhatsApp account
                        await sock.sendMessage(sock.user.id, {
                            text: `Toxicant;;${base64Session}`
                        });
                    }
                    
                    // Cleanup after successful link
                    setTimeout(() => {
                        sock.logout();
                        fs.rmSync(sessionPath, { recursive: true, force: true });
                    }, 10000);
                }

                if (connection === 'close') {
                    const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                    if (!shouldReconnect) {
                        try { fs.rmSync(sessionPath, { recursive: true, force: true }); } catch(e) {}
                    }
                }
            });

        } catch (e) {
            console.error("❌ ERROR:", e);
            if (!res.headersSent) res.status(500).json({ error: "Server Error" });
        }
    });

    app.listen(port, () => {
        console.log(`SERVER LIVE ON PORT ${port}`);
    });
}

module.exports = { startWeb };
