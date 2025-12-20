module.exports = {
    name: "antidelete",
    description: "Toggle anti-delete messages",
    execute: async (msg, args, bot) => {
        bot.settings.antidelete = !bot.settings.antidelete;
        return `✅ Anti-delete is now ${bot.settings.antidelete ? "ON" : "OFF"}`;
    }
};