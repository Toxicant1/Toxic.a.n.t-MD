const {
    default: ravenConnect,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");
const { File } = require('megajs');
const fs = require("fs-extra");
const pino = require("pino");
const path = require('path');
const config = require('./config');

let client = null;
let pairingCode = null;
let pairingNumber = null;
let pairingRequested = false;

async function startRaven(numberForPairing) {
    const sessionsDir = path.join(__dirname, 'sessions');

    // --- MEGA SESSION DOWNLOADER (only if you already have a SESSION_ID) ---
    if (!fs.existsSync(path.join(sessionsDir, 'creds.json')) &&
        config.SESSION_ID && config.SESSION_ID !== "PASTE_YOUR_MEGA_ID_HERE") {
        const sessdata = config.SESSION_ID.replace("TOXIC-MD;;;", "");
        const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
        await new Promise((resolve) => {
            filer.download((err, data) => {
                if (err) {
                    console.log("Mega Download Error:", err.message);
                    return resolve();
                }
                fs.ensureDirSync(sessionsDir);
                fs.writeFileSync(path.join(sessionsDir, 'creds.json'), data);
                console.log("✅ Session downloaded successfully");
                resolve();
            });
        });
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionsDir);
    const { version } = await fetchLatestBaileysVersion();
    const usingPairingCode = !state.creds.registered && !!numberForPairing;

    client = ravenConnect({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: !usingPairingCode,
        browser: ["TOXIC-MD", "Chrome", "1.0.0"],
        auth: state
    });

    // Request the pairing code once the socket is up (must NOT be registered yet)
    if (usingPairingCode) {
        pairingRequested = true;
        const cleanNumber = numberForPairing.replace(/[^0-9]/g, '');
        setTimeout(async () => {
            try {
                const code = await client.requestPairingCode(cleanNumber);
                pairingCode = code;
                pairingNumber = cleanNumber;
                console.log(`🔑 Pairing code for ${cleanNumber}: ${code}`);
            } catch (e) {
                console.log("Pairing code request failed:", e.message);
                pairingRequested = false;
            }
        }, 3000);
    }

    client.ev.on("creds.update", saveCreds);

    client.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            pairingCode = null;
            pairingRequested = false;
            if (shouldReconnect) {
                console.log("♻️ Connection closed, reconnecting...");
                startRaven();
            } else {
                console.log("🚪 Logged out. Delete /sessions and pair again.");
            }
        } else if (connection === 'open') {
            pairingCode = null;
            pairingRequested = false;
            console.log("✅ TOXIC-MD is online and connected!");
        }
    });

    // --- SINGLE message handler (the old file had this duplicated/broken) ---
    client.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            let mek = chatUpdate.messages[0];
            if (!mek || !mek.message) return;

            if (config.AUTO_VIEW_STATUS === 'TRUE' && mek.key.remoteJid === "status@broadcast") {
                await client.readMessages([mek.key]);
            }

            const { smsg } = require('./lib/ravenfunc');
            const m = smsg(client, mek);

            const toxicHandler = require('./toxic');
            await toxicHandler(client, m, chatUpdate);
        } catch (err) {
            console.log("Error in Main Upsert:", err);
        }
    });

    // Anticall
    client.ev.on('call', async (call) => {
        if (config.ANTICALL === 'TRUE') {
            await client.rejectCall(call[0].id, call[0].from);
            await client.sendMessage(call[0].from, { text: "⚠️ Calls are auto-rejected by TOXIC-MD." });
        }
    });

    return client;
}

function getPairingStatus() {
    return { code: pairingCode, number: pairingNumber, requested: pairingRequested };
}

module.exports = { startRaven, getPairingStatus };
