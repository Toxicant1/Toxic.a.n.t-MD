const express = require('express');
const router = express.Router();
// ... keep your require imports here ...

async function getPairingCode(req, res) {
    let num = req.query.number;
    // ... paste your existing pairing logic here (the sock, creds, etc.) ...
}

router.get('/code', getPairingCode);

module.exports = router; // Export the router, NOT a new app.listen
