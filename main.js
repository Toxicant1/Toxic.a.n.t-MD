const {
    default: makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const { ownerNumber, prefix } = require("./config");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const sock = makeWASocket({
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        logger: pino({ level: "fatal" }),
        browser: ["Toxic.a.n.t MD", "Chrome", "1.0.0"],
    });

    sock.ev.on("creds.update", saveCreds);

    console.log("🤖 Toxic.a.n.t MD v1 started!");
    console.log("Commands ready: Settings, Owner, AI, Group, System, Extras, Sticker");

    // 👇 THIS is the missing link
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const body =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            "";

        if (!body.startsWith(prefix)) return;

        const command = body.slice(prefix.length).trim().split(" ")[0];

        let reply;

        switch (command) {
            case "menu":
                reply =
                    "📜 *Toxic.a.n.t MD Commands*\n" +
                    "- Settings\n- Owner\n- AI\n- Group\n- System\n- Extras\n- Sticker";
                break;

            case "ping":
                reply = "🏓 Pong!";
                break;

            case "alive":
                reply = "🤖 Toxic.a.n.t MD is online and running!";
                break;

            case "restart":
                if (!from.includes(ownerNumber)) {
                    reply = "❌ Only owner can restart!";
                } else {
                    reply = "♻️ Restarting bot...";
                    await sock.sendMessage(from, { text: reply });
                    process.exit(1);
                }
                break;

            default:
                reply = "❌ Unknown command!";
        }

        if (reply) {
            await sock.sendMessage(from, { text: reply });
        }
    });

    sock.ev.on("connection.update", (update) => {
        if (update.connection === "open") {
            console.log("🔥 WhatsApp connected successfully");
        }
        if (update.connection === "close") {
            const reason = update.lastDisconnect?.error?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log("❌ Logged out. Delete session & re-pair.");
            }
        }
    });
}

module.exports = { startBot };