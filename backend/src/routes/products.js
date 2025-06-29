// backend/src/routes/products.js
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/authMiddleware.js';

const prisma = new PrismaClient();
const router = Router();

// GET /api/products - Get all products (Public)
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { logo: true, brand: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

// GET /api/products/:id - Get a single product by ID (Public)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { logo: true, brand: true },
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

// POST /api/products - Create a new product (Admin Only)
router.post('/', protect, async (req, res) => {
  // We now receive logoId instead of logoName
  const { name, partnerName, registrationDate, price, profitPercentage, description, logoId, brandName, imageUrl } = req.body;

  try {
    // We still create the brand on-the-fly if it's new
    const brand = await prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: { name: brandName },
    });

    // The old logo upsert logic is REMOVED.

    const newProduct = await prisma.product.create({
      data: {
        name,
        partnerName,
        registrationDate: new Date(registrationDate),
        price: parseFloat(price),
        profitPercentage: parseFloat(profitPercentage),
        description,
        imageUrl,
        brandId: brand.id,
        logoId: parseInt(logoId), // We use the ID from the request directly
      },
      include: { brand: true, logo: true },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
});

// PUT /api/products/:id - Update a product (Admin Only)
router.put('/:id', protect, async (req, res) => {
  const { id } = req.params;
  // We now receive logoId instead of logoName
  const { name, partnerName, registrationDate, price, profitPercentage, description, logoId, brandName, imageUrl } = req.body;

  try {
    const brand = await prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: { name: brandName },
    });
    
    // The old logo upsert logic is REMOVED.

    // ... inside the PUT route ...
const updatedProduct = await prisma.product.update({
    where: { id: parseInt(id) },
    data: {
        name,
        partnerName,
        registrationDate: new Date(registrationDate),
        price: parseFloat(price),
        profitPercentage: parseFloat(profitPercentage),
        description,
        imageUrl,
        brandId: brand.id,
        logoId: parseInt(logoId),
    },
    include: { brand: true, logo: true },
});
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

// DELETE /api/products/:id - Delete a product (Admin Only)
router.delete('/:id', protect, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

export default router;