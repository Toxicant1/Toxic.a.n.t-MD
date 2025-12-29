const axios = require('axios');

/**
 * HELPER: imageMaker
 * Connects to a styling API to generate your requested design.
 */
async function imageMaker(style, text) {
    try {
        // Using a common image-maker API endpoint
        // Replace 'gifted' with your actual API key if you have one
        const apiUrl = `https://api.giftedtech.my.id/api/maker/${style}?apikey=gifted&text=${encodeURIComponent(text)}`;
        
        // Check if the API is reachable
        const check = await axios.head(apiUrl);
        if (check.status === 200) return apiUrl;
        return null;
    } catch (e) {
        return null;
    }
}

module.exports = {

    // =======
    hacker: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `🖌️ *TOXIC.a.n.t MD*\n\nI can't hack a ghost. Give me some text!`;

        const url = await imageMaker('hacker', text);
        if (!url) return `❌ *TOXIC.a.n.t MD* | Hacker style generation failed.`;

        return `🖌️ *TOXIC.a.n.t MD* | Hacker-style image generated for: ${text}\n🔗 Link: ${url}\nCaption: TOXIC.a.n.t MD generated`;
    },

    // =======
    graffiti: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `🎨 *TOXIC.a.n.t MD*\n\nProvide text to tag the wall!`;

        const url = await imageMaker('graffiti', text);
        return url 
            ? `🎨 *TOXIC.a.n.t MD* | Graffiti-style design made for: ${text}\n🔗 Link: ${url}`
            : `❌ *TOXIC.a.n.t MD* | Graffiti service is offline.`;
    },

    // =======
    cat: async (msg, args, bot) => {
        const text = args.join(" ");
        // Fallback to a random cat if no text is provided
        const url = text 
            ? await imageMaker('cat-style', text)
            : 'https://cataas.com/cat';

        return `🐱 *TOXIC.a.n.t MD* | Cat image styled for: ${text || 'Random'}\n🔗 Link: ${url}`;
    },

    // =======
    gold: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `🥇 *TOXIC.a.n.t MD*\n\nInput text to turn into gold.`;

        const url = await imageMaker('gold-text', text);
        return `🥇 *TOXIC.a.n.t MD* | Gold text/logo generated for: ${text}\n🔗 Link: ${url || 'Error generating gold'}`;
    },

    // =======
    naruto: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `🍥 *TOXIC.a.n.t MD*\n\nBelieve it! Give me a name for the logo.`;

        const url = await imageMaker('naruto', text);
        return `🍥 *TOXIC.a.n.t MD* | Naruto-style logo created for: ${text}\n🔗 Link: ${url || 'Hidden Leaf API Error'}`;
    },

    // =======
    typography: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `🔤 *TOXIC.a.n.t MD*\n\nI need text for the typography design.`;

        const url = await imageMaker('typography', text);
        return `🔤 *TOXIC.a.n.t MD* | Typography-style design created for: ${text}\n🔗 Link: ${url || 'Model error'}`;
    },

    // =======
    "1917": async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `🕰️ *TOXIC.a.n.t MD*\n\nRetro style requires a prompt.`;

        const url = await imageMaker('1917', text);
        return `🕰️ *TOXIC.a.n.t MD* | 1917-style retro design made for: ${text}\n🔗 Link: ${url || 'Time machine broken'}`;
    }

};
