const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  avatar: String, 
   measurements: {
    Shirt: {
      Length: Number,
      Shoulder: Number,
      Chest: Number,
      Waist: Number,
      Hip: Number,
      Sleeve: Number
    },
    Trouser: {
      Length: Number,
      Waist: Number,
      Hip: Number,
      Thigh: Number,
      Bottom: Number
    }
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  otp: {
    otp: { type: String },
    sendTime: { type: Number },
    token: { type: String },
  },

wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
},
{ timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
