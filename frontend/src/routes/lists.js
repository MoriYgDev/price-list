// backend/src/routes/lists.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/lists/logos - Get all logos
router.get('/logos', async (req, res) => {
    try {
        const logos = await prisma.logo.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(logos);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch logos', error: error.message });
    }
});

// GET /api/lists/brands - Get all brands
router.get('/brands', async (req, res) => {
    try {
        const brands = await prisma.brand.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(brands);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch brands', error: error.message });
    }
});

export default router;