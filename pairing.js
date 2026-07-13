const express = require('express');
const router = express.Router();
const { startRaven, getPairingStatus } = require('./main');

// GET /code?number=2547XXXXXXXX  (digits only, country code, no + or spaces)
router.get('/code', async (req, res) => {
    const number = (req.query.number || '').replace(/[^0-9]/g, '');

    if (!number) {
        return res.status(400).json({
            error: 'Provide your number as ?number=2547XXXXXXXX (digits only, include country code, no +)'
        });
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
