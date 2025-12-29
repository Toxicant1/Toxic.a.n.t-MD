const { startWeb } = require('./pairing');

console.log(`
  ___________________________________________
 |                                           |
 |         TOXIC.a.n.t MD - STARTING         |
 |___________________________________________|
`);

process.on('unhandledRejection', (reason) => {
    console.log('[ERROR] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.log('[ERROR] Uncaught Exception:', err);
});

startWeb();