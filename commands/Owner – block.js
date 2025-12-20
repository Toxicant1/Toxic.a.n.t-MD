module.exports = {
    name: "block",
    description: "Block a number (owner only)",
    execute: async (msg, args, bot) => {
        if (!args[0]) return "❌ Usage: .block <number>";
        // Placeholder
        return `✅ Number ${args[0]} blocked!`;
    }
};