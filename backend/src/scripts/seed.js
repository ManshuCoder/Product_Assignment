require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const ensureDemoData = require('../utils/ensureDemoData');

const seed = async () => {
  await connectDB();
  await ensureDemoData();
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
