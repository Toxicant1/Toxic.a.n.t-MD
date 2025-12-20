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
    // FIX: Serve the public folder and assets correctly
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: "No number provided" });

        num = num.replace(/[^0-9]/g, '');

        if (fs.existsSync(`./temp/${num}`)) {
            fs.rmSync(`./temp/${num}`, { recursive: true, force: true });
        }

        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${num}`);

        try {
            const sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }),
                browser: Browsers.ubuntu("Chrome"), // Use built-in stable browser
                connectTimeoutMs: 120000,
                defaultQueryTimeoutMs: 120000,
                syncFullHistory: false, // CRITICAL: Stop history sync to prevent link failure
                markOnlineOnConnect: true
            });

            // --- THE FIX FOR "COULDN'T CONNECT" ---
            // We must wait for the socket to stabilize BEFORE requesting the pairing code
            if (!sock.authState.creds.registered) {
                await delay(10000); // Give Render 10 seconds to establish the secure TLS tunnel
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
                    await delay(5000); 

                    const sessionFile = `./temp/${num}/creds.json`;
                    if (fs.existsSync(sessionFile)) {
                        const creds = JSON.parse(fs.readFileSync(sessionFile));
                        const sessionID = Buffer.from(JSON.stringify(creds)).toString('base64');

                        await sock.sendMessage(sock.user.id, {
                            text: `*𝕿𝖔𝖝𝖎𝖈.𝖆.𝖓.𝖙-MD SESSION ID*\n\n*ID:* Toxicant;;${sessionID}`
                        });
                    }

                    setTimeout(() => {
                        try { fs.rmSync(`./temp/${num}`, { recursive: true, force: true }); } catch(e) {}
                    }, 10000);
                }

                if (connection === 'close') {
                    let reason = lastDisconnect?.error?.output?.statusCode;
                    // If the link fails, clean up the folder so the user can try again fresh
                    if (reason !== DisconnectReason.loggedOut) {
                        console.log(`❌ Link failed (Code: ${reason}). Recommendation: Refresh site.`);
                    }
                }
            });

        } catch (e) {
            console.log("❌ ERROR:", e);
            if (!res.headersSent) res.status(500).json({ error: "Server Busy. Try again." });
        }
    });

    app.listen(port, () => {
        console.log(`TOXICANT-MD SERVER LIVE ON PORT ${port}`);
    });
}

module.exports = { startWeb };
