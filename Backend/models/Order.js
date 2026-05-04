
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      image: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      size: { type: String },
      measurements: { type: Object }
    }
  ],

  shipping: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    phone: { type: String, required: true },
    country: { type: String, default: "Pakistan" },
    note: { type: String, default: "" }
  },

  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  status: { type: String, default: "Pending" },
  returnStatus: { type: String, default: "Not Returned" }, 
  
  returnStatus: {
    type: String,
    enum: ["Not Returned", "Requested", "Returned"],
    default: "Not Returned",
  },
    returnReason: { type: String, default: null },
  returnComment: { type: String, default: null },
  returnRequestedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model("Order", orderSchema);
