const express = require('express');
const path = require('path');
const pino = require('pino');
const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    delay, 
    makeCacheableSignalKeyStore,
    DisconnectReason 
} = require("@whiskeysockets/baileys");
const fs = require('fs-extra'); // Using fs-extra for cleaner folder handling

const app = express();
const port = process.env.PORT || 3000;

function startWeb() {
    app.use(express.static('public'));

    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: "No number provided" });

        num = num.replace(/[^0-9]/g, ''); 

        // CRITICAL: Clean old attempts to prevent "Stuck" status
        if (fs.existsSync(`./temp/${num}`)) {
            fs.rmSync(`./temp/${num}`, { recursive: true, force: true });
        }

        console.log("---------------------------------------");
        console.log(`🚀 FORCING TRIGGER FOR: ${num}`);
        
        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${num}`);

        try {
            const sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                browser: ["Ubuntu", "Chrome", "20.0.04"] 
            });

            // If it takes more than 30 seconds, tell the user to try again
            const timeout = setTimeout(() => {
                if (!res.headersSent) {
                    res.status(408).json({ error: "Connection Timeout. Please refresh." });
                    sock.logout();
                }
            }, 35000);

            if (!sock.authState.creds.registered) {
                await delay(5000); // 5s delay gives Render time to stabilize
                const code = await sock.requestPairingCode(num);

                if (!res.headersSent) {
                    clearTimeout(timeout);
                    res.json({ code: code });
                    console.log(`✅ SUCCESS: ${code}`);
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    console.log(`🏆 LINKED SUCCESS: ${num}`);
                    await delay(5000); 
                    
                    const sessionFile = `./temp/${num}/creds.json`;
                    if (fs.existsSync(sessionFile)) {
                        const creds = JSON.parse(fs.readFileSync(sessionFile));
                        const sessionID = Buffer.from(JSON.stringify(creds)).toString('base64');

                        await sock.sendMessage(sock.user.id, { 
                            text: `*𝕿𝖔𝖝𝖎𝖈.𝖆.𝖓.𝖙-MD SESSION ID*\n\n*ID:* Toxicant;;${sessionID}` 
                        });
                    }

                    // Auto-cleanup
                    setTimeout(() => { 
                        try { fs.rmSync(`./temp/${num}`, { recursive: true, force: true }); } catch(e) {}
                    }, 15000);
                }

                if (connection === "close") {
                    let reason = lastDisconnect?.error?.output?.statusCode;
                    if (reason !== DisconnectReason.loggedOut) {
                        // Logic to restart if necessary
                    }
                }
            });

        } catch (e) {
            console.log("❌ ERROR:", e);
            if (!res.headersSent) res.status(500).json({ error: "Trigger Failed" });
        }
    });

    app.listen(port, () => {
        console.log("=======================================");
        console.log(`   TOXICANT-MD STATION: PORT ${port}   `);
        console.log("=======================================");
    });
}

module.exports = { startWeb };
