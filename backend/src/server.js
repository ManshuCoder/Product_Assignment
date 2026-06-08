require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const ensureDemoData = require('./utils/ensureDemoData');

const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
  try {
    await connectDB();
    await ensureDemoData();
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

const shutdown = async (signal) => {
  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) return reject(error);
          resolve();
        });
      });
    }

    const mongoose = require('mongoose');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Failed to shut down cleanly after ${signal}:`, error.message);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGUSR2', () => shutdown('SIGUSR2'));

startServer();
