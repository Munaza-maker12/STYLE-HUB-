// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, 
//   role: { type: String, enum: ["user", "admin"], required: true }, 
//   type: { type: String, enum: ["order", "stock", "return","general"], default: "general" },
//   message: { type: String, required: true },
//   read: { type: Boolean, default: false },
// }, { timestamps: true });
// notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// module.exports = mongoose.model("Notification", notificationSchema);
// models/Notification.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  }, 
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    required: true 
  }, 
  type: { 
    type: String, 
    enum: ["order", "return", "stock", "user", "general"],
    default: "general" 
  },
  message: { 
    type: String, 
    required: true 
  },
  read: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

// Auto-delete notifications older than 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("Notification", notificationSchema);