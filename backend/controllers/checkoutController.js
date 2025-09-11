require('dotenv').config();
const Stripe = require('stripe');

let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Missing STRIPE_SECRET_KEY in environment');
  }
  stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');
} catch (e) {
  console.error('Failed to initialize Stripe SDK:', e);
}

// POST /api/checkout/create-session
exports.createCheckoutSession = async (req, res) => {
  try {
    if (!process.env.CLIENT_URL) {
      return res.status(500).json({ error: 'Server misconfiguration: CLIENT_URL is not set' });
    }
    if (!stripe) {
      return res.status(500).json({ error: 'Server misconfiguration: Stripe SDK not initialized' });
    }
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    const lineItems = items.map((it) => {
      // Convert relative URLs to absolute URLs for Stripe
      let imageUrl = it.image;
      if (imageUrl && imageUrl.startsWith('/')) {
        imageUrl = process.env.CLIENT_URL + imageUrl;
      }
      
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: it.title,
            images: imageUrl ? [imageUrl] : undefined,
          },
          unit_amount: Math.max(0, Math.round(Number(it.price) * 100)),
        },
        quantity: Number(it.quantity || 1),
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: process.env.CLIENT_URL + '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.CLIENT_URL + '/checkout/cancel',
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Failed to create checkout session';
    console.error('Stripe session error:', message, err && err.raw ? err.raw : '');
    return res.status(500).json({ error: message });
  }
};


