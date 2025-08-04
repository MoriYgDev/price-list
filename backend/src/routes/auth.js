import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';

const prisma = new PrismaClient();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post(
  '/login',
  [
    // Validate username and password
    body('username', 'نام کاربری الزامی است').not().isEmpty(),
    body('password', 'رمز عبور الزامی است').not().isEmpty(),
  ],
  asyncHandler(async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array().map(e => e.msg).join(', '));
    }

    const { username, password } = req.body;

    // Check for user
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      res.status(401);
      throw new Error('نام کاربری یا رمز عبور اشتباه است');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401);
      throw new Error('نام کاربری یا رمز عبور اشتباه است');
    }

    // Create JWT
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '8h', // Token expires in 8 hours
    });

    res.json({ token });
  })
);

export default router;