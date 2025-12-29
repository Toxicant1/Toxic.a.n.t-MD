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
        
        // Sanitize number: remove +, spaces, and dashes
        num = num.replace(/[^0-9]/g, '');

        // Generate a unique session folder to prevent conflicts
        const sessionId = `TOXICANT_${Math.floor(Math.random() * 9000) + 1000}`;
        const sessionPath = path.join(__dirname, 'temp', sessionId);
        fs.ensureDirSync(sessionPath); 

        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        try {
            const sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
                },
                printQRInTerminal: false, // Essential for pairing code
                logger: pino({ level: 'fatal' }),
                // Enhanced browser spoofing for better compatibility
                browser: ["Ubuntu", "Chrome", "20.0.04"], 
                connectTimeoutMs: 60000,
                defaultQueryTimeoutMs: undefined,
            });

            // Request the 8-digit pairing code
            if (!sock.authState.creds.registered) {
                await delay(2000); 
                const code = await sock.requestPairingCode(num);
                
                if (!res.headersSent) {
                    res.json({ 
                        code: code, // This is your 8-digit code
                        sessionId: sessionId 
                    });
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === 'open') {
                    console.log(`🏆 TOXIC.a.n.t MD LINKED: ${num}`);
                    await delay(5000); 

                    const sessionFile = path.join(sessionPath, 'creds.json');
                    if (fs.existsSync(sessionFile)) {
                        const creds = JSON.parse(fs.readFileSync(sessionFile));
                        // Generate the session string for your config.js
                        const base64Session = Buffer.from(JSON.stringify(creds)).toString('base64');

                        // Send the Session ID directly to your "Me" chat on WhatsApp
                        await sock.sendMessage(sock.user.id, {
                            text: `*TOXIC.a.n.t MD SESSION ID*\n\n_Copy the code below:_\n\nToxicant;;${base64Session}\n\n⚠️ Keep this code private!`
                        });
                    }
                    
                    // Cleanup session from server after it is sent to your WhatsApp
                    setTimeout(() => {
                        sock.logout();
                        try { fs.rmSync(sessionPath, { recursive: true, force: true }); } catch(e) {}
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
            console.error("❌ PAIRING ERROR:", e);
            if (!res.headersSent) res.status(500).json({ error: "Connection Failed" });
        }
    });

    app.listen(port, () => {
        console.log(`🌐 TOXIC.a.n.t MD SERVER LIVE ON PORT ${port}`);
    });
}

module.exports = { startWeb };
