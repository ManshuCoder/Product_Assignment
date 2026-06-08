const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const options = {
    serverSelectionTimeoutMS: 8000,
  };

  try {
    await mongoose.connect(uri, options);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    throw new Error(
      `Failed to connect to MongoDB using MONGODB_URI. Check your Atlas URI, username, password, network access, and database name. Original error: ${error.message}`
    );
  }
};

module.exports = connectDB;
