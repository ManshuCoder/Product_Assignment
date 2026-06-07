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
    if (process.env.NODE_ENV !== 'development') {
      throw error;
    }

    console.warn(`Atlas connection failed: ${error.message}`);
    console.warn('Falling back to in-memory MongoDB for local development...');

    const { MongoMemoryServer } = require('mongodb-memory-server');
    const memoryServer = await MongoMemoryServer.create();
    const memoryUri = memoryServer.getUri();

    await mongoose.connect(memoryUri, options);
    console.log('MongoDB connected: in-memory (local dev fallback)');
  }
};

module.exports = connectDB;
