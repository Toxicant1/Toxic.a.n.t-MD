const path = require('path');
const fs = require('fs');
const config = require('./config');
const { smsg } = require('./lib/ravenfunc');

const commands = new Map();

// 1. Load all command files from /commands
const readCommands = () => {
    const cmdPath = path.join(__dirname, 'commands');
    const files = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));
    
    for (const file of files) {
        const command = require(path.join(cmdPath, file));
        if (command.name) {
            commands.set(command.name, command);
        }
    }
    console.log(`☣️ TOXIC-MD: Loaded ${commands.size} command modules.`);
};

readCommands();

// 2. Export the message handler
module.exports = async (client, m, chatUpdate, store) => {
    try {
        // Detect body from different message types (Text, Image, Video)
        const body = (m.mtype === 'conversation') ? m.message.conversation : 
                     (m.mtype === 'extendedTextMessage') ? m.message.extendedTextMessage.text : 
                     (m.mtype === 'imageMessage') ? m.message.imageMessage.caption : 
                     (m.mtype === 'videoMessage') ? m.message.videoMessage.caption : '';
        
        const prefix = config.PREFIX;
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const text = args.join(' ');

        // Log the command received in the terminal
        if (isCmd) {
            console.log(`[ COMMAND ] From: ${m.sender} | Command: ${command}`);
        }

        // Execute the command if it exists
        const cmd = commands.get(command);
        if (cmd) {
            await cmd.start(client, m, { args, text, prefix, command });
        }
    } catch (err) {
        console.error("Toxic Handler Error:", err);
    }
};
