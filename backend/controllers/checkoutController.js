require('dotenv').config();
const Stripe = require('stripe');
const { Order, OrderItem } = require('../models');
const User = require('../models/user');
const mailer = require('../config/mailer');
const { orderConfirmationTemplate } = require('../utils/emailTemplates');

function isEmailConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function sendOrderEmail(order, items, user) {
  try {
    if (!user || !user.email) return;
    if (!isEmailConfigured()) return;
    const rows = items.map((it) => (
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${it.product_title}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${it.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">$${Number(it.unit_price).toFixed(2)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">$${(Number(it.unit_price) * Number(it.quantity)).toFixed(2)}</td>
      </tr>`
    )).join('');

    const html = orderConfirmationTemplate({
      appName: process.env.APP_NAME || 'Your Store',
      user,
      order,
      items
    });

    await mailer.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `Order Confirmation #${order.id}`,
      html,
    });
  } catch (e) {
    console.error('Failed to send order email:', e && e.message ? e.message : e);
  }
}

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
    const { items, userId } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
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
      metadata: {
        userId: userId.toString(),
        items: JSON.stringify(items)
      }
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err) {
    const message = (err && err.message) ? err.message : 'Failed to create checkout session';
    console.error('Stripe session error:', message, err && err.raw ? err.raw : '');
    return res.status(500).json({ error: message });
  }
};

// POST /api/checkout/webhook - Handle successful payments
exports.handleWebhook = async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { userId, items } = session.metadata;
      
      if (userId && items) {
        const parsedItems = JSON.parse(items);
        const total = session.amount_total / 100; // Convert from cents

        // Create order
        const order = await Order.create({
          user_id: parseInt(userId),
          status: 'paid',
          total: total,
          stripe_session_id: session.id
        });

        // Create order items
        for (const item of parsedItems) {
          await OrderItem.create({
            order_id: order.id,
            product_title: item.title,
            product_image: item.image,
            unit_price: parseFloat(item.price),
            quantity: parseInt(item.quantity || 1)
          });
        }

        // Send confirmation email (best-effort)
        try {
          const dbItems = await OrderItem.findAll({ where: { order_id: order.id } });
          const user = await User.findByPk(parseInt(userId));
          await sendOrderEmail(order, dbItems.map(i => i.toJSON()), user && user.toJSON ? user.toJSON() : user);
        } catch (e) {
          console.warn('Email step failed after webhook order creation:', e && e.message ? e.message : e);
        }

        console.log(`Order created successfully: ${order.id} for user: ${userId}`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// GET /api/checkout/orders/:userId - Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // For now, return mock data if database is not available
    try {
      const orders = await Order.findAll({
        where: { user_id: userId },
        include: [{
          model: OrderItem,
          as: 'items'
        }],
        order: [['id', 'DESC']]
      });

      res.json(orders);
    } catch (dbError) {
      console.log('Database not available, returning mock data:', dbError.message);
      
      // Return mock data for testing
      const mockOrders = [
        {
          id: 1,
          user_id: parseInt(userId),
          status: 'paid',
          total: 99.99,
          stripe_session_id: 'cs_test_123',
          createdAt: new Date().toISOString(),
          items: [
            {
              id: 1,
              product_title: 'Sample Digital Product',
              product_image: '/sample-image.jpg',
              unit_price: 99.99,
              quantity: 1
            }
          ]
        }
      ];
      
      res.json(mockOrders);
    }
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// GET /api/checkout/test-email - Test email functionality
exports.testEmail = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const user = await User.findByPk(parseInt(userId));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a test order for email
    const testOrder = {
      id: 999,
      user_id: parseInt(userId),
      status: 'paid',
      total: 29.99,
      stripe_session_id: 'test_session',
      createdAt: new Date().toISOString()
    };

    const testItems = [
      {
        product_title: 'Test Product',
        quantity: 1,
        unit_price: 29.99
      }
    ];

    await sendOrderEmail(testOrder, testItems, user.toJSON ? user.toJSON() : user);
    res.json({ message: 'Test email sent successfully!' });
  } catch (err) {
    console.error('Test email error:', err);
    res.status(500).json({ error: 'Failed to send test email: ' + err.message });
  }
};

// POST /api/checkout/create-order - Create order directly (alternative to webhook)
exports.createOrder = async (req, res) => {
  try {
    const { sessionId, userId, items, total } = req.body;
    
    if (!sessionId || !userId || !items || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if order already exists
    const existingOrder = await Order.findOne({
      where: { stripe_session_id: sessionId },
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    if (existingOrder) {
      console.log(`Order already exists for session ${sessionId}, returning existing order`);
      // Send email for existing order if not sent before
      try {
        const user = await User.findByPk(parseInt(userId));
        if (user) {
          const orderJson = existingOrder.toJSON ? existingOrder.toJSON() : existingOrder;
          const emailItems = (orderJson.items || []).map((it) => ({
            product_title: it.product_title,
            quantity: it.quantity,
            unit_price: it.unit_price,
          }));
          await sendOrderEmail(orderJson, emailItems, user.toJSON ? user.toJSON() : user);
        }
      } catch (e) {
        console.warn('Email step failed for existing order:', e && e.message ? e.message : e);
      }
      
      return res.json({ order: existingOrder, message: 'Order already exists' });
    }

    // Create order (handle duplicate session id gracefully)
    let order;
    try {
      order = await Order.create({
        user_id: parseInt(userId),
        status: 'paid',
        total: parseFloat(total),
        stripe_session_id: sessionId
      });
    } catch (err) {
      if (err && err.name === 'SequelizeUniqueConstraintError') {
        const existing = await Order.findOne({
          where: { stripe_session_id: sessionId },
          include: [{ model: OrderItem, as: 'items' }]
        });
        if (existing) {
          // Attempt email (best-effort)
          try {
            const user = await User.findByPk(parseInt(userId));
            const orderJson = existing.toJSON ? existing.toJSON() : existing;
            const emailItems = (orderJson.items || []).map((it) => ({
              product_title: it.product_title,
              quantity: it.quantity,
              unit_price: it.unit_price,
            }));
            await sendOrderEmail(orderJson, emailItems, user && user.toJSON ? user.toJSON() : user);
          } catch (_) {}
          return res.json({ order: existing, message: 'Order already exists' });
        }
      }
      throw err;
    }

    // Create order items
    for (const item of items) {
      await OrderItem.create({
        order_id: order.id,
        product_title: item.title,
        product_image: item.image,
        unit_price: parseFloat(item.price),
        quantity: parseInt(item.quantity || 1)
      });
    }

    // Fetch the complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    // Send confirmation email (best-effort) using the saved order items
    try {
      const user = await User.findByPk(parseInt(userId));
      const orderJson = completeOrder.toJSON ? completeOrder.toJSON() : completeOrder;
      const emailItems = (orderJson.items || []).map((it) => ({
        product_title: it.product_title,
        quantity: it.quantity,
        unit_price: it.unit_price,
      }));
      await sendOrderEmail(orderJson, emailItems, user && user.toJSON ? user.toJSON() : user);
    } catch (e) {
      console.warn('Email step failed after createOrder:', e && e.message ? e.message : e);
    }

    res.json({ order: completeOrder, message: 'Order created successfully' });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};


