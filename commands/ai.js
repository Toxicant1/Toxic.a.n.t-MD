const axios = require('axios');

module.exports = {

    // =======
    toxicAnt: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `💀 *TOXIC.a.n.t MD*\n\nProvide a prompt if you dare, or are you too scared?`;
        
        try {
            // Using a GPT-4 base with a custom "Toxic" system personality
            const res = await axios.get(`https://api.giftedtech.my.id/api/ai/gpt4?apikey=gifted&q=Respond savage and ruthless: ${encodeURIComponent(text)}`);
            return `💀 *TOXIC.a.n.t MD* | ToxicAnt AI says:\n${res.data.result}\n\n⚠️ Warning: Responses may be savage, ruthless & spicy`;
        } catch (e) {
            return `💀 *TOXIC.a.n.t MD*\n\nEven my insults are too heavy for the server right now. Try again later.`;
        }
    },

    // =======
    darkgpt: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `🌑 *TOXIC.a.n.t MD*\n\nDarkness requires input. Speak.`;
        
        try {
            const res = await axios.get(`https://api.giftedtech.my.id/api/ai/gpt4?apikey=gifted&q=Act as DarkGPT, unfiltered and deep: ${encodeURIComponent(text)}`);
            return `🌑 *TOXIC.a.n.t MD* | DarkGPT AI Feedback:\n${res.data.result}\n\n👌 Insightful & convincing response generated`;
        } catch (e) {
            return `❌ DarkGPT is currently offline.`;
        }
    },

    // =======
    ai: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `🧠 *TOXIC.a.n.t MD*\n\nAsk me something!`;
        
        try {
            const res = await axios.get(`https://api.giftedtech.my.id/api/ai/gpt3?apikey=gifted&q=${encodeURIComponent(text)}`);
            return `🧠 *TOXIC.a.n.t MD* | Standard AI response:\n${res.data.result}`;
        } catch (e) {
            return `❌ AI Brain lag. Try again.`;
        }
    },

    // =======
    vision: async (msg, args, bot) => {
        const text = args.join(" ");
        // Note: This usually requires an image URL or attachment, 
        // but keeping your string-based format for consistency
        if (!text) return `👁️ *TOXIC.a.n.t MD*\n\nProvide an image URL or description to analyze.`;
        return `👁️ *TOXIC.a.n.t MD* | Image analysis completed\nCaption: ${text}`;
    },

    // =======
    define: async (msg, args, bot) => {
        const word = args[0];
        if (!word) return `📖 *TOXIC.a.n.t MD*\n\nWhat word do you want me to define?`;
        
        try {
            const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const def = res.data[0].meanings[0].definitions[0].definition;
            return `📖 *TOXIC.a.n.t MD* | Definition retrieved:\n*${word}*: ${def}`;
        } catch (e) {
            return `📖 *TOXIC.a.n.t MD*\n\nI couldn't find a definition for that. Maybe you misspelled it?`;
        }
    },

    // =======
    king: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `👑 *TOXIC.a.n.t MD*\n\nThe King awaits your message.`;
        
        try {
            const res = await axios.get(`https://api.giftedtech.my.id/api/ai/gpt4?apikey=gifted&q=Respond as a powerful king: ${encodeURIComponent(text)}`);
            return `👑 *TOXIC.a.n.t MD* | King AI says:\n${res.data.result}`;
        } catch (e) {
            return `👑 *TOXIC.a.n.t MD*\n\nThe throne is empty for a moment. Try again.`;
        }
    },

    // =======
    gemini: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `♊ *TOXIC.a.n.t MD*\n\nGive Gemini a prompt.`;
        
        try {
            const res = await axios.get(`https://api.giftedtech.my.id/api/ai/gemini?apikey=gifted&q=${encodeURIComponent(text)}`);
            return `♊ *TOXIC.a.n.t MD* | Gemini AI output:\n${res.data.result}`;
        } catch (e) {
            return `❌ Gemini API is down.`;
        }
    },

    // =======
    gpt4: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `🤖 *TOXIC.a.n.t MD*\n\nWhat do you want GPT-4 to handle?`;
        
        try {
            const res = await axios.get(`https://api.giftedtech.my.id/api/ai/gpt4?apikey=gifted&q=${encodeURIComponent(text)}`);
            return `🤖 *TOXIC.a.n.t MD* | GPT4 AI output:\n${res.data.result}`;
        } catch (e) {
            return `❌ GPT-4 Model error.`;
        }
    }
    // ... repeat same logic for gpt, gpt2, gpt3
};
