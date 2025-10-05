const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sortBy = 'title', sortOrder = 'asc' } = req.query;
    
    const skip = (page - 1) * limit;
    const where = {
      isActive: true
    };

    if (category) {
      where.initiativeId = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          initiative: true
        }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
});

// Get product by SKU
router.get('/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { sku },
      include: {
        initiative: true
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product'
    });
  }
});

// Create product (admin only)
router.post('/', auth, [
  body('title').notEmpty().withMessage('Title is required'),
  body('sku').notEmpty().withMessage('SKU is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').notEmpty().withMessage('Description is required'),
  body('initiativeId').notEmpty().withMessage('Initiative ID is required')
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

    const productData = {
      ...req.body,
      price: Math.round(req.body.price * 100), // Convert to cents
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const product = await prisma.product.create({
      data: productData,
      include: {
        initiative: true
      }
    });

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product'
    });
  }
});

// Update product (admin only)
router.put('/:sku', auth, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty')
], async (req, res) => {
  try {
    const { sku } = req.params;
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

    if (updateData.price) {
      updateData.price = Math.round(updateData.price * 100);
    }

    const product = await prisma.product.update({
      where: { sku },
      data: updateData,
      include: {
        initiative: true
      }
    });

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product'
    });
  }
});

// Delete product (admin only)
router.delete('/:sku', auth, async (req, res) => {
  try {
    const { sku } = req.params;
    
    await prisma.product.update({
      where: { sku },
      data: {
        isActive: false,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        featured: true
      },
      take: 6,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        initiative: true
      }
    });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products'
    });
  }
});

module.exports = router;
