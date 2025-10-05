const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { generateUniqueCode } = require('../utils/uniqueCode');
const { sendOrderConfirmationEmail } = require('../utils/email');

const router = express.Router();
const prisma = new PrismaClient();

// Create order
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('Items array is required'),
  body('total').isNumeric().withMessage('Total must be a number'),
  body('billingInfo').isObject().withMessage('Billing info is required'),
  body('shippingInfo').isObject().withMessage('Shipping info is required')
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

    const { items, total, billingInfo, shippingInfo, paymentMethod } = req.body;
    const userId = req.user.id;

    // Generate unique order number
    const orderNumber = `FCL-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        items: JSON.stringify(items),
        total: Math.round(total * 100), // Convert to cents
        currency: 'USD',
        status: 'pending',
        paymentMethod,
        billingInfo: JSON.stringify(billingInfo),
        shippingInfo: JSON.stringify(shippingInfo),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.order.count({ where: { userId } })
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: {
        id: parseInt(id),
        userId
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order'
    });
  }
});

// Update order status (admin only)
router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'paid', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status,
        updatedAt: new Date()
      }
    });

    // Generate unique code when order is paid
    if (status === 'paid' && !order.uniqueCode) {
      const uniqueCode = generateUniqueCode();
      await prisma.order.update({
        where: { id: parseInt(id) },
        data: { uniqueCode }
      });
      order.uniqueCode = uniqueCode;
    }

    // Send confirmation email when order is paid
    if (status === 'paid') {
      try {
        await sendOrderConfirmationEmail(order);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    res.json({
      success: true,
      data: order,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Get all orders (admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const skip = (page - 1) * limit;
    
    const where = {};
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { billingInfo: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

module.exports = router;
