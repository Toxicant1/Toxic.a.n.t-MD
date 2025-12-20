module.exports = {
    name: "anticall",
    description: "Toggle anti-call",
    execute: async (msg, args, bot) => {
        bot.settings.anticall = !bot.settings.anticall;
        return `✅ Anti-call is now ${bot.settings.anticall ? "ON" : "OFF"}`;
    }
};