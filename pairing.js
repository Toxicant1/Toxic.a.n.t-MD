const express = require('express');
const path = require('path');
const pino = require('pino');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require('@whiskeysockets/baileys');
const fs = require('fs-extra');
const { File } = require('megajs'); // For Mega upload

const app = express();
const port = process.env.PORT || 3000;
const SESSION_PATH = path.join(__dirname, 'sessions');

async function startWeb() {
    app.get('/code', async (req, res) => {
        let num = req.query.number;
        if (!num) return res.status(400).json({ error: 'No number provided' });

        num = num.replace(/[^0-9]/g, '');

        // Ensure session directory is clean for new pairing
        if (fs.existsSync(SESSION_PATH)) {
            fs.emptyDirSync(SESSION_PATH);
        }

        const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);

        const sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
            },
            logger: pino({ level: 'fatal' }),
            printQRInTerminal: false,
            browser: ["TOXIC-MD", "Chrome", "1.0.0"], 
        });

        // Trigger pairing code request
        try {
            if (!sock.authState.creds.registered) {
                await delay(2000); 
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    res.json({ code });
                }
            }
        } catch (err) {
            console.error("Pairing Error:", err);
            if (!res.headersSent) res.status(500).json({ error: "Try again" });
        }

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === 'open') {
                await delay(5000);
                console.log(`✅ ${num} Connected Successfully`);

                // Get the creds file to send to user/Mega
                const credsPath = path.join(SESSION_PATH, 'creds.json');
                const sessionBuffer = fs.readFileSync(credsPath);
                
                // Logic to send the Session ID back to the user via WhatsApp
                const sessionBase64 = sessionBuffer.toString('base64');
                const sessionId = `TOXIC-MD;;;${sessionBase64}`; 

                await sock.sendMessage(sock.user.id, { 
                    text: `*✅ TOXIC.A.N.T MD CONNECTED*\n\n*Session ID:*\n${sessionId}\n\n_Keep this ID safe and use it in your config.js_` 
                });

                // Close this temporary pairing socket so the main bot can take over
                await delay(2000);
                process.exit(0); 
            }

            if (connection === 'close') {
                const reason = lastDisconnect?.error?.output?.statusCode;
                if (reason !== DisconnectReason.loggedOut) {
                    // Re-run the web logic if disconnected prematurely
                }
            }
        });
    });

    app.listen(port, () => {
        console.log(`🌐 TOXIC.a.n.t MD SERVER ONLINE ON PORT ${port}`);
    });
}

module.exports = { startWeb };
