module.exports = {
    name: "prefix",
    description: "Change bot command prefix",
    execute: async (msg, args, bot) => {
        if (!args[0]) return "❌ Usage: .prefix <symbol>";
        bot.prefix = args[0];
        return `✅ Prefix changed to: ${bot.prefix}`;
    }
};