module.exports = {

    // =======
    approve: async (msg, args, bot) => {
        return `✅ *TOXIC.a.n.t MD* | User approved to join the group: ${args.join(" ")}`;
    },

    // =======
    reject: async (msg, args, bot) => {
        return `❌ *TOXIC.a.n.t MD* | User rejected from joining the group: ${args.join(" ")}`;
    },

    // =======
    promote: async (msg, args, bot) => {
        return `📈 *TOXIC.a.n.t MD* | User promoted to admin: ${args.join(" ")}`;
    },

    // =======
    demote: async (msg, args, bot) => {
        return `📉 *TOXIC.a.n.t MD* | Admin demoted: ${args.join(" ")}`;
    },

    // =======
    delete: async (msg, args, bot) => {
        return `🗑️ *TOXIC.a.n.t MD* | Message deleted successfully`;
    },

    // =======
    remove: async (msg, args, bot) => {
        return `❌ *TOXIC.a.n.t MD* | User removed from group: ${args.join(" ")}`;
    },

    // =======
    faker: async (msg, args, bot) => {
        return `🕵️ *TOXIC.a.n.t MD* | Fake user detected: ${args.join(" ")}`;
    },

    // =======
    foreigners: async (msg, args, bot) => {
        return `🌍 *TOXIC.a.n.t MD* | Foreign users detected in group`;
    },

    // =======
    close: async (msg, args, bot) => {
        return `🔒 *TOXIC.a.n.t MD* | Group closed for new messages`;
    },

    // =======
    open: async (msg, args, bot) => {
        return `🔓 *TOXIC.a.n.t MD* | Group opened for new messages`;
    },

    // =======
    closetime: async (msg, args, bot) => {
        return `⏰ *TOXIC.a.n.t MD* | Group temporarily closed for ${args[0]} minutes`;
    },

    // =======
    opentime: async (msg, args, bot) => {
        return `⏰ *TOXIC.a.n.t MD* | Group temporarily opened for ${args[0]} minutes`;
    },

    // =======
    tagall: async (msg, args, bot) => {
        return `📣 *TOXIC.a.n.t MD* | All members tagged`;
    },

    // =======
    hidetag: async (msg, args, bot) => {
        return `🤫 *TOXIC.a.n.t MD* | Hidden tag message sent`;
    },

    // =======
    kickall: async (msg, args, bot) => {
        return `⚡ *TOXIC.a.n.t MD* | All users kicked from the group`;
    },

    // =======
    addbadword: async (msg, args, bot) => {
        return `🚫 *TOXIC.a.n.t MD* | Bad word added: ${args.join(" ")}`;
    },

    // =======
    delbadword: async (msg, args, bot) => {
        return `🗑️ *TOXIC.a.n.t MD* | Bad word removed: ${args.join(" ")}`;
    },

    // =======
    listbadword: async (msg, args, bot) => {
        return `📋 *TOXIC.a.n.t MD* | Current bad words list displayed`;
    }

};