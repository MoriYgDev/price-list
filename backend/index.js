import express from 'express';
import cors from 'cors';
import authRouter from './src/routes/auth.js';
import productRouter from './src/routes/products.js';
import listRouter from './src/routes/lists.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3001;

// This is needed to correctly resolve paths in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// FIX: Serve static files from the "uploads" directory
// This makes uploaded logo images accessible to the frontend.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/lists', listRouter);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});