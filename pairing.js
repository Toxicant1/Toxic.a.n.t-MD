const express = require('express');
const router = express.Router();
const { startRaven, getPairingStatus } = require('./main');

// GET /code?number=2547XXXXXXXX
router.get('/code', async (req, res) => {
    // Check if a number was provided in the URL, clean it up
    let number = (req.query.number || '').replace(/[^0-9]/g, '');

    // Fallback: If no number is provided in the URL, use your default number
    if (!number) {
        number = '254743540296';
    }

    const status = getPairingStatus();

    // Already have a code ready for this number
    if (status.code && status.number === number) {
        return res.json({
            status: 'ready',
            code: status.code,
            instructions: 'Open WhatsApp > Linked Devices > Link with phone number, then enter this code.'
        });
    }

    // A request is in flight, tell the user to refresh
    if (status.requested) {
        return res.json({ status: 'pending', message: 'Generating code, refresh this page in 5 seconds.' });
    }

    // Kick off a fresh connection attempt for this number
    startRaven(number).catch(e => console.log("Pairing start error:", e.message));
    return res.json({ status: 'requesting', message: 'Requesting pairing code, refresh this page in 5-8 seconds.' });
});

module.exports = router;
