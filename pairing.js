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
    // FIX: Properly serve static files from the 'public' directory
    // Ensure your assets folder is INSIDE the public folder
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: "No number provided" });

        // Clean number format
        num = num.replace(/[^0-9]/g, '');

        // Wipe old temp sessions to avoid "Already Logged In" or corruption
        if (fs.existsSync(`./temp/${num}`)) {
            fs.rmSync(`./temp/${num}`, { recursive: true, force: true });
        }

        console.log("---------------------------------------");
        console.log(`🚀 STARTING PAIRING FOR: ${num}`);

        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${num}`);

        try {
            const sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                // Using a stable Desktop browser signature
                browser: Browsers.ubuntu("Chrome"), 
                // Increased timeouts to survive Render's slow free tier
                connectTimeoutMs: 120000, 
                defaultQueryTimeoutMs: 120000,
                keepAliveIntervalMs: 20000,
                // CRITICAL: Stop the bot from crashing during history download
                syncFullHistory: false, 
                shouldSyncHistoryMessage: () => false,
                getMessage: async (key) => { return { conversation: 'Toxicant-MD' } }
            });

            // If not registered, wait for socket stabilization then get code
            if (!sock.authState.creds.registered) {
                await delay(10000); // 10s stabilization delay is mandatory for Render
                const code = await sock.requestPairingCode(num);

                if (!res.headersSent) {
                    res.json({ code: code });
                    console.log(`✅ PAIRING CODE GENERATED: ${code}`);
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect } = update;

                if (connection === 'open') {
                    console.log(`🏆 LINKED SUCCESSFULLY: ${num}`);
                    await delay(8000); // Wait for final encryption write

                    const sessionFile = `./temp/${num}/creds.json`;
                    if (fs.existsSync(sessionFile)) {
                        const creds = JSON.parse(fs.readFileSync(sessionFile));
                        // Convert credentials to Base64 for deployment
                        const sessionID = Buffer.from(JSON.stringify(creds)).toString('base64');

                        // Use plain text for the ID to prevent font-related buffer errors
                        await sock.sendMessage(sock.user.id, {
                            text: `TOXICANT-MD-SESSION-ID\n\nID: Toxicant;;${sessionID}\n\n_Do not share this ID with anyone._`
                        });
                    }

                    // Auto-cleanup temp files after success
                    setTimeout(() => {
                        try { fs.rmSync(`./temp/${num}`, { recursive: true, force: true }); } catch(e) {}
                    }, 15000);
                }

                if (connection === 'close') {
                    const reason = lastDisconnect?.error?.output?.statusCode;
                    console.log(`❌ Connection Closed. Code: ${reason}`);
                    
                    // If the user hasn't logged out, this might be a temporary error
                    if (reason === DisconnectReason.restartRequired) {
                        console.log("Restarting connection...");
                    }
                }
            });

        } catch (e) {
            console.log("❌ INTERNAL ERROR:", e);
            if (!res.headersSent) res.status(500).json({ error: "Service Timeout. Refresh and try again." });
        }
    });

    app.listen(port, () => {
        console.log(`\n=======================================`);
        console.log(`   TOXICANT-MD LIVE ON PORT ${port}   `);
        console.log(`=======================================\n`);
    });
}

module.exports = { startWeb };
