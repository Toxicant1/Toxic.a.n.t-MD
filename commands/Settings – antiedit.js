module.exports = {
    name: "antiedit",
    description: "Toggle anti-edit messages",
    execute: async (msg, args, bot) => {
        bot.settings.antiedit = !bot.settings.antiedit;
        return `✅ Anti-edit is now ${bot.settings.antiedit ? "ON" : "OFF"}`;
    }
};