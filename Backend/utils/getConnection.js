

const mongoose = require("mongoose");

let isConnected = false;

const getConnection = async () => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
    });

    isConnected = true;
    console.log("MongoDB connected successfully");

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected! Reconnecting...");
      isConnected = false;
      setTimeout(getConnection, 3000);
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB error:", err.message);
      isConnected = false;
    });

  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    isConnected = false;
    setTimeout(getConnection, 5000);
  }
};

module.exports = getConnection;