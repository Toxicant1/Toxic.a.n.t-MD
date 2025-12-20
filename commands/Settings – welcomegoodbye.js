module.exports = {
    name: "welcomegoodbye",
    description: "Toggle welcome/goodbye messages",
    execute: async (msg, args, bot) => {
        bot.settings.welcomegoodbye = !bot.settings.welcomegoodbye;
        return `✅ Welcome/Goodbye messages are now ${bot.settings.welcomegoodbye ? "ON" : "OFF"}`;
    }
};