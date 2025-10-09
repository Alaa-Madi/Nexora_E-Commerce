const express = require('express');
const router = express.Router();
const { createCheckoutSession, handleWebhook, getUserOrders, testEmail, createOrder } = require('../controllers/checkoutController');

router.post('/create-session', createCheckoutSession);
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);
router.get('/orders/:userId', getUserOrders);
router.get('/test-email', testEmail);
router.post('/create-order', createOrder);

module.exports = router;


