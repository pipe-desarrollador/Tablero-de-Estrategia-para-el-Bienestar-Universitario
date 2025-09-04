// backend/src/server.js
require('dotenv').config();
const app = require('./app');             // ✅ desde src
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/upload-dataset - Upload CSV file');
  console.log('  GET  /api/stats - Get database statistics');
  console.log('  GET  /api-docs - Swagger API Documentation');
 
});



function shutdown(signal) {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  server.close(() => {
    console.log('🔌 HTTP server cerrado.');
    process.exit(0);
  });
  setTimeout(() => {
    console.warn('⏱️ Cierre forzado.');
    process.exit(1);
  }, 5000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

module.exports = server;
