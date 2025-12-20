const { ownerNumber, prefix } = require("./config");

function startBot() {
    console.log("🤖 Toxic.a.n.t MD v1 started!");
    console.log("Commands ready: Settings, Owner, AI, Group, System, Extras, Sticker");
}

// Minimal command handler (expandable)
function handleMessage(msg) {
    const { body, from } = msg;

    if (!body.startsWith(prefix)) return;

    const command = body.slice(prefix.length).split(" ")[0];

    switch (command) {
        // System commands
        case "menu":
            return "📜 Toxic.a.n.t MD Commands:\n- Settings\n- Owner\n- AI\n- Group\n- System\n- Extras\n- Sticker";
        case "ping":
            return "🏓 Pong!";
        case "alive":
            return "🤖 Toxic.a.n.t MD is online and running!";
        // Owner-only
        case "restart":
            if (from !== ownerNumber) return "❌ Only owner can restart!";
            process.exit(1);
            break;
        default:
            return "❌ Unknown command!";
    }
}

module.exports = { startBot, handleMessage };