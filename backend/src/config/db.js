const mongoose = require('mongoose');

const connectDB = async () => {
  const uri =
    process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

  if (!uri) {
    throw new Error(
      'Database connection string is not defined. Set MONGODB_URI, MONGO_URI, or DATABASE_URL.'
    );
  }

  const options = {
    serverSelectionTimeoutMS: 8000,
  };

  try {
    await mongoose.connect(uri, options);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (error) {
    throw new Error(
      `Failed to connect to MongoDB. Check your connection string, username, password, network access, and database name. Original error: ${error.message}`
    );
  }
};

module.exports = connectDB;
