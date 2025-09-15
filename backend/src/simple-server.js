// Simple server for debugging
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/ping', (req, res) => res.send('pong'));

app.get('/debug', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database_url: process.env.DATABASE_URL ? 'configured' : 'not configured',
    port: process.env.PORT || 3000,
    node_version: process.version
  });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Simple server listening on port ${PORT}`);
});

module.exports = app;
