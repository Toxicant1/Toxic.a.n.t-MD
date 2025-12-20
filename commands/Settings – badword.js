module.exports = {
    name: "badword",
    description: "Toggle badword filter",
    execute: async (msg, args, bot) => {
        bot.settings.badword = !bot.settings.badword;
        return `✅ Badword filter is now ${bot.settings.badword ? "ON" : "OFF"}`;
    }
};