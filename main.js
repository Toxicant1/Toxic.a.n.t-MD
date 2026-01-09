const { 
    default: ravenConnect, 
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion 
} = require("@whiskeysockets/baileys");
const { File } = require('megajs');
const fs = require("fs-extra");
const pino = require("pino");
const config = require('./config');

async function startRaven() {
    // --- MEGA SESSION DOWNLOADER ---
    if (!fs.existsSync(__dirname + '/sessions/creds.json') && config.SESSION_ID) {
        const sessdata = config.SESSION_ID.replace("TOXIC-MD;;;", "");
        const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
        await new Promise((resolve) => {
            filer.download((err, data) => {
                if (err) return resolve(console.log("Mega Download Error"));
                fs.ensureDirSync(__dirname + '/sessions/');
                fs.writeFileSync(__dirname + '/sessions/creds.json', data);
                console.log("✅ Session downloaded successfully");
                resolve();
            });
        });
    }

    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/');
    const { version } = await fetchLatestBaileysVersion();

    const client = ravenConnect({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: true,
        browser: ["TOXIC-MD", "Safari", "1.0.0"],
        auth: state
    });

    client.ev.on("creds.update", saveCreds);

    client.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                startRaven(); // Auto-reconnect
            }
        } else if (connection === 'open') {
            console.log("✅ TOXIC-MD is online and connected!");
        }
    });

    // --- AUTOMATED FEATURES ---
    client.ev.on("messages.upsert", async (chatUpdate) => {
        let mek = chatUpdate.messages[0];
        if (!mek.message) return;

        // Auto Status View
        if (config.AUTO_VIEW_STATUS === 'TRUE' && mek.key.remoteJid === "status@broadcast") {
            await client.readMessages([mek.key]);
        }
    // --- MESSAGE HANDLER ---
    client.ev.on("messages.upsert", async (chatUpdate) => {
        try {
            let mek = chatUpdate.messages[0];
            if (!mek.message) return;

            // 1. Use the helper from your lib
            const { smsg } = require('./lib/ravenfunc');
            const m = smsg(client, mek); 
            
            // 2. Trigger your new TOXIC handler
            const toxicHandler = require("./toxic"); 
            await toxicHandler(client, m, chatUpdate); 

        } catch (err) {
            console.log("Error in Main Upsert:", err);
        }
    });


        // Call Command Handler (Example logic to link your commands folder)
        const m = require('./lib/ravenfunc').smsg(client, mek); // Using your existing lib helper
        require('./index')(client, m, chatUpdate); // Directs to command logic
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

module.exports = { startRaven };
