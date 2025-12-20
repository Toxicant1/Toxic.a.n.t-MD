const express = require('express');
const path = require('path');
const pino = require('pino');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    delay, 
    makeCacheableSignalKeyStore,
    DisconnectReason,
    Browsers // Added this
} = require("@whiskeysockets/baileys");
const fs = require('fs-extra');

const app = express();
const port = process.env.PORT || 3000;

function startWeb() {
    app.use(express.static('public'));

    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: "No number provided" });

        num = num.replace(/[^0-9]/g, ''); 

        if (fs.existsSync(`./temp/${num}`)) {
            fs.rmSync(`./temp/${num}`, { recursive: true, force: true });
        }

        console.log("---------------------------------------");
        console.log(`🚀 ATTEMPTING SECURE LINK FOR: ${num}`);

        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${num}`);

        try {
            const sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                // FIX 1: Use the most stable browser signature
                browser: Browsers.ubuntu("Chrome"), 
                // FIX 2: Increase timeouts for Render's slow CPU
                connectTimeoutMs: 120000, // 2 minutes
                defaultQueryTimeoutMs: 120000,
                keepAliveIntervalMs: 10000,
                generateHighQualityLink: true,
                syncFullHistory: false, // Prevents lag by not downloading old chats
                markOnlineOnConnect: true
            });

            const timeout = setTimeout(() => {
                if (!res.headersSent) {
                    res.status(408).json({ error: "WhatsApp took too long. Try again." });
                    sock.end();
                }
            }, 50000);

            if (!sock.authState.creds.registered) {
                // FIX 3: Longer delay before requesting code to let socket stabilize
                await delay(8000); 
                const code = await sock.requestPairingCode(num);

                if (!res.headersSent) {
                    clearTimeout(timeout);
                    res.json({ code: code });
                    console.log(`✅ CODE GENERATED: ${code}`);
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    console.log(`🏆 LINKED SUCCESSFULLY: ${num}`);
                    await delay(5000); 

                    const sessionFile = `./temp/${num}/creds.json`;
                    if (fs.existsSync(sessionFile)) {
                        const creds = JSON.parse(fs.readFileSync(sessionFile));
                        const sessionID = Buffer.from(JSON.stringify(creds)).toString('base64');

                        await sock.sendMessage(sock.user.id, { 
                            text: `*𝕿𝖔𝖝𝖎𝖈.𝖆.𝖓.𝖙-MD SESSION ID*\n\n*ID:* Toxicant;;${sessionID}\n\n_Successfully connected via Render Station._` 
                        });
                    }

                    setTimeout(() => { 
                        try { fs.rmSync(`./temp/${num}`, { recursive: true, force: true }); } catch(e) {}
                    }, 10000);
                }

                if (connection === "close") {
                    let reason = lastDisconnect?.error?.output?.statusCode;
                    console.log(`❌ Connection Closed. Reason Code: ${reason}`);
                    // If it's a restartable error, it will try again on next click
                }
            });

        } catch (e) {
            console.log("❌ ERROR:", e);
            if (!res.headersSent) res.status(500).json({ error: "Handshake Failed" });
        }
    });

    app.listen(port, () => {
        console.log(`TOXICANT-MD SERVER LIVE ON PORT ${port}`);
    });
}

module.exports = { startWeb };
