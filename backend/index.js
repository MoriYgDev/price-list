// Load environment variables from .env file
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRouter from './src/routes/auth.js';
import productRouter from './src/routes/products.js';
import listRouter from './src/routes/lists.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

const app = express();
const port = process.env.PORT || 3001;

// __dirname is not available in ES modules, so we need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all routes
app.use(cors());
// Parse JSON bodies
app.use(express.json());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/lists', listRouter);

// --- Root Route ---
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

// --- Server ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});