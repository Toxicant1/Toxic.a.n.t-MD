const { startRaven } = require('./main');
const { startWeb } = require('./pairing');

async function initiate() {
    try {
        console.log("⚙️ Initializing pairing server...");
        startWeb(); // Starts your pairing logic
        
        console.log("⚙️ Starting WhatsApp connection...");
        await startRaven();
    } catch (e) {
        console.error("Critical Start Error:", e);
    }
}

initiate();

// Keep process alive
process.on("unhandledRejection", (err) => console.log("Caught Rejection: ", err));
process.on("uncaughtException", (err) => console.log("Caught Exception: ", err));
