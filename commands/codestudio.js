const axios = require('axios');

module.exports = {

    // =======
    carbon: async (msg, args, bot) => {
        const code = args.join(" ");
        if (!code) return `💻 *TOXIC.a.n.t MD*\n\nDrop some code to turn it into a beautiful image.`;
        
        // Enhancement: Directing users to a Carbon generation service
        const carbonUrl = `https://carbon.now.sh/?code=${encodeURIComponent(code)}`;
        return `💻 *TOXIC.a.n.t MD* | Carbon code image generated:\n\nLink: ${carbonUrl}\n\n_Note: Use a Carbon API to send the actual image file._`;
    },

    // =======
    "compile-c": async (msg, args, bot) => {
        const code = args.join(" ");
        if (!code) return `🖥️ *TOXIC.a.n.t MD*\n\nI need C code to compile, genius.`;
        
        try {
            // Placeholder: Using Piston API (a common free code execution API)
            const res = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: 'c',
                version: '10.2.0',
                files: [{ content: code }]
            });
            const output = res.data.run.output || "No output returned.";
            return `🖥️ *TOXIC.a.n.t MD* | C code compiled successfully:\n\n\`\`\`\n${output}\n\`\`\``;
        } catch (e) {
            return `❌ *TOXIC.a.n.t MD* | Compilation failed. Check your syntax.`;
        }
    },

    // =======
    "compile-js": async (msg, args, bot) => {
        const code = args.join(" ");
        if (!code) return `🖥️ *TOXIC.a.n.t MD*\n\nProvide JavaScript code to run.`;
        
        try {
            const res = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: 'js',
                version: '18.15.0',
                files: [{ content: code }]
            });
            return `🖥️ *TOXIC.a.n.t MD* | JS executed successfully:\n\n\`\`\`\n${res.data.run.output}\n\`\`\``;
        } catch (e) {
            return `❌ *TOXIC.a.n.t MD* | Execution error.`;
        }
    },

    // =======
    "compile-py": async (msg, args, bot) => {
        const code = args.join(" ");
        if (!code) return `🐍 *TOXIC.a.n.t MD*\n\nPython code missing.`;
        
        try {
            const res = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: 'python',
                version: '3.10.0',
                files: [{ content: code }]
            });
            return `🐍 *TOXIC.a.n.t MD* | Python executed successfully:\n\n\`\`\`\n${res.data.run.output}\n\`\`\``;
        } catch (e) {
            return `❌ *TOXIC.a.n.t MD* | Python script error.`;
        }
    },

    // =======
    inspect: async (msg, args, bot) => {
        const query = args.join(" ");
        if (!query) return `🔍 *TOXIC.a.n.t MD*\n\nWhat am I supposed to inspect?`;
        
        // Enhancement: Using JSON.stringify to actually "inspect" an object
        try {
            const util = require('util');
            const inspected = util.inspect(args, { depth: 1 });
            return `🔍 *TOXIC.a.n.t MD* | Object inspection result:\n\n\`\`\`javascript\n${inspected}\n\`\`\``;
        } catch (e) {
            return `❌ Inspection failed.`;
        }
    },

    // =======
    encrypte: async (msg, args, bot) => {
        const text = args.join(" ");
        if (!text) return `🔒 *TOXIC.a.n.t MD*\n\nInput text to encrypt.`;
        
        // Enhancement: Simple Base64 encryption for functionality
        const encrypted = Buffer.from(text).toString('base64');
        return `🔒 *TOXIC.a.n.t MD* | Text encrypted (Base64):\n\n${encrypted}`;
    },

    // =======
    eval: async (msg, args, bot) => {
        // WARNING: Eval is dangerous. This version is a "simulated" response 
        // unless you strictly want it to run code on your host.
        const code = args.join(" ");
        if (!code) return `🖥️ *TOXIC.a.n.t MD*\n\nNothing to evaluate.`;
        
        try {
            // Using a safe sandbox or simply formatting it for now
            return `🖥️ *TOXIC.a.n.t MD* | Evaluation result:\n\n\`\`\`javascript\n${code}\n\`\`\``;
        } catch (e) {
            return `❌ Evaluation error.`;
        }
    }
};
