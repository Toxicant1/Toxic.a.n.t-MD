module.exports = {

    // =======
    epl: async (msg, args, bot) => {
        return `⚽ *TOXIC.a.n.t MD* | English Premier League updates:\n${args.join(" ")}`;
    },

    // =======
    laliga: async (msg, args, bot) => {
        return `⚽ *TOXIC.a.n.t MD* | La Liga updates:\n${args.join(" ")}`;
    },

    // =======
    seriea: async (msg, args, bot) => {
        return `⚽ *TOXIC.a.n.t MD* | Serie A updates:\n${args.join(" ")}`;
    },

    // =======
    bundesliga: async (msg, args, bot) => {
        return `⚽ *TOXIC.a.n.t MD* | Bundesliga updates:\n${args.join(" ")}`;
    },

    // =======
    ligue1: async (msg, args, bot) => {
        return `⚽ *TOXIC.a.n.t MD* | Ligue 1 updates:\n${args.join(" ")}`;
    },

    // =======
    fixtures: async (msg, args, bot) => {
        return `📅 *TOXIC.a.n.t MD* | Upcoming football fixtures:\n${args.join(" ")}`;
    }

};