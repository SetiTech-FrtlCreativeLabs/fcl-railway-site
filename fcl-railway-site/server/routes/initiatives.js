const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all initiatives
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, featured, search, sortBy = 'order', sortOrder = 'asc' } = req.query;
    
    const skip = (page - 1) * limit;
    const where = {
      status: 'active'
    };

    if (featured === 'true') {
      where.featured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } }
      ];
    }

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [initiatives, total] = await Promise.all([
      prisma.initiative.findMany({
        where,
        orderBy,
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.initiative.count({ where })
    ]);

    res.json({
      success: true,
      data: initiatives,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching initiatives:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch initiatives'
    });
  }
});

// Get initiative by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const initiative = await prisma.initiative.findUnique({
      where: { slug }
    });

    if (!initiative) {
      return res.status(404).json({
        success: false,
        message: 'Initiative not found'
      });
    }

    res.json({
      success: true,
      data: initiative
    });
  } catch (error) {
    console.error('Error fetching initiative:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch initiative'
    });
  }
});

// Get featured initiatives
router.get('/featured/list', async (req, res) => {
  try {
    const initiatives = await prisma.initiative.findMany({
      where: {
        featured: true,
        status: 'active'
      },
      orderBy: {
        order: 'asc'
      },
      take: 6
    });

    res.json({
      success: true,
      data: initiatives
    });
  } catch (error) {
    console.error('Error fetching featured initiatives:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured initiatives'
    });
  }
});

// Create initiative (admin only)
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('summary').notEmpty().withMessage('Summary is required'),
  body('longDescription').optional().isString(),
  body('heroImage').optional().isString(),
  body('gallery').optional().isArray(),
  body('featured').optional().isBoolean(),
  body('order').optional().isInt(),
  body('externalDocsLink').optional().isString()
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

    const initiativeData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const initiative = await prisma.initiative.create({
      data: initiativeData
    });

    res.status(201).json({
      success: true,
      data: initiative,
      message: 'Initiative created successfully'
    });
  } catch (error) {
    console.error('Error creating initiative:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create initiative'
    });
  }
});

// Update initiative (admin only)
router.put('/:slug', auth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('summary').optional().notEmpty().withMessage('Summary cannot be empty'),
  body('longDescription').optional().isString(),
  body('heroImage').optional().isString(),
  body('gallery').optional().isArray(),
  body('featured').optional().isBoolean(),
  body('order').optional().isInt(),
  body('externalDocsLink').optional().isString()
], async (req, res) => {
  try {
    const { slug } = req.params;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    const initiative = await prisma.initiative.update({
      where: { slug },
      data: updateData
    });

    res.json({
      success: true,
      data: initiative,
      message: 'Initiative updated successfully'
    });
  } catch (error) {
    console.error('Error updating initiative:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update initiative'
    });
  }
});

// Delete initiative (admin only)
router.delete('/:slug', auth, async (req, res) => {
  try {
    const { slug } = req.params;
    
    await prisma.initiative.update({
      where: { slug },
      data: {
        status: 'inactive',
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Initiative deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting initiative:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete initiative'
    });
  }
});

module.exports = router;
