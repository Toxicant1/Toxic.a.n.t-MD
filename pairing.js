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
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

function startWeb() {
    app.use(express.static('public'));

    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: "No number provided" });
        
        num = num.replace(/[^0-9]/g, ''); // Clean number

        // Ensure temp directory exists for Render
        if (!fs.existsSync('./temp')) fs.mkdirSync('./temp');

        console.log("---------------------------------------");
        console.log(`🚀 TRIGGERING CODE FOR: ${num}`);
        console.log("---------------------------------------");

        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${num}`);

        try {
            const sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                // UPDATED BROWSER TO FORCE TRIGGER
                browser: ["Ubuntu", "Chrome", "20.0.04"] 
            });

            if (!sock.authState.creds.registered) {
                await delay(3000); // Increased delay for server stability
                const code = await sock.requestPairingCode(num);
                
                if (!res.headersSent) {
                    res.json({ code: code });
                    console.log(`✅ CODE GENERATED: ${code}`);
                }
            }

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (s) => {
                const { connection, lastDisconnect } = s;
                
                if (connection === "open") {
                    console.log("---------------------------------------");
                    console.log(`🏆 SUCCESS: ${num} LINKED`);
                    console.log("---------------------------------------");

                    await delay(5000); // Wait for session files to write
                    const sessionFile = `./temp/${num}/creds.json`;
                    
                    if (fs.existsSync(sessionFile)) {
                        const creds = JSON.parse(fs.readFileSync(sessionFile));
                        const sessionID = Buffer.from(JSON.stringify(creds)).toString('base64');

                        await sock.sendMessage(sock.user.id, { 
                            text: `*𝕿𝖔𝖝𝖎𝖈.𝖆.𝖓.𝖙-MD SESSION ID*\n\n*ID:* Toxicant;;${sessionID}\n\n_Copy the ID above to deploy your bot._` 
                        });
                    }

                    // Auto-cleanup to save space on Render
                    setTimeout(() => { 
                        try { fs.rmSync(`./temp/${num}`, { recursive: true, force: true }); } catch(e) {}
                    }, 20000);
                }
                
                if (connection === "close") {
                    let reason = lastDisconnect?.error?.output?.statusCode;
                    if (reason !== DisconnectReason.loggedOut) {
                        // Handle unexpected closures here if needed
                    }
                }
            });

        } catch (e) {
            console.log("❌ SOCKET ERROR:", e);
            if (!res.headersSent) res.status(500).json({ error: "Internal Server Error" });
        }
    });

    app.listen(port, () => {
        console.log("=======================================");
        console.log(`   TOXICANT-MD IS LIVE ON PORT ${port}   `);
        console.log("=======================================");
    });
}

module.exports = { startWeb };
