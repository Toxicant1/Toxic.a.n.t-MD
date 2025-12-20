module.exports = {

    // =====================
    restart: async () => {
        return "♻️ *TOXIC.a.n.t MD* restarting… Please wait.";
    },

    // =====================
    admin: async () => {
        return "👑 *TOXIC.a.n.t MD* admin privileges updated.";
    },

    // =====================
    broadcast: async (msg, args) => {
        return `📢 *TOXIC.a.n.t MD* Broadcast sent:\n${args.join(" ")}`;
    },

    // =====================
    join: async () => {
        return "🔗 *TOXIC.a.n.t MD* joined group successfully.";
    },

    // =====================
    block: async () => {
        return "🚫 *TOXIC.a.n.t MD* user blocked.";
    },

    // =====================
    unblock: async () => {
        return "✅ *TOXIC.a.n.t MD* user unblocked.";
    },

    // =====================
    addsudo: async () => {
        return "➕ *TOXIC.a.n.t MD* sudo user added.";
    },

    // =====================
    remsudo: async () => {
        return "➖ *TOXIC.a.n.t MD* sudo user removed.";
    },

    // =====================
    listsudo: async () => {
        return "📜 *TOXIC.a.n.t MD* sudo list retrieved.";
    },

    // =====================
    hack: async (msg, args) => {
        return `
💀 *TOXIC.a.n.t MD – HACK *
━━━━━━━━━━━━━━━━━━
🔍 Target : ${args[0] || "unknown"}
📡 Breach : Establishing connection…
🔓 Firewall : Bypassed
💾 Data : Extracting packets…
⚠️ Status : SIMULATION ONLY
━━━━━━━━━━━━━━━━━━
✔️ Operation completed successfully.
        `;
    }

};