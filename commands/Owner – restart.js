const { ownerNumber } = require("../../config");

module.exports = {
    name: "restart",
    description: "Restart the bot (owner only)",
    execute: async (msg, args, bot) => {
        if (msg.from !== ownerNumber) return "❌ Only the owner can use this!";
        process.exit(1);
    }
};