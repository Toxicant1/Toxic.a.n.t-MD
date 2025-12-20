module.exports = {
    name: "antilink",
    description: "Toggle anti-link messages",
    execute: async (msg, args, bot) => {
        bot.settings.antilink = !bot.settings.antilink;
        return `✅ Anti-link is now ${bot.settings.antilink ? "ON" : "OFF"}`;
    }
};