const { makeWASocket, useSingleFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const { state, saveState } = useSingleFileAuthState("./session/session.json");
const express = require("express");
const qrcode = require("qrcode");

const app = express();

let sock;

// Start WhatsApp socket
async function startPairing() {
    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('connection.update', async (update) => {
        if (update.qr) {
            // Convert QR to image for web
            const qrImage = await qrcode.toDataURL(update.qr);
            pairingQR = qrImage;
        }

        if (update.connection === 'open') {
            console.log("✅ WhatsApp Connected!");
            // You can generate session string here if needed
        }

        if (update.lastDisconnect) {
            const reason = update.lastDisconnect.error?.output?.statusCode;
            if (reason === DisconnectReason.restartRequired) {
                startPairing();
            }
        }
    });

    sock.ev.on('creds.update', saveState);
}

// Start pairing web page
function startWeb() {
    app.get("/", async (req, res) => {
        if (!pairingQR) return res.send("QR not ready. Refresh in a few seconds.");
        res.send(`<h2>Scan this QR with your WhatsApp</h2><img src="${pairingQR}" />`);
    });

    app.listen(3000, () => console.log(`🌐 Pairing server running on http://localhost:3000`));
}

module.exports = { startPairing, startWeb };