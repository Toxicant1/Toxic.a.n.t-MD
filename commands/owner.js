module.exports = {

    // =====================
    restart: async () => {
        return "♻️ *SYSTEM REBOOT* \n`TOXIC.a.n.t MD` is cycling power... Standby.";
    },

    // =====================
    admin: async () => {
        return "👑 *PRIVILEGE ESCALATION*\nSudo rights verified for `TOXIC.a.n.t MD`.";
    },

    // =====================
    broadcast: async (msg, args) => {
        const content = args.join(" ") || "No message provided.";
        return `📡 *GLOBAL TRANSMISSION*\n\n${content}\n\n_— Sent via TOXIC.a.n.t MD_`;
    },

    // =====================
    join: async () => {
        return "🔗 *GATEWAY ACCESSED*\nNode successfully linked to the group.";
    },

    // =====================
    block: async () => {
        return "🚫 *PROTOCOL BLACKLIST*\nUser access revoked. ID has been blacklisted.";
    },

    // =====================
    unblock: async () => {
        return "✅ *RESTRICTION LIFTED*\nUser access restored to the mainframe.";
    },

    // =====================
    addsudo: async () => {
        return "➕ *SUDO PROVISION*\nNew operator added to the root hierarchy.";
    },

    // =====================
    remsudo: async () => {
        return "➖ *SUDO REVOCATION*\nOperator credentials purged from system.";
    },

    // =====================
    listsudo: async () => {
        return "📜 *OPERATOR DIRECTORY*\nRetrieving authorized sudo list...";
    },

    // =====================
    hack: async (msg, args) => {
        const target = args[0] || "127.0.0.1";
        const progress = ["□□□□□", "■□□□□", "■■□□□", "■■■□□", "■■■■□", "■■■■■"];
        
        return `
⚡ *TOXIC.a.n.t SYSTEM INTRUSION*
────────────────────────
👤 *TARGET:* \`${target}\`
📡 *METHOD:* Brute-Force SSH / SQL-i
🔓 *BYPASS:* WAF Firewall Layer-7
────────────────────────
\`[${progress[2]}] Checking vulnerabilities...\`
\`[${progress[4]}] Cracking hash algorithm...\`
\`[${progress[5]}] Root access granted!\`

⚠️ *WARNING:* This is a **real** penetration test. Actual data was compromised.
────────────────────────
_Operation: SUCCESS_
        `;
    }

};
