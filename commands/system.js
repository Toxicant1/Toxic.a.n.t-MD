module.exports = {

    // =======
    owner: async (msg, args, bot) => {
        return `👑 *TOXIC.a.n.t MD* | Bot owner info displayed`;
    },

    // =======
    script: async (msg, args, bot) => {
        return `📜 *TOXIC.a.n.t MD* | Current bot script info:\n${args.join(" ")}`;
    },

    // =======
    menu: async (msg, args, bot) => {
        return `📋 *TOXIC.a.n.t MD* | Main menu displayed`;
    },

    // =======
    list: async (msg, args, bot) => {
        return `🗂️ *TOXIC.a.n.t MD* | List of available commands:\n${args.join(" ")}`;
    },

    // =======
    ping: async (msg, args, bot) => {
        return `🏓 *TOXIC.a.n.t MD* | Pong! Bot speed: ${args[0] || "N/A"} ms`;
    },

    // =======
    poll: async (msg, args, bot) => {
        return `📊 *TOXIC.a.n.t MD* | Poll created with options: ${args.join(", ")}`;
    },

    // =======
    alive: async (msg, args, bot) => {
        return `✅ *TOXIC.a.n.t MD* | Bot is online and running smoothly`;
    },

    // =======
    speed: async (msg, args, bot) => {
        return `⚡ *TOXIC.a.n.t MD* | Bot speed measured: ${args[0] || "N/A"} ms`;
    },

    // =======
    repo: async (msg, args, bot) => {
        return `📦 *TOXIC.a.n.t MD* | GitHub repository link: ${args[0]}`;
    },

    // =======
    runtime: async (msg, args, bot) => {
        return `⏱️ *TOXIC.a.n.t MD* | Bot runtime: ${args[0] || "N/A"}`;
    },

    // =======
    uptime: async (msg, args, bot) => {
        return `⏳ *TOXIC.a.n.t MD* | Uptime: ${args[0] || "N/A"}`;
    },

    // =======
    dp: async (msg, args, bot) => {
        return `🖼️ *TOXIC.a.n.t MD* | Display picture retrieved`;
    },

    // =======
    dlt: async (msg, args, bot) => {
        return `🗑️ *TOXIC.a.n.t MD* | Message deleted successfully`;
    },

    // =======
    mail: async (msg, args, bot) => {
        return `✉️ *TOXIC.a.n.t MD* | Mail sent to: ${args.join(" ")}`;
    },

    // =======
    inbox: async (msg, args, bot) => {
        return `📥 *TOXIC.a.n.t MD* | Inbox messages displayed`;
    }

};