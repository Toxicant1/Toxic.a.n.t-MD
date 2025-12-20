module.exports = {
    name: "unblock",
    description: "Unblock a number (owner only)",
    execute: async (msg, args, bot) => {
        if (!args[0]) return "❌ Usage: .unblock <number>";
        // Placeholder
        return `✅ Number ${args[0]} unblocked!`;
    }
};