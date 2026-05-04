const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // ✅ Guest ke liye null
    },
    orderId: {
      type: String,
      required: true, // Guest ka bhi order ID hoga
    },
    // ✅ NEW: Guest user identification
    guestEmail: {
      type: String,
      default: null,
    },
    guestName: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 500,
    },
    images: [{
      type: String,
    }],
    verified: {
      type: Boolean,
      default: true, // Guest bhi verified (kharida hai to)
    },
    helpful: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

// ✅ Update indexes for guest support
reviewSchema.index({ productId: 1, userId: 1, orderId: 1 }, { 
  unique: true,
  sparse: true // Allow null userId
});

// ✅ NEW: Prevent duplicate guest reviews
reviewSchema.index({ productId: 1, orderId: 1, guestEmail: 1 }, { 
  unique: true,
  sparse: true
});

module.exports = mongoose.model("Review", reviewSchema);