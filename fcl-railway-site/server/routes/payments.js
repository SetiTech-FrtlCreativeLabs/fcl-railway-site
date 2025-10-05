const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

const router = express.Router();
const prisma = new PrismaClient();

// Create Stripe payment intent
router.post('/stripe/create-payment-intent', auth, [
  body('orderId').isNumeric().withMessage('Order ID is required'),
  body('amount').isNumeric().withMessage('Amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId, amount } = req.body;
    const userId = req.user.id;

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(orderId),
        userId
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId.toString(),
        userId: userId.toString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        stripePaymentIntentId: paymentIntent.id,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent'
    });
  }
});

// Stripe webhook
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Create Coinbase Commerce invoice
router.post('/coinbase/create-invoice', auth, [
  body('orderId').isNumeric().withMessage('Order ID is required'),
  body('amount').isNumeric().withMessage('Amount is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { orderId, amount } = req.body;
    const userId = req.user.id;

    // Verify order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(orderId),
        userId
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Create Coinbase Commerce invoice
    const response = await axios.post('https://api.commerce.coinbase.com/charges', {
      name: `Order ${order.orderNumber}`,
      description: `Payment for order ${order.orderNumber}`,
      local_price: {
        amount: amount.toString(),
        currency: 'USD'
      },
      pricing_type: 'fixed_price',
      metadata: {
        orderId: orderId.toString(),
        userId: userId.toString()
      }
    }, {
      headers: {
        'X-CC-Api-Key': process.env.COINBASE_API_KEY,
        'X-CC-Version': '2018-03-22',
        'Content-Type': 'application/json'
      }
    });

    const invoice = response.data.data;

    // Update order with invoice ID
    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        coinbaseInvoiceId: invoice.id,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      data: {
        invoiceId: invoice.id,
        checkoutUrl: invoice.hosted_url,
        expiresAt: invoice.expires_at
      }
    });
  } catch (error) {
    console.error('Error creating Coinbase invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice'
    });
  }
});

// Coinbase webhook
router.post('/coinbase/webhook', express.json(), async (req, res) => {
  try {
    const event = req.body;
    
    // Verify webhook signature
    const signature = req.headers['x-cc-webhook-signature'];
    const expectedSignature = require('crypto')
      .createHmac('sha256', process.env.COINBASE_WEBHOOK_SECRET)
      .update(JSON.stringify(event))
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    switch (event.type) {
      case 'charge:confirmed':
        await handleCoinbasePaymentSuccess(event.data);
        break;
      case 'charge:failed':
        await handleCoinbasePaymentFailure(event.data);
        break;
      default:
        console.log(`Unhandled Coinbase event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing Coinbase webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Helper functions
async function handlePaymentSuccess(paymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      console.error('No order ID in payment intent metadata');
      return;
    }

    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'paid',
        stripePaymentIntentId: paymentIntent.id,
        updatedAt: new Date()
      }
    });

    console.log(`Order ${orderId} payment confirmed`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailure(paymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      console.error('No order ID in payment intent metadata');
      return;
    }

    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'payment_failed',
        updatedAt: new Date()
      }
    });

    console.log(`Order ${orderId} payment failed`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleCoinbasePaymentSuccess(charge) {
  try {
    const orderId = charge.metadata.orderId;
    
    if (!orderId) {
      console.error('No order ID in charge metadata');
      return;
    }

    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'paid',
        coinbaseInvoiceId: charge.id,
        updatedAt: new Date()
      }
    });

    console.log(`Order ${orderId} Coinbase payment confirmed`);
  } catch (error) {
    console.error('Error handling Coinbase payment success:', error);
  }
}

async function handleCoinbasePaymentFailure(charge) {
  try {
    const orderId = charge.metadata.orderId;
    
    if (!orderId) {
      console.error('No order ID in charge metadata');
      return;
    }

    await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: {
        status: 'payment_failed',
        updatedAt: new Date()
      }
    });

    console.log(`Order ${orderId} Coinbase payment failed`);
  } catch (error) {
    console.error('Error handling Coinbase payment failure:', error);
  }
}

module.exports = router;
