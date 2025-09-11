const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/checkoutController');

router.post('/create-session', createCheckoutSession);

module.exports = router;


