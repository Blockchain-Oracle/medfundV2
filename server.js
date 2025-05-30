// Simple Express server for handling Stripe API requests in development
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// For ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Import handlers
import { handler as createIntentHandler } from './src/api/payments/create-intent.js';
import { handler as confirmIntentHandler } from './src/api/payments/confirm-intent.js';
import { handler as statusHandler } from './src/api/payments/status/[id].js';

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Convert Express request/response to Web API Request/Response for compatibility
const convertToWebRequest = (req) => {
  return new Request(new URL(req.url, `http://${req.headers.host}`), {
    method: req.method,
    headers: new Headers(req.headers),
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
  });
};

const handleResponse = async (res, handler, req) => {
  try {
    const webRequest = convertToWebRequest(req);
    const response = await handler(webRequest);
    
    // Set status code
    res.status(response.status);
    
    // Set headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    // Send body
    const text = await response.text();
    res.send(text);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// API Routes
app.post('/api/payments/create-intent', (req, res) => {
  handleResponse(res, createIntentHandler, req);
});

app.post('/api/payments/confirm-intent', (req, res) => {
  handleResponse(res, confirmIntentHandler, req);
});

app.get('/api/payments/status/:id', (req, res) => {
  // Add the ID to the request URL for the handler
  req.url = `/api/payments/status/${req.params.id}`;
  handleResponse(res, statusHandler, req);
});

// Start server
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
}); 