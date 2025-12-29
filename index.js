const { startWeb } = require("./pairing");

// ======= TOXIC.a.n.t MD SYSTEM INITIALIZER =======

console.log(`
  ___________________________________________
 |                                           |
 |         TOXIC.a.n.t MD - PAIRING          |
 |       Initializing Web Interface...       |
 |___________________________________________|
`);

/**
 * Handle unexpected errors to keep the server alive
 */
process.on("unhandledRejection", (reason, p) => {
    console.log(" [ERROR] Unhandled Rejection at: ", p, " reason: ", reason);
});

process.on("uncaughtException", (err) => {
    console.log(" [ERROR] Uncaught Exception: ", err);
});

// Start the clean pairing interface
try {
    startWeb();
} catch (error) {
    console.error(" [CRITICAL] Failed to start Web Service:", error);
}
