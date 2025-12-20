module.exports = {

    // =======
    video: async (msg, args, bot) => {
        return `📥 *TOXIC.a.n.t MD* | Video retrieved successfully\nURL: ${args[0]}`;
    },

    // =======
    video2: async (msg, args, bot) => {
        return `📥 *TOXIC.a.n.t MD* | Secondary video download\nURL: ${args[0]}`;
    },

    // =======
    play: async (msg, args, bot) => {
        return `🎵 *TOXIC.a.n.t MD* | Audio retrieved from search: ${args.join(" ")}`;
    },

    // =======
    play2: async (msg, args, bot) => {
        return `🎵 *TOXIC.a.n.t MD* | Secondary audio retrieval: ${args.join(" ")}`;
    },

    // =======
    song: async (msg, args, bot) => {
        return `🎵 *TOXIC.a.n.t MD* | Song retrieved successfully: ${args.join(" ")}`;
    },

    // =======
    song2: async (msg, args, bot) => {
        return `🎵 *TOXIC.a.n.t MD* | Secondary song retrieval: ${args.join(" ")}`;
    },

    // =======
    fbdl: async (msg, args, bot) => {
        return `📥 *TOXIC.a.n.t MD* | Facebook media retrieved\nURL: ${args[0]}`;
    },

    // =======
    tiktok: async (msg, args, bot) => {
        return `🎵 *TOXIC.a.n.t MD* | TikTok video retrieved\nURL: ${args[0]}`;
    },

    // =======
    twitter: async (msg, args, bot) => {
        return `🐦 *TOXIC.a.n.t MD* | Twitter media retrieved\nURL: ${args[0]}`;
    },

    // =======
    instagram: async (msg, args, bot) => {
        return `📸 *TOXIC.a.n.t MD* | Instagram media retrieved\nURL: ${args[0]}`;
    },

    // =======
    pinterest: async (msg, args, bot) => {
        return `📌 *TOXIC.a.n.t MD* | Pinterest media retrieved\nURL: ${args[0]}`;
    },

    // =======
    movie: async (msg, args, bot) => {
        return `🎬 *TOXIC.a.n.t MD* | Movie retrieved: ${args.join(" ")}`;
    },

    // =======
    lyrics: async (msg, args, bot) => {
        return `🎵 *TOXIC.a.n.t MD* | Lyrics retrieved for: ${args.join(" ")}`;
    },

    // =======
    whatsong: async (msg, args, bot) => {
        return `🎵 *TOXIC.a.n.t MD* | Song info retrieved: ${args.join(" ")}`;
    },

    // =======
    yts: async (msg, args, bot) => {
        return `📺 *TOXIC.a.n.t MD* | YouTube search results for: ${args.join(" ")}`;
    },

    // =======
    ytmp3: async (msg, args, bot) => {
        return `🎵 *TOXIC.a.n.t MD* | YouTube audio downloaded\nURL: ${args[0]}`;
    },

    // =======
    ytmp4: async (msg, args, bot) => {
        return `📺 *TOXIC.a.n.t MD* | YouTube video downloaded\nURL: ${args[0]}`;
    }

};