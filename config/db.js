const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    console.log('Connecting to MongoDB...');
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Add connection options
            connectTimeoutMS: 5000, // Reduced to 5 seconds
            socketTimeoutMS: 45000,  // 45 seconds
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (err) {
        console.error('MongoDB connection error details:', {
            name: err.name,
            message: err.message,
            code: err.code
        });
        throw err;
    }
};

// Add disconnect function
const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('MongoDB Disconnected');
    } catch (err) {
        console.error('Error disconnecting from MongoDB:', err.message);
        throw err;
    }
};

module.exports = { connectDB, disconnectDB }; 