// backend/src/routes/lists.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js'; // Import the protect middleware
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();
const router = Router();

// --- Multer Configuration for File Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // The folder where files will be stored
  },
  filename: function (req, file, cb) {
    // Create a unique filename: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- Logo Routes ---

/**
 * @route   GET /api/lists/logos
 * @desc    Get all logos
 * @access  Public
 */
router.get('/logos', asyncHandler(async (req, res) => {
    const logos = await prisma.logo.findMany({ orderBy: { name: 'asc' } });
    res.json(logos);
}));

/**
 * @route   POST /api/lists/logos
 * @desc    Create a new logo
 * @access  Private/Admin
 */
router.post(
  '/logos',
  protect,
  upload.single('logoImage'),
  [
    // Validation middleware
    body('name').not().isEmpty().withMessage('Logo name is required'),
  ],
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array().map(e => e.msg).join(', '));
    }

    const { name } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!filePath) {
      res.status(400);
      throw new Error('Logo image file is required.');
    }

    try {
      // Create new logo
      const newLogo = await prisma.logo.create({
        data: {
          name: name,
          filePath: filePath,
        },
      });
      res.status(201).json(newLogo);
    } catch (error) {
      // Handle unique constraint violation
      if (error.code === 'P2002') {
        res.status(409);
        throw new Error('A logo with this name already exists.');
      }
      throw error;
    }
  })
);

// --- Brand Routes ---

/**
 * @route   GET /api/lists/brands
 * @desc    Get all brands
 * @access  Public
 */
router.get('/brands', asyncHandler(async (req, res) => {
    const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
    res.json(brands);
}));

export default router;