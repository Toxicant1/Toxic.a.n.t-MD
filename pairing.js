const express = require('express');
const path = require('path');
const pino = require('pino');
const { default: makeWASocket, useMultiFileAuthState, delay, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Serve the clean frontend
function startWeb() {
    app.use(express.static('public'));
    
    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: "No number" });
        num = num.replace(/[^0-9]/g, '');

        console.log("---------------------------------------"); // Line Breaker
        console.log(`[PAIRING] Request for: ${num}`);
        
        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${num}`);
        
        try {
            const sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                browser: ["Chrome (Linux)", "", ""]
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) res.json({ code });
            }

            sock.ev.on('creds.update', saveCreds);
            sock.ev.on('connection.update', async (s) => {
                if (s.connection === "open") {
                    console.log("---------------------------------------"); // Line Breaker
                    console.log(`[SUCCESS] Connected to: ${num}`);
                    
                    const creds = JSON.parse(fs.readFileSync(`./temp/${num}/creds.json`));
                    const sessionID = Buffer.from(JSON.stringify(creds)).toString('base64');
                    
                    await sock.sendMessage(sock.user.id, { 
                        text: `*𝕿𝖔𝖝𝖎𝖈.𝖆.𝖓.𝖙-MD SESSION ID*\n\n_Keep this safe!_\n\n*ID:* Toxicant;;${sessionID}` 
                    });
                    
                    // Cleanup temp folder after success
                    setTimeout(() => { fs.rmSync(`./temp/${num}`, { recursive: true, force: true }); }, 10000);
                }
            });
        } catch (e) {
            res.status(500).json({ error: "Socket Error" });
        }
    });

    app.listen(port, () => {
        console.log("=======================================");
        console.log(`TOXICANT-MD SERVER: http://localhost:${port}`);
        console.log("=======================================");
    });
}

module.exports = { startWeb };
