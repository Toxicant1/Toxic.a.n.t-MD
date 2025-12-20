const express = require('express');
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
    app.use(express.static('public'));

    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: "No number provided" });

        num = num.replace(/[^0-9]/g, '');

        // Remove previous temp folder
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
                browser: Browsers.ubuntu("Chrome"),
                connectTimeoutMs: 120000,
                defaultQueryTimeoutMs: 120000,
                keepAliveIntervalMs: 10000,
                syncFullHistory: false,
                markOnlineOnConnect: true
            });

            // Timeout in case QR/connection takes too long
            const timeout = setTimeout(() => {
                if (!res.headersSent) {
                    res.status(408).json({ error: "WhatsApp took too long. Try again." });
                    sock.end();
                }
            }, 90000); // Increased to 90 seconds

            // Listen for connection updates
            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;

                // QR received
                if (qr && !res.headersSent) {
                    clearTimeout(timeout);
                    res.json({ code: qr });
                    console.log(`✅ QR GENERATED for ${num}`);
                }

                // Successfully connected
                if (connection === 'open') {
                    console.log(`🏆 LINKED SUCCESSFULLY: ${num}`);

                    await delay(3000); // Wait for socket stabilization

                    const sessionFile = `./temp/${num}/creds.json`;
                    if (fs.existsSync(sessionFile)) {
                        const creds = JSON.parse(fs.readFileSync(sessionFile));
                        const sessionID = Buffer.from(JSON.stringify(creds)).toString('base64');

                        await sock.sendMessage(sock.user.id, {
                            text: `*TOXICANT-MD SESSION ID*\n\n*ID:* Toxicant;;${sessionID}\n\n_Successfully connected via Render Station._`
                        });
                    }

                    // Cleanup temp folder after 10s
                    setTimeout(() => {
                        try { fs.rmSync(`./temp/${num}`, { recursive: true, force: true }); } catch(e) {}
                    }, 10000);
                }

                // Connection closed
                if (connection === 'close') {
                    let reason = lastDisconnect?.error?.output?.statusCode;
                    console.log(`❌ Connection Closed. Reason Code: ${reason}`);
                }
            });

            // Save credentials on update
            sock.ev.on('creds.update', saveCreds);

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