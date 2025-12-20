module.exports = {

    // =====================
    weather: async (msg, args) => {
        return `🌤️ *TOXIC.a.n.t MD* Weather for ${args.join(" ")}`;
    },

    // =====================
    github: async (msg, args) => {
        return `🐙 *TOXIC.a.n.t MD* GitHub user: ${args.join(" ")}`;
    },

    // =====================
    gitclone: async () => {
        return "📂 *TOXIC.a.n.t MD* Repository cloned.";
    },

    // =====================
    removebg: async () => {
        return "🧽 *TOXIC.a.n.t MD* Background removed.";
    },

    // =====================
    remini: async () => {
        return "✨ *TOXIC.a.n.t MD* Image enhanced.";
    },

    // =====================
    tts: async (msg, args) => {
        return `🗣️ *TOXIC.a.n.t MD* Text to speech:\n${args.join(" ")}`;
    },

    // =====================
    trt: async (msg, args) => {
        return `🌍 *TOXIC.a.n.t MD* Translation:\n${args.join(" ")}`;
    },

    // =====================
    calc: async (msg, args) => {
        return `🧮 *TOXIC.a.n.t MD* Calculation result:\n${args.join(" ")}`;
    }

};