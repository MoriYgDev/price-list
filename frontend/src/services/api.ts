// src/services/api.ts
import axios from 'axios';

// FIX: Use an environment variable for the backend API URL.
// This was previously hardcoded.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;