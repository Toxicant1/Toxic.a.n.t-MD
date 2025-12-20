module.exports = {

    // =======
    sticker: async (msg, args, bot) => {
        return `🖼️ *TOXIC.a.n.t MD* | Sticker generated from your image or video`;
    },

    // =======
    smeme: async (msg, args, bot) => {
        return `😂 *TOXIC.a.n.t MD* | Meme sticker created from text: ${args.join(" ")}`;
    },

    // =======
    photo: async (msg, args, bot) => {
        return `📸 *TOXIC.a.n.t MD* | Photo processed successfully`;
    },

    // =======
    mp4: async (msg, args, bot) => {
        return `🎥 *TOXIC.a.n.t MD* | Video converted to MP4\nSource: ${args[0]}`;
    },

    // =======
    retrieve: async (msg, args, bot) => {
        return `🔍 *TOXIC.a.n.t MD* | Media retrieved successfully\nURL: ${args[0]}`;
    },

    // =======
    vv: async (msg, args, bot) => {
        return `🎬 *TOXIC.a.n.t MD* | Video processed (VV) successfully`;
    },

    // =======
    vv2: async (msg, args, bot) => {
        return `🎬 *TOXIC.a.n.t MD* | Video processed (VV2) successfully`;
    },

    // =======
    screenshot: async (msg, args, bot) => {
        return `🖥️ *TOXIC.a.n.t MD* | Screenshot captured for URL: ${args[0]}`;
    },

    // =======
    mix: async (msg, args, bot) => {
        return `🎨 *TOXIC.a.n.t MD* | Media mixed successfully`;
    },

    // =======
    take: async (msg, args, bot) => {
        return `📸 *TOXIC.a.n.t MD* | Frame taken from video`;
    },

    // =======
    tweet: async (msg, args, bot) => {
        return `🐦 *TOXIC.a.n.t MD* | Tweet retrieved successfully\nURL: ${args[0]}`;
    },

    // =======
    quotely: async (msg, args, bot) => {
        return `✍️ *TOXIC.a.n.t MD* | Quote sticker created from text: ${args.join(" ")}`;
    }

};