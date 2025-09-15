// Start script for Railway deployment
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Tablero de Bienestar Universitario...');
console.log('📁 Current directory:', process.cwd());
console.log('📁 Backend directory:', path.join(process.cwd(), 'backend'));

// Change to backend directory and start the server
process.chdir(path.join(process.cwd(), 'backend'));

console.log('📁 New directory:', process.cwd());

// Start the test server
const server = spawn('node', ['test-server.js'], {
  stdio: 'inherit',
  env: process.env
});

server.on('error', (err) => {
  console.error('❌ Error starting server:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`🔄 Server exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});
