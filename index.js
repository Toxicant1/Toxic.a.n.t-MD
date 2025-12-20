const { startPairing, startWeb } = require("./pairing");
const { startBot } = require("./main");

// Start web pairing page
startWeb();

// Start WhatsApp bot connection
startPairing();

// Start command handler
startBot();