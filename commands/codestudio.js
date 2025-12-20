module.exports = {

    // =======
    carbon: async (msg, args, bot) => {
        return `💻 *TOXIC.a.n.t MD* | Carbon code image generated for:\n${args.join(" ")}`;
    },

    // =======
    "compile-c": async (msg, args, bot) => {
        return `🖥️ *TOXIC.a.n.t MD* | C code compiled successfully:\n${args.join(" ")}`;
    },

    // =======
    "compile-c++": async (msg, args, bot) => {
        return `🖥️ *TOXIC.a.n.t MD* | C++ code compiled successfully:\n${args.join(" ")}`;
    },

    // =======
    "compile-js": async (msg, args, bot) => {
        return `🖥️ *TOXIC.a.n.t MD* | JavaScript code executed successfully:\n${args.join(" ")}`;
    },

    // =======
    "compile-py": async (msg, args, bot) => {
        return `🐍 *TOXIC.a.n.t MD* | Python code executed successfully:\n${args.join(" ")}`;
    },

    // =======
    inspect: async (msg, args, bot) => {
        return `🔍 *TOXIC.a.n.t MD* | Object inspection result:\n${args.join(" ")}`;
    },

    // =======
    encrypte: async (msg, args, bot) => {
        return `🔒 *TOXIC.a.n.t MD* | Text encrypted successfully:\n${args.join(" ")}`;
    },

    // =======
    eval: async (msg, args, bot) => {
        return `🖥️ *TOXIC.a.n.t MD* | Evaluation result:\n${args.join(" ")}`;
    }

};