

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");
const User = require("../models/User");

//  PLACE ORDER 
router.post("/", async (req, res) => {
  try {
    const { userId, items, shipping, totalAmount, paymentMethod, country } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // ✅ Validate productId format
    for (let item of items) {
      if (!item.productId) {
        console.error("❌ Missing productId in item:", item);
        return res.status(400).json({ 
          message: "Invalid product data - missing productId" 
        });
      }

      // Check if productId is valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        console.error("❌ Invalid productId format:", item.productId);
        return res.status(400).json({ 
          message: `Invalid product ID format: ${item.productId}` 
        });
      }
    }

    // ✅ ATOMIC STOCK CHECK + UPDATE with better error messages
    for (let item of items) {
      console.log("🔍 Processing item:", {
        productId: item.productId,
        size: item.size,
        quantity: item.quantity
      });

      // First check if product exists
      const productExists = await Product.findById(item.productId);
      if (!productExists) {
        console.error("❌ Product not found:", item.productId);
        return res.status(404).json({ 
          message: `Product not found: ${item.name || item.productId}` 
        });
      }

      console.log("✅ Product found:", {
        name: productExists.name,
        customStock: productExists.customStock,
        stock: productExists.stock
      });

      // Build query for atomic update
      const query =
        item.size === "Custom"
          ? { _id: item.productId, customStock: { $gte: item.quantity } }
          : { _id: item.productId, [`stock.${item.size}`]: { $gte: item.quantity } };

      const update =
        item.size === "Custom"
          ? { $inc: { customStock: -item.quantity } }
          : { $inc: { [`stock.${item.size}`]: -item.quantity } };

      console.log("📝 Update query:", JSON.stringify(query));
      console.log("📝 Update operation:", JSON.stringify(update));

      const updatedProduct = await Product.findOneAndUpdate(
        query,
        update,
        { new: true }
      );

      if (!updatedProduct) {
        // Get current stock for better error message
        const product = await Product.findById(item.productId);
        const currentStock = item.size === "Custom" 
          ? product.customStock 
          : product.stock[item.size] || 0;

        console.error("❌ Insufficient stock:", {
          productName: product.name,
          size: item.size,
          requested: item.quantity,
          available: currentStock
        });

        return res.status(400).json({
          message: `Only ${currentStock} ${currentStock === 1 ? 'item' : 'items'} available for ${product.name} (Size: ${item.size})`,
        });
      }

      console.log("✅ Stock updated successfully");

      const remainingStock =
        item.size === "Custom"
          ? updatedProduct.customStock
          : updatedProduct.stock[item.size];

      if (remainingStock === 0) {
        await Notification.create({
          userId: null,
          role: "admin",
          type: "stock",
          message: `Stock finished for ${updatedProduct.name} (Size: ${item.size})`,
          read: false,
        });
      }
    }

    const generatedOrderId = `ORD-${Date.now()}`;

    const newOrder = new Order({
      orderId: generatedOrderId,
      userId: userId || null,
      items,
      shipping,
      totalAmount,
      paymentMethod: paymentMethod || "Cash on Delivery",
      country: country || "Pakistan",
      status: "Pending",
      returnStatus: "Not Returned",
    });

    const savedOrder = await newOrder.save();
     let userName = shipping?.name || "Guest User";
    if (userId) {
      const user = await User.findById(userId);
      if (user) userName = user.name;
    }

    await Notification.create({
      userId: null,
      role: "admin",
      type: "order",
      message: `Your order ${generatedOrderId} placed successfully - Total: Rs ${totalAmount}`,
      read: false,
    });

    if (userId) {
      await Notification.create({
       userId: userId,
 
        role: "user",    
        type: "order",
        message: `Your order ${generatedOrderId} has been placed successfully`,
        read: false,
      });
    }

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("❌ Order placement error:", err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
});



//   try {
//     const { userId, items, shipping, totalAmount, paymentMethod, country } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "No items in order" });
//     }

//     // Check stock
//     for (let item of items) {
//       const product = await Product.findById(item.productId);
//       if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });

//       let availableStock = item.size === "Custom" ? product.customStock : product.stock[item.size];
//       if (availableStock < item.quantity) {
//         return res.status(400).json({
//           message: `Only ${availableStock} left in stock for ${product.name} (Size: ${item.size})`,
//         });
//       }
//     }

//     for (let item of items) {
//       const product = await Product.findById(item.productId);

//       if (item.size === "Custom") {
//         product.customStock = Math.max(0, product.customStock - item.quantity);
//       } else {
//         product.stock[item.size] = Math.max(0, product.stock[item.size] - item.quantity);
//       }

//       await product.save();

//       const remainingStock = item.size === "Custom" ? product.customStock : product.stock[item.size];
//       if (remainingStock === 0) {
//         await Notification.create({
//           userId: null,
//           role: "admin",
//           type: "stock",
//           message: `Stock finished for ${product.name} (Size: ${item.size})`,
//           read: false,
//         });
//       }
//     }

//     const generatedOrderId = `ORD-${Date.now()}`;

//     const newOrder = new Order({
//       orderId: generatedOrderId,
//       userId: userId || null,
//       items,
//       shipping,
//       totalAmount,
//       paymentMethod: paymentMethod || "Cash on Delivery",
//       country: country || "Pakistan",
//       status: "Pending",
//       returnStatus: "Not Returned",
//     });

//     const savedOrder = await newOrder.save();

//     await Notification.create({
//       userId: null,
//       role: "admin",
//       type: "order",
//       message: `New order placed: ${generatedOrderId}`,
//       read: false,
//     });
// if (userId) {
//   await Notification.create({
//     userId: userId,  
//     role: "user",    
//     type: "order",
//     message: `Your order ${generatedOrderId} has been placed successfully`,
//     read: false,
//   });
// }

//     res.status(201).json(savedOrder);
//   } catch (err) {
//     console.error("Order placement error:", err);
//     res.status(500).json({ message: "Failed to place order", error: err.message });
//   }
// });

router.get("/my-orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
});

// router.put("/cancel/:orderId", async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const order = await Order.findOne({ orderId });
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     if (order.status !== "Pending") {
//       return res.status(400).json({ message: "Order cannot be cancelled" });
//     }

//     order.status = "Cancelled";
//     await order.save();

//     // Restore stock
//     for (let item of order.items) {
//       const product = await Product.findById(item.productId);
//       if (!product) continue;

//       if (item.size === "Custom") product.customStock += item.quantity;
//       else product.stock[item.size] += item.quantity;

//       await product.save();
//     }

//     // ✅ Get user name
//     let userName = order.shipping?.name || "Guest";
//     if (order.userId) {
//       const user = await User.findById(order.userId);
//       if (user) userName = user.name;
//     }

//     // Admin notification
//     await Notification.create({
//       userId: null,
//       role: "admin",
//       type: "order",
//       message: `❌ Order cancelled: ${orderId} by ${userName}`,
//       read: false,
//     });

//     // User confirmation
//     if (order.userId) {
//       await Notification.create({
//         userId: order.userId.toString(),
//         role: "user",
//         type: "order",
//         message: `✅ Your order ${orderId} has been cancelled successfully`,
//         read: false,
//       });
//     }
       
//     res.json({ message: "Order cancelled successfully", order });
//   } catch (err) {
//     console.error("Cancel order error:", err);
//     res.status(500).json({ message: "Failed to cancel order", error: err.message });
//   }
// });
router.put("/cancel/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    order.status = "Cancelled";
    await order.save();

    // ✅ Fix — $inc use karo, save() ki jagah
    for (let item of order.items) {
      if (item.size === "Custom") {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { customStock: item.quantity } }
        );
      } else {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { [`stock.${item.size}`]: item.quantity } }
        );
      }
    }

    let userName = order.shipping?.name || "Guest";
    if (order.userId) {
      const user = await User.findById(order.userId);
      if (user) userName = user.name;
    }

    await Notification.create({
      userId: null,
      role: "admin",
      type: "order",
      message: `❌ Order cancelled: ${orderId} by ${userName}`,
      read: false,
    });

    if (order.userId) {
      await Notification.create({
        userId: order.userId.toString(),
        role: "user",
        type: "order",
        message: `✅ Your order ${orderId} has been cancelled successfully`,
        read: false,
      });
    }

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Failed to cancel order", error: err.message });
  }
});
router.put("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    console.log("=== ORDER STATUS UPDATE DEBUG ===");
    console.log("Order found:", order);
    console.log("Order userId:", order.userId);
    console.log("Order userId type:", typeof order.userId);

    if (order.userId) {
      console.log("Creating notification for userId:", order.userId.toString());
      
      const notification = await Notification.create({
        userId: order.userId.toString(),
        role: "user",
        type: "order",
        message: `Your order ${orderId} status updated to ${status}`,
        read: false,
      });
      
      console.log("Notification created successfully:", notification);
      
      // Verify it was saved
      const checkNotification = await Notification.findById(notification._id);
      console.log("Notification in DB:", checkNotification);
      
      // Check all notifications for this user
      const allUserNotifications = await Notification.find({ 
        userId: order.userId.toString(), 
        role: "user" 
      });
      console.log(`Total notifications for user ${order.userId}:`, allUserNotifications.length);
      
    } else {
      console.log("No userId found in order");
    }

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
});
// router.put("/:orderId/return", async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { returnStatus } = req.body;
//     const validStatuses = ["Not Returned", "Requested", "Returned"];
//     if (!validStatuses.includes(returnStatus))
//       return res.status(400).json({ message: "Invalid return status" });

//     const order = await Order.findOneAndUpdate({ orderId }, { returnStatus }, { new: true });
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     if (order.userId) {
//       await Notification.create({
//         userId: order.userId,
//         role: "user",
//         type: "order",
//         message: `Your order ${orderId} return status updated to ${returnStatus}`,
//         read: false,
//       });
//     }

//     res.json({ message: "Return status updated", order });
//   } catch (err) {
//     console.error("Return status error:", err);
//     res.status(500).json({ message: "Failed to update return status", error: err.message });
//   }
// });
// orderRoutes.js mein return request route update karein

router.put("/return/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason, comment } = req.body;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({ 
        message: "Only delivered orders can be returned" 
      });
    }

    if (order.returnStatus !== "Not Returned") {
      return res.status(400).json({ 
        message: "Return already requested for this order" 
      });
    }

    order.returnStatus = "Requested";
    order.returnReason = reason;
    order.returnComment = comment;
    order.returnRequestedAt = new Date();

    await order.save();

    // ✅ ADMIN KO NOTIFICATION BHEJEIN
    await Notification.create({
      userId: null,
      role: "admin",
      type: "return",
      message: `New return request for order ${orderId} - Reason: ${reason}`,
      read: false,
    });

    // ✅ USER KO BHI CONFIRMATION
    if (order.userId) {
      await Notification.create({
        userId: order.userId.toString(),
        role: "user",
        type: "order",
        message: `Your return request for order ${orderId} has been submitted`,
        read: false,
      });
    }

    console.log(`🔔 Admin notification created for return request: ${orderId}`);

    res.json({ message: "Return request submitted successfully", order });
  } catch (error) {
    console.error("Return request error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;
