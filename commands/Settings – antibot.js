module.exports = {
    name: "antibot",
    description: "Toggle anti-bot messages",
    execute: async (msg, args, bot) => {
        bot.settings.antibot = !bot.settings.antibot;
        return `✅ Anti-bot is now ${bot.settings.antibot ? "ON" : "OFF"}`;
    }
};