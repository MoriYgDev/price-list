// backend/src/routes/lists.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { protect } from '../middleware/authMiddleware.js'; // Import the protect middleware

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

// GET /api/lists/logos - Get all logos
router.get('/logos', async (req, res) => {
    try {
        const logos = await prisma.logo.findMany({ orderBy: { name: 'asc' } });
        res.json(logos);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch logos', error: error.message });
    }
});

// POST /api/lists/logos - Create a new logo WITH file upload
// FIX: Added the 'protect' middleware to secure this route.
router.post('/logos', protect, upload.single('logoImage'), async (req, res) => {
    const { name } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !filePath) {
        return res.status(400).json({ message: 'Logo name and image file are required.' });
    }

    try {
        const newLogo = await prisma.logo.create({
            data: {
                name: name,
                filePath: filePath,
            }
        });
        res.status(201).json(newLogo);
    } catch (error) {
        // P2002 is Prisma's code for a unique constraint violation (e.g., duplicate name)
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'A logo with this name already exists.' });
        }
        res.status(500).json({ message: 'Failed to create logo', error: error.message });
    }
});

// --- Brand Routes ---

// GET /api/lists/brands - Get all brands
router.get('/brands', async (req, res) => {
    try {
        const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch brands', error: error.message });
    }
});

export default router;