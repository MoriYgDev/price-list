import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { body, param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();
const router = Router();

// This router is for testing purposes only. It does not include the 'protect' middleware.

// GET /api/products - Get all products (Public)
router.get('/', asyncHandler(async (req, res) => {
  const products = await prisma.product.findMany({
    include: { logo: true, brand: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(products);
}));

// GET /api/products/:id - Get a single product by ID (Public)
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: { logo: true, brand: true },
  });
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}));

// POST /api/products - Create a new product (Admin Only)
router.post(
  '/',
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('partnerName').not().isEmpty().withMessage('Partner name is required'),
    body('registrationDate').isISO8601().withMessage('Invalid date format'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('profitPercentage').isFloat({ gt: 0 }).withMessage('Profit percentage must be a positive number'),
    body('logoId').isInt({ gt: 0 }).withMessage('Logo ID must be a positive integer'),
    body('brandName').not().isEmpty().withMessage('Brand name is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array().map(e => e.msg).join(', '));
    }

    const { name, partnerName, registrationDate, price, profitPercentage, description, logoId, brandName } = req.body;

    const brand = await prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: { name: brandName },
    });

    const newProduct = await prisma.product.create({
      data: {
        name,
        partnerName,
        registrationDate: new Date(registrationDate),
        price: parseFloat(price),
        profitPercentage: parseFloat(profitPercentage),
        description,
        brandId: brand.id,
        logoId: parseInt(logoId),
      },
      include: { brand: true, logo: true },
    });
    res.status(201).json(newProduct);
  })
);

// PUT /api/products/:id - Update a product (Admin Only)
router.put(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
    body('name').not().isEmpty().withMessage('Name is required'),
    body('partnerName').not().isEmpty().withMessage('Partner name is required'),
    body('registrationDate').isISO8601().withMessage('Invalid date format'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('profitPercentage').isFloat({ gt: 0 }).withMessage('Profit percentage must be a positive number'),
    body('logoId').isInt({ gt: 0 }).withMessage('Logo ID must be a positive integer'),
    body('brandName').not().isEmpty().withMessage('Brand name is required'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array().map(e => e.msg).join(', '));
    }

    const { id } = req.params;
    const { name, partnerName, registrationDate, price, profitPercentage, description, logoId, brandName } = req.body;

    const brand = await prisma.brand.upsert({
      where: { name: brandName },
      update: {},
      create: { name: brandName },
    });

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        partnerName,
        registrationDate: new Date(registrationDate),
        price: parseFloat(price),
        profitPercentage: parseFloat(profitPercentage),
        description,
        brandId: brand.id,
        logoId: parseInt(logoId),
      },
      include: { brand: true, logo: true },
    });
    res.json(updatedProduct);
  })
);

// DELETE /api/products/:id - Delete a product (Admin Only)
router.delete(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('ID must be a positive integer'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array().map(e => e.msg).join(', '));
    }

    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send(); // No Content
  })
);

export default router;
