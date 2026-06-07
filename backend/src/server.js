require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const ensureDemoData = require('./utils/ensureDemoData');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await ensureDemoData();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
