module.exports = {
    name: "mode",
    description: "Change bot mode (public/private)",
    execute: async (msg, args, bot) => {
        if (!args[0]) return "❌ Usage: .mode <public/private>";
        const mode = args[0].toLowerCase();
        if (mode !== "public" && mode !== "private") return "❌ Invalid mode!";
        bot.mode = mode;
        return `✅ Mode changed to ${bot.mode}`;
    }
};