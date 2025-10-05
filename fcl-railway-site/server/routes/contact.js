const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const { sendContactFormEmail } = require('../utils/email');

const router = express.Router();
const prisma = new PrismaClient();

// Submit contact form
router.post('/', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
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

    const { name, email, subject, message } = req.body;

    // Save contact message to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        status: 'new',
        priority: 'normal',
        createdAt: new Date()
      }
    });

    // Send email notification
    try {
      await sendContactFormEmail({
        name,
        email,
        subject,
        message
      });
    } catch (emailError) {
      console.error('Error sending contact form email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      data: contactMessage,
      message: 'Contact message submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
});

// Get contact messages (admin only)
router.get('/messages', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, priority } = req.query;
    const skip = (page - 1) * limit;
    
    const where = {};
    if (status) {
      where.status = status;
    }
    if (priority) {
      where.priority = priority;
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.contactMessage.count({ where })
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact messages'
    });
  }
});

// Update contact message status (admin only)
router.put('/messages/:id/status', [
  body('status').isIn(['new', 'read', 'replied', 'closed']).withMessage('Invalid status')
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

    const message = await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: {
        status,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      data: message,
      message: 'Message status updated successfully'
    });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message status'
    });
  }
});

// Newsletter subscription
router.post('/newsletter', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const { email } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if email is already subscribed
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email }
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Email is already subscribed'
        });
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscription.update({
          where: { email },
          data: {
            isActive: true,
            createdAt: new Date()
          }
        });
      }
    } else {
      // Create new subscription
      await prisma.newsletterSubscription.create({
        data: {
          email,
          isActive: true,
          createdAt: new Date()
        }
      });
    }

    res.json({
      success: true,
      message: 'Successfully subscribed to newsletter'
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter'
    });
  }
});

// Unsubscribe from newsletter
router.post('/newsletter/unsubscribe', [
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const { email } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const subscription = await prisma.newsletterSubscription.findUnique({
      where: { email }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in newsletter subscriptions'
      });
    }

    await prisma.newsletterSubscription.update({
      where: { email },
      data: {
        isActive: false
      }
    });

    res.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from newsletter'
    });
  }
});

module.exports = router;
