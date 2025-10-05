const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true,
        profile: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
});

// Update user profile
router.put('/profile', auth, [
  body('displayName').optional().notEmpty().withMessage('Display name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const userId = req.user.id;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { displayName, email } = req.body;
    const updateData = {};

    if (displayName) updateData.displayName = displayName;
    if (email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already taken'
        });
      }
      updateData.email = email;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Change password
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedNewPassword
      }
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Update user profile details
router.put('/profile/details', auth, [
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('phone').optional().isString(),
  body('address').optional().isString(),
  body('city').optional().isString(),
  body('state').optional().isString(),
  body('zip').optional().isString(),
  body('country').optional().isString()
], async (req, res) => {
  try {
    const userId = req.user.id;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const profileData = req.body;

    // Upsert profile
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData
      }
    });

    res.json({
      success: true,
      data: profile,
      message: 'Profile details updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile details'
    });
  }
});

// Delete user account
router.delete('/account', auth, [
  body('password').notEmpty().withMessage('Password is required for account deletion')
], async (req, res) => {
  try {
    const userId = req.user.id;
    const { password } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
});

module.exports = router;
