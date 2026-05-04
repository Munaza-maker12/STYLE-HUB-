// // // // 
// // // const express = require("express");
// // // const router = express.Router();
// // // const { verifyTokenAndAdmin } = require("../middlewares/authMiddleware");
// // // const User = require("../models/User");
// // // const Product = require("../models/Product");
// // // const Order = require("../models/Order");
// // // const upload = require("../config/multer");
// // // const Notification = require("../models/Notification");

// // // const cloudinary = require("../config/cloudinary");
// // // const { getAdminProfile, updateAdminProfile } = require('../controllers/adminProfile');
// // // const {
// // //   getMainCategories,
// // //   getSubcategoriesByParent,
// // //   createCategory,
// // //   updateCategory,
// // //   deleteCategory,
// // //   toggleCategoryStatus,
// // //   addSubcategory,
// // //   updateSubcategory,
// // //   deleteSubcategory,
// // //   getCategoryStats
// // // } = require("../controllers/categoryController");



// // // router.get("/profile", verifyTokenAndAdmin, getAdminProfile);

// // // router.put(
// // //   "/profile/update",
// // //   verifyTokenAndAdmin,
// // //   upload.single("avatar"), 
// // //   updateAdminProfile
// // // );


// // // router.get("/dashboard", verifyTokenAndAdmin, (req, res) => {
// // //   res.json({ message: "Welcome to Admin Dashboard", user: req.user });
// // // });


// // // router.get("/categories/main", getMainCategories);
// // // router.get("/categories/parent/:parentId", getSubcategoriesByParent);
// // // router.post("/categories", verifyTokenAndAdmin, upload.single("image"), createCategory);
// // // router.put("/categories/:id", verifyTokenAndAdmin, upload.single("image"), updateCategory);
// // // router.delete("/categories/:id", verifyTokenAndAdmin, deleteCategory);
// // // router.put("/categories/:id/toggle-status", verifyTokenAndAdmin, toggleCategoryStatus);


// // // router.post("/categories/:id/sub", verifyTokenAndAdmin, upload.single("image"), addSubcategory);
// // // router.put("/categories/:id/sub/:subId", verifyTokenAndAdmin, upload.single("image"), updateSubcategory);
// // // router.delete("/categories/:id/sub/:subId", verifyTokenAndAdmin, deleteSubcategory);
// // // router.get("/categories/stats", verifyTokenAndAdmin, getCategoryStats);

// // // router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const usersCount = await User.countDocuments();
// // //     const productsCount = await Product.countDocuments();
// // //     const ordersCount = await Order.countDocuments();
// // //     const categoriesCount = await Product.distinct("category");
// // //     const subcategoriesCount = await Product.distinct("subCategory");

// // //     const pendingOrders = await Order.countDocuments({ status: "Pending" });
// // //     const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
// // //     const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });
// // //     const returnedOrders = await Order.countDocuments({ returnStatus: "Returned" });

// // //     res.json({
// // //       users: usersCount,
// // //       products: productsCount,
// // //       orders: ordersCount,
// // //       categories: categoriesCount.length,
// // //       subcategories: subcategoriesCount.length,
// // //       pendingOrders,
// // //       deliveredOrders,
// // //       cancelledOrders,
// // //       returnedOrders,
// // //     });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ message: "Error fetching stats" });
// // //   }
// // // });


// // // router.get("/users", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const users = await User.find(); 
// // //     res.status(200).json(users);
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // });


// // // router.delete("/users/:id", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     await User.findByIdAndDelete(req.params.id);
// // //     res.status(200).json({ message: "User deleted successfully" });
// // //   } catch (err) {
// // //     res.status(500).json({ message: err.message });
// // //   }
// // // });

// // // router.get("/orders", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const orders = await Order.find().sort({ createdAt: -1 }).lean();
// // //     res.status(200).json({ status: true, orders });
// // //   } catch (err) {
// // //     res.status(500).json({ status: false, message: "Error fetching orders" });
// // //   }
// // // });

// // // router.get("/orders/:orderId", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const order = await Order.findOne({ orderId: req.params.orderId }).lean();
// // //     if (!order) return res.status(404).json({ status: false, message: "Order not found" });
// // //     res.status(200).json({ status: true, order });
// // //   } catch (err) {
// // //     res.status(500).json({ status: false, message: "Error fetching order details" });
// // //   }
// // // });
// // // router.put("/orders/:orderId/status", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const { status } = req.body;
// // //     if (!["Pending", "Shipped", "Delivered"].includes(status)) {
// // //       return res.status(400).json({ status: false, message: "Invalid status" });
// // //     }

// // //     const order = await Order.findOneAndUpdate(
// // //       { orderId: req.params.orderId },
// // //       { status },
// // //       { new: true }
// // //     ).lean();

// // //     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

// // //     // ADD THIS: Create notification when admin updates status
// // //     if (order.userId) {
// // //       await Notification.create({
// // //         userId: order.userId.toString(),
// // //         role: "user",
// // //         type: "order",
// // //         message: `Your order ${req.params.orderId} status updated to ${status}`,
// // //         read: false,
// // //       });
      
// // //       console.log(`Created notification for user ${order.userId} - Order ${req.params.orderId} status updated to ${status}`);
// // //     }

// // //     res.json({ status: true, message: "Order status updated", order });
// // //   } catch (err) {
// // //     console.error("Update status error:", err);
// // //     res.status(500).json({ status: false, message: "Error updating order status" });
// // //   }
// // // });
// // // // router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
// // // //   try {
// // // //     const { returnStatus } = req.body;
// // // //     const validStatuses = ["Not Returned", "Requested", "Returned"];
// // // //     if (!validStatuses.includes(returnStatus)) {
// // // //       return res.status(400).json({ status: false, message: "Invalid return status" });
// // // //     }

// // // //     const order = await Order.findOneAndUpdate(
// // // //       { orderId: req.params.orderId },
// // // //       { returnStatus },
// // // //       { new: true }
// // // //     ).lean();

// // // //     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

// // // //     // ADD THIS: Create notification when admin updates return status
// // // //     if (order.userId) {
// // // //       await Notification.create({
// // // //         userId: order.userId.toString(),
// // // //         role: "user",
// // // //         type: "order",
// // // //         message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
// // // //         read: false,
// // // //       });
      
// // // //       console.log(`Created notification for user ${order.userId} - Order ${req.params.orderId} return status updated to ${returnStatus}`);
// // // //     }

// // // //     res.json({ status: true, message: "Return status updated", order });
// // // //   } catch (err) {
// // // //     res.status(500).json({ status: false, message: "Error updating return status" });
// // // //   }
// // // // });
// // // // adminRoutes.js mein yeh route update karein
// // // router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const { returnStatus } = req.body;
// // //     const validStatuses = ["Not Returned", "Requested", "Returned"];

// // //     if (!validStatuses.includes(returnStatus)) {
// // //       return res.status(400).json({ status: false, message: "Invalid return status" });
// // //     }

// // //     const order = await Order.findOne({ orderId: req.params.orderId });
// // //     if (!order) {
// // //       return res.status(404).json({ status: false, message: "Order not found" });
// // //     }

// // //     const oldReturnStatus = order.returnStatus;

// // //     if (returnStatus === "Returned" && oldReturnStatus !== "Returned") {
// // //       for (const item of order.items || []) {
// // //         if (!item.productId) continue;
// // //         const qty = Number(item.quantity) || 0;
// // //         if (qty <= 0) continue;

// // //         try {
// // //           if (item.size === "Custom") {
// // //             await Product.findByIdAndUpdate(
// // //               item.productId,
// // //               { $inc: { customStock: qty } }
// // //             );
// // //           } else {
// // //             await Product.findByIdAndUpdate(
// // //               item.productId,
// // //               { $inc: { [`stock.${item.size}`]: qty } }
// // //             );
// // //           }
// // //           console.log(`Stock restored: productId=${item.productId} size=${item.size} qty=${qty}`);
// // //         } catch (e) {
// // //           console.warn(`Stock restore failed for ${item.productId}: ${e.message}`);
// // //         }
// // //       }
// // //     }

// // //     order.returnStatus = returnStatus;
// // //     await order.save();

// // //     if (order.userId) {
// // //       await Notification.create({
// // //         userId: order.userId.toString(),
// // //         role: "user",
// // //         type: "order",
// // //         message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
// // //         read: false,
// // //       });
// // //     }

// // //     res.json({ status: true, message: "Return status updated", order });
// // //   } catch (err) {
// // //     console.error("Return status error:", err);
// // //     res.status(500).json({
// // //       status: false,
// // //       message: err.message || "Error updating return status",
// // //     });
// // //   }
// // // });

// // // // router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
// // // //   try {
// // // //     const { returnStatus } = req.body;
// // // //     const validStatuses = ["Not Returned", "Requested", "Returned"];
    
// // // //     if (!validStatuses.includes(returnStatus)) {
// // // //       return res.status(400).json({ status: false, message: "Invalid return status" });
// // // //     }

// // // //     const order = await Order.findOne({ orderId: req.params.orderId });
// // // //     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

// // // //     const oldReturnStatus = order.returnStatus;
// // // //     order.returnStatus = returnStatus;

// // // //     // ✅ STOCK RESTORE - Jab admin "Returned" status set kare
// // // //     if (returnStatus === "Returned" && oldReturnStatus !== "Returned") {
// // // //       for (let item of order.items) {
// // // //         const product = await Product.findById(item.productId);
// // // //         if (!product) continue;

// // // //         if (item.size === "Custom") {
// // // //           product.customStock += item.quantity;
// // // //         } else {
// // // //           product.stock[item.size] = (product.stock[item.size] || 0) + item.quantity;
// // // //         }

// // // //         await product.save();
// // // //         console.log(`✅ Stock restored for ${product.name} - Size: ${item.size}, Qty: ${item.quantity}`);
// // // //       }
// // // //     }

// // // //     await order.save();

// // // //     // ✅ User ko notification bhejein
// // // //     if (order.userId) {
// // // //       await Notification.create({
// // // //         userId: order.userId.toString(),
// // // //         role: "user",
// // // //         type: "order",
// // // //         message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
// // // //         read: false,
// // // //       });
      
// // // //       console.log(`📧 Notification sent to user ${order.userId}`);
// // // //     }

// // // //     res.json({ status: true, message: "Return status updated", order });
// // // //   } catch (err) {
// // // //     console.error("Return status error:", err);
// // // //     res.status(500).json({ status: false, message: "Error updating return status" });
// // // //   }
// // // // });
// // // // DELETE /api/admin/orders/:orderId
// // // router.delete("/orders/:orderId", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const { orderId } = req.params;
// // //     const order = await Order.findOne({ orderId });

// // //     if (!order) return res.status(404).json({ message: "Order not found" });

// // //     if (order.status !== "Cancelled") {
// // //       return res.status(400).json({ message: "Only cancelled orders can be deleted" });
// // //     }

// // //     await Order.deleteOne({ orderId });

// // //     await Notification.create({
// // //       userId: order.userId || null,
// // //       role: "admin",
// // //       type: "order",
// // //       message: `Cancelled order ${orderId} deleted by admin`,
// // //       read: false,
// // //     });

// // //     res.json({ message: "Cancelled order deleted successfully" });
// // //   } catch (err) {
// // //     console.error("Delete order error:", err);
// // //     res.status(500).json({ message: "Failed to delete order", error: err.message });
// // //   }
// // // });



// // // router.get("/products/stock", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const products = await Product.find().sort({ dateAdded: -1 });


// // //     const productsWithStatus = products.map((p) => {
// // //       const totalStock = Object.values(p.stock || {}).reduce((acc, val) => acc + val, 0) + (p.customStock || 0);
// // //       return {
// // //         ...p._doc,
// // //         available: totalStock > 0
// // //       };
// // //     });

// // //     res.json(productsWithStatus);
// // //   } catch (error) {
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // router.put("/products/:id/stock", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const { size, quantity, type } = req.body;
// // //     let updateQuery;

// // //     if (type === 'custom') {
// // //       updateQuery = { $set: { customStock: Math.max(0, quantity) } };
// // //     } else {
// // //       updateQuery = { $set: { [`stock.${size}`]: Math.max(0, quantity) } };
// // //     }

// // //     const product = await Product.findByIdAndUpdate(req.params.id, updateQuery, { new: true });
// // //     res.json(product);
// // //   } catch (error) {
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // });

// // // router.get("/products/:id", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const product = await Product.findById(req.params.id);
// // //     if (!product) return res.status(404).json({ message: "Product not found" });
// // //     res.json(product);
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.status(500).json({ message: "Failed to fetch product" });
// // //   }
// // // });

// // // router.put("/products/:id", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
// // //   try {
// // //     const { name, old_price, new_price, description, existingImages } = req.body;

// // //     const updateData = {
// // //       name,
// // //       old_price: old_price ? Number(old_price) : 0,
// // //       new_price: new_price ? Number(new_price) : 0,
// // //       description: description ? description.split("\n").filter(line => line.trim()) : [],
// // //     };

  
// // //     let newImages = [];
// // //     if (req.files && req.files.length > 0) {
// // //       const results = await Promise.all(req.files.map(file =>
// // //         cloudinary.uploader.upload(file.path, { folder: "stylehub/products" })
// // //       ));
// // //       newImages = results.map(r => r.secure_url);
// // //     }

// // //     let oldImages = [];
// // //     if (existingImages) {
// // //       oldImages = JSON.parse(existingImages);
// // //     }

// // //     updateData.images = [...oldImages, ...newImages];

// // //     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
// // //     if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

// // //     res.json({ message: "Product updated successfully", product: updatedProduct });
// // //   } catch (error) {
// // //     console.error("Update product error:", error);
// // //     res.status(500).json({ error: "Something went wrong while updating the product" });
// // //   }
// // // });


// // // router.post("/products", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
// // //   try {
// // //     console.log("REQ.BODY:", req.body);
// // //     console.log("REQ.FILES:", req.files);

// // //     const { name, category, subCategory, new_price, old_price, description, stock, customStock } = req.body;

// // //     if (!name || !category || !subCategory || !new_price) {
// // //       return res.status(400).json({ message: "Name, category, subCategory, and new_price are required." });
// // //     }

// // //     let imageUrls = [];
// // //     if (req.files && req.files.length > 0) {
// // //       const results = await Promise.all(
// // //         req.files.map(file =>
// // //           cloudinary.uploader.upload(file.path, { folder: "stylehub/products" })
// // //         )
// // //       );
// // //       imageUrls = results.map(r => r.secure_url);
// // //     }

  
// // //     let parsedStock = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
// // //     if (stock) parsedStock = JSON.parse(stock);
// // //     Object.keys(parsedStock).forEach(key => parsedStock[key] = Number(parsedStock[key]));

// // //     const parsedCustomStock = Number(customStock || 0);
// // //     const newPriceNum = Number(new_price);
// // //     const oldPriceNum = old_price ? Number(old_price) : 0;
// // //     const descriptionArr = description ? description.split("\n").map(l => l.trim()).filter(l => l) : [];

// // //     const product = new Product({
// // //       name,
// // //       category,
// // //       subCategory,
// // //       images: imageUrls,
// // //       new_price: newPriceNum,
// // //       old_price: oldPriceNum,
// // //       description: descriptionArr,
// // //       stock: parsedStock,
// // //       customStock: parsedCustomStock,
// // //       available: true,
// // //       dateAdded: new Date()
// // //     });

// // //     await product.save();
// // //     console.log("Product saved successfully:", product.name);
// // //     res.status(201).json({ message: "Product added successfully", product });
// // //   } catch (error) {
// // //     console.error("Failed to add product:", error);
// // //     res.status(500).json({ message: "Failed to add product", error: error.message });
// // //   }
// // // });

// // // router.delete("/products/:id", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const product = await Product.findByIdAndDelete(req.params.id);
// // //     if (!product) {
// // //       return res.status(404).json({ message: "Product not found" });
// // //     }
// // //     res.status(200).json({ message: "Product deleted successfully" });
// // //   } catch (error) {
// // //     res.status(500).json({ message: "Failed to delete product", error: error.message });
// // //   }
// // // });




// // // module.exports = router;    


// // const express = require("express");
// // const router = express.Router();
// // const { verifyTokenAndAdmin } = require("../middlewares/authMiddleware");
// // const User = require("../models/User");
// // const Product = require("../models/Product");
// // const Order = require("../models/Order");
// // const upload = require("../config/multer");
// // const Notification = require("../models/Notification");

// // const cloudinary = require("../config/cloudinary");
// // const { getAdminProfile, updateAdminProfile } = require('../controllers/adminProfile');
// // const {
// //   getMainCategories,
// //   getSubcategoriesByParent,
// //   createCategory,
// //   updateCategory,
// //   deleteCategory,
// //   toggleCategoryStatus,
// //   addSubcategory,
// //   updateSubcategory,
// //   deleteSubcategory,
// //   getCategoryStats
// // } = require("../controllers/categoryController");



// // router.get("/profile", verifyTokenAndAdmin, getAdminProfile);

// // router.put(
// //   "/profile/update",
// //   verifyTokenAndAdmin,
// //   upload.single("avatar"), 
// //   updateAdminProfile
// // );


// // router.get("/dashboard", verifyTokenAndAdmin, (req, res) => {
// //   res.json({ message: "Welcome to Admin Dashboard", user: req.user });
// // });


// // router.get("/categories/main", getMainCategories);
// // router.get("/categories/parent/:parentId", getSubcategoriesByParent);
// // router.post("/categories", verifyTokenAndAdmin, upload.single("image"), createCategory);
// // router.put("/categories/:id", verifyTokenAndAdmin, upload.single("image"), updateCategory);
// // router.delete("/categories/:id", verifyTokenAndAdmin, deleteCategory);
// // router.put("/categories/:id/toggle-status", verifyTokenAndAdmin, toggleCategoryStatus);


// // router.post("/categories/:id/sub", verifyTokenAndAdmin, upload.single("image"), addSubcategory);
// // router.put("/categories/:id/sub/:subId", verifyTokenAndAdmin, upload.single("image"), updateSubcategory);
// // router.delete("/categories/:id/sub/:subId", verifyTokenAndAdmin, deleteSubcategory);
// // router.get("/categories/stats", verifyTokenAndAdmin, getCategoryStats);

// // router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const usersCount = await User.countDocuments();
// //     const productsCount = await Product.countDocuments();
// //     const ordersCount = await Order.countDocuments();
// //     const categoriesCount = await Product.distinct("category");
// //     const subcategoriesCount = await Product.distinct("subCategory");

// //     const pendingOrders = await Order.countDocuments({ status: "Pending" });
// //     const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
// //     const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });
// //     const returnedOrders = await Order.countDocuments({ returnStatus: "Returned" });

// //     res.json({
// //       users: usersCount,
// //       products: productsCount,
// //       orders: ordersCount,
// //       categories: categoriesCount.length,
// //       subcategories: subcategoriesCount.length,
// //       pendingOrders,
// //       deliveredOrders,
// //       cancelledOrders,
// //       returnedOrders,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Error fetching stats" });
// //   }
// // });


// // router.get("/users", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const users = await User.find(); 
// //     res.status(200).json(users);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // GET /api/admin/admins — sab admins ki list
// // router.get("/admins", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const admins = await User.find({ role: "admin" }).select("-password -otp");
// //     res.status(200).json({
// //       status: true,
// //       count: admins.length,
// //       admins,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ status: false, message: err.message });
// //   }
// // });
// // // DELETE /api/admin/admins/:id — kisi admin ko delete karna
// // router.delete("/admins/:id", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const targetId = req.params.id;

// //     // Khud ko is route se delete nahi kar sakte (self-delete ke liye alag route hai)
// //     if (targetId === req.user.id) {
// //       return res.status(400).json({
// //         status: false,
// //         message: "Apne aap ko yahan se delete nahi kar sakte. Profile page se karo.",
// //       });
// //     }

// //     // Target user check karo
// //     const target = await User.findById(targetId);
// //     if (!target) {
// //       return res.status(404).json({ status: false, message: "Admin nahi mila" });
// //     }

// //     if (target.role !== "admin") {
// //       return res.status(400).json({ status: false, message: "Yeh user admin nahi hai" });
// //     }

// //     // Safety: aakhri admin delete nahi hone dena
// //     const adminCount = await User.countDocuments({ role: "admin" });
// //     if (adminCount <= 1) {
// //       return res.status(400).json({
// //         status: false,
// //         message: "Aakhri admin delete nahi kar sakte. System mein kam se kam 1 admin zaroori hai.",
// //       });
// //     }

// //     await User.findByIdAndDelete(targetId);

// //     res.status(200).json({
// //       status: true,
// //       message: `Admin "${target.email}" delete ho gaya`,
// //     });
// //   } catch (err) {
// //     res.status(500).json({ status: false, message: err.message });
// //   }
// // });

// // router.delete("/users/:id", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     await User.findByIdAndDelete(req.params.id);
// //     res.status(200).json({ message: "User deleted successfully" });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });
// // router.delete("/profile/delete", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const adminId = req.user.id;

// //     const admin = await User.findById(adminId);
// //     if (!admin) {
// //       return res.status(404).json({ message: "Admin not found" });
// //     }

// //     // Safety check: last admin delete na ho jaye
// //     const adminCount = await User.countDocuments({ role: "admin" });
// //     if (adminCount <= 1) {
// //       return res.status(400).json({
// //         message: "Cannot delete the only remaining admin account. Create another admin first.",
// //       });
// //     }

// //     await User.findByIdAndDelete(adminId);

// //     res.status(200).json({ message: "Admin account deleted successfully" });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // router.get("/orders", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const orders = await Order.find().sort({ createdAt: -1 }).lean();
// //     res.status(200).json({ status: true, orders });
// //   } catch (err) {
// //     res.status(500).json({ status: false, message: "Error fetching orders" });
// //   }
// // });

// // router.get("/orders/:orderId", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const order = await Order.findOne({ orderId: req.params.orderId }).lean();
// //     if (!order) return res.status(404).json({ status: false, message: "Order not found" });
// //     res.status(200).json({ status: true, order });
// //   } catch (err) {
// //     res.status(500).json({ status: false, message: "Error fetching order details" });
// //   }
// // });
// // router.put("/orders/:orderId/status", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const { status } = req.body;
// //     if (!["Pending", "Shipped", "Delivered"].includes(status)) {
// //       return res.status(400).json({ status: false, message: "Invalid status" });
// //     }

// //     const order = await Order.findOneAndUpdate(
// //       { orderId: req.params.orderId },
// //       { status },
// //       { new: true }
// //     ).lean();

// //     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

// //     // ADD THIS: Create notification when admin updates status
// //     if (order.userId) {
// //       await Notification.create({
// //         userId: order.userId.toString(),
// //         role: "user",
// //         type: "order",
// //         message: `Your order ${req.params.orderId} status updated to ${status}`,
// //         read: false,
// //       });
      
// //       console.log(`Created notification for user ${order.userId} - Order ${req.params.orderId} status updated to ${status}`);
// //     }

// //     res.json({ status: true, message: "Order status updated", order });
// //   } catch (err) {
// //     console.error("Update status error:", err);
// //     res.status(500).json({ status: false, message: "Error updating order status" });
// //   }
// // });
// // // router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const { returnStatus } = req.body;
// // //     const validStatuses = ["Not Returned", "Requested", "Returned"];
// // //     if (!validStatuses.includes(returnStatus)) {
// // //       return res.status(400).json({ status: false, message: "Invalid return status" });
// // //     }

// // //     const order = await Order.findOneAndUpdate(
// // //       { orderId: req.params.orderId },
// // //       { returnStatus },
// // //       { new: true }
// // //     ).lean();

// // //     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

// // //     // ADD THIS: Create notification when admin updates return status
// // //     if (order.userId) {
// // //       await Notification.create({
// // //         userId: order.userId.toString(),
// // //         role: "user",
// // //         type: "order",
// // //         message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
// // //         read: false,
// // //       });
      
// // //       console.log(`Created notification for user ${order.userId} - Order ${req.params.orderId} return status updated to ${returnStatus}`);
// // //     }

// // //     res.json({ status: true, message: "Return status updated", order });
// // //   } catch (err) {
// // //     res.status(500).json({ status: false, message: "Error updating return status" });
// // //   }
// // // });
// // // adminRoutes.js mein yeh route update karein
// // router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const { returnStatus } = req.body;
// //     const validStatuses = ["Not Returned", "Requested", "Returned"];

// //     if (!validStatuses.includes(returnStatus)) {
// //       return res.status(400).json({ status: false, message: "Invalid return status" });
// //     }

// //     const order = await Order.findOne({ orderId: req.params.orderId });
// //     if (!order) {
// //       return res.status(404).json({ status: false, message: "Order not found" });
// //     }

// //     const oldReturnStatus = order.returnStatus;

// //     if (returnStatus === "Returned" && oldReturnStatus !== "Returned") {
// //       for (const item of order.items || []) {
// //         if (!item.productId) continue;
// //         const qty = Number(item.quantity) || 0;
// //         if (qty <= 0) continue;

// //         try {
// //           if (item.size === "Custom") {
// //             await Product.findByIdAndUpdate(
// //               item.productId,
// //               { $inc: { customStock: qty } }
// //             );
// //           } else {
// //             await Product.findByIdAndUpdate(
// //               item.productId,
// //               { $inc: { [`stock.${item.size}`]: qty } }
// //             );
// //           }
// //           console.log(`Stock restored: productId=${item.productId} size=${item.size} qty=${qty}`);
// //         } catch (e) {
// //           console.warn(`Stock restore failed for ${item.productId}: ${e.message}`);
// //         }
// //       }
// //     }

// //     order.returnStatus = returnStatus;
// //     await order.save();

// //     if (order.userId) {
// //       await Notification.create({
// //         userId: order.userId.toString(),
// //         role: "user",
// //         type: "order",
// //         message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
// //         read: false,
// //       });
// //     }

// //     res.json({ status: true, message: "Return status updated", order });
// //   } catch (err) {
// //     console.error("Return status error:", err);
// //     res.status(500).json({
// //       status: false,
// //       message: err.message || "Error updating return status",
// //     });
// //   }
// // });

// // // router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
// // //   try {
// // //     const { returnStatus } = req.body;
// // //     const validStatuses = ["Not Returned", "Requested", "Returned"];
    
// // //     if (!validStatuses.includes(returnStatus)) {
// // //       return res.status(400).json({ status: false, message: "Invalid return status" });
// // //     }

// // //     const order = await Order.findOne({ orderId: req.params.orderId });
// // //     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

// // //     const oldReturnStatus = order.returnStatus;
// // //     order.returnStatus = returnStatus;

// // //     // ✅ STOCK RESTORE - Jab admin "Returned" status set kare
// // //     if (returnStatus === "Returned" && oldReturnStatus !== "Returned") {
// // //       for (let item of order.items) {
// // //         const product = await Product.findById(item.productId);
// // //         if (!product) continue;

// // //         if (item.size === "Custom") {
// // //           product.customStock += item.quantity;
// // //         } else {
// // //           product.stock[item.size] = (product.stock[item.size] || 0) + item.quantity;
// // //         }

// // //         await product.save();
// // //         console.log(`✅ Stock restored for ${product.name} - Size: ${item.size}, Qty: ${item.quantity}`);
// // //       }
// // //     }

// // //     await order.save();

// // //     // ✅ User ko notification bhejein
// // //     if (order.userId) {
// // //       await Notification.create({
// // //         userId: order.userId.toString(),
// // //         role: "user",
// // //         type: "order",
// // //         message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
// // //         read: false,
// // //       });
      
// // //       console.log(`📧 Notification sent to user ${order.userId}`);
// // //     }

// // //     res.json({ status: true, message: "Return status updated", order });
// // //   } catch (err) {
// // //     console.error("Return status error:", err);
// // //     res.status(500).json({ status: false, message: "Error updating return status" });
// // //   }
// // // });
// // // DELETE /api/admin/orders/:orderId
// // router.delete("/orders/:orderId", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const { orderId } = req.params;
// //     const order = await Order.findOne({ orderId });

// //     if (!order) return res.status(404).json({ message: "Order not found" });

// //     if (order.status !== "Cancelled") {
// //       return res.status(400).json({ message: "Only cancelled orders can be deleted" });
// //     }

// //     await Order.deleteOne({ orderId });

// //     await Notification.create({
// //       userId: order.userId || null,
// //       role: "admin",
// //       type: "order",
// //       message: `Cancelled order ${orderId} deleted by admin`,
// //       read: false,
// //     });

// //     res.json({ message: "Cancelled order deleted successfully" });
// //   } catch (err) {
// //     console.error("Delete order error:", err);
// //     res.status(500).json({ message: "Failed to delete order", error: err.message });
// //   }
// // });



// // router.get("/products/stock", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const products = await Product.find().sort({ dateAdded: -1 });


// //     const productsWithStatus = products.map((p) => {
// //       const totalStock = Object.values(p.stock || {}).reduce((acc, val) => acc + val, 0) + (p.customStock || 0);
// //       return {
// //         ...p._doc,
// //         available: totalStock > 0
// //       };
// //     });

// //     res.json(productsWithStatus);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // router.put("/products/:id/stock", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const { size, quantity, type } = req.body;
// //     let updateQuery;

// //     if (type === 'custom') {
// //       updateQuery = { $set: { customStock: Math.max(0, quantity) } };
// //     } else {
// //       updateQuery = { $set: { [`stock.${size}`]: Math.max(0, quantity) } };
// //     }

// //     const product = await Product.findByIdAndUpdate(req.params.id, updateQuery, { new: true });
// //     res.json(product);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });

// // router.get("/products/:id", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id);
// //     if (!product) return res.status(404).json({ message: "Product not found" });
// //     res.json(product);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Failed to fetch product" });
// //   }
// // });

// // router.put("/products/:id", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
// //   try {
// //     const { name, old_price, new_price, description, existingImages } = req.body;

// //     const updateData = {
// //       name,
// //       old_price: old_price ? Number(old_price) : 0,
// //       new_price: new_price ? Number(new_price) : 0,
// //       description: description ? description.split("\n").filter(line => line.trim()) : [],
// //     };

  
// //     let newImages = [];
// //     if (req.files && req.files.length > 0) {
// //       const results = await Promise.all(req.files.map(file =>
// //         cloudinary.uploader.upload(file.path, { folder: "stylehub/products" })
// //       ));
// //       newImages = results.map(r => r.secure_url);
// //     }

// //     let oldImages = [];
// //     if (existingImages) {
// //       oldImages = JSON.parse(existingImages);
// //     }

// //     updateData.images = [...oldImages, ...newImages];

// //     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
// //     if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

// //     res.json({ message: "Product updated successfully", product: updatedProduct });
// //   } catch (error) {
// //     console.error("Update product error:", error);
// //     res.status(500).json({ error: "Something went wrong while updating the product" });
// //   }
// // });


// // router.post("/products", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
// //   try {
// //     console.log("REQ.BODY:", req.body);
// //     console.log("REQ.FILES:", req.files);

// //     const { name, category, subCategory, new_price, old_price, description, stock, customStock } = req.body;

// //     if (!name || !category || !subCategory || !new_price) {
// //       return res.status(400).json({ message: "Name, category, subCategory, and new_price are required." });
// //     }

// //     let imageUrls = [];
// //     if (req.files && req.files.length > 0) {
// //       const results = await Promise.all(
// //         req.files.map(file =>
// //           cloudinary.uploader.upload(file.path, { folder: "stylehub/products" })
// //         )
// //       );
// //       imageUrls = results.map(r => r.secure_url);
// //     }

  
// //     let parsedStock = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
// //     if (stock) parsedStock = JSON.parse(stock);
// //     Object.keys(parsedStock).forEach(key => parsedStock[key] = Number(parsedStock[key]));

// //     const parsedCustomStock = Number(customStock || 0);
// //     const newPriceNum = Number(new_price);
// //     const oldPriceNum = old_price ? Number(old_price) : 0;
// //     const descriptionArr = description ? description.split("\n").map(l => l.trim()).filter(l => l) : [];

// //     const product = new Product({
// //       name,
// //       category,
// //       subCategory,
// //       images: imageUrls,
// //       new_price: newPriceNum,
// //       old_price: oldPriceNum,
// //       description: descriptionArr,
// //       stock: parsedStock,
// //       customStock: parsedCustomStock,
// //       available: true,
// //       dateAdded: new Date()
// //     });

// //     await product.save();
// //     console.log("Product saved successfully:", product.name);
// //     res.status(201).json({ message: "Product added successfully", product });
// //   } catch (error) {
// //     console.error("Failed to add product:", error);
// //     res.status(500).json({ message: "Failed to add product", error: error.message });
// //   }
// // });

// // router.delete("/products/:id", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const product = await Product.findByIdAndDelete(req.params.id);
// //     if (!product) {
// //       return res.status(404).json({ message: "Product not found" });
// //     }
// //     res.status(200).json({ message: "Product deleted successfully" });
// //   } catch (error) {
// //     res.status(500).json({ message: "Failed to delete product", error: error.message });
// //   }
// // });




// // module.exports = router;    

// const express = require("express");
// const router = express.Router();
// const { verifyTokenAndAdmin } = require("../middlewares/authMiddleware");
// const User = require("../models/User");
// const Product = require("../models/Product");
// const Order = require("../models/Order");
// const upload = require("../config/multer");
// const Notification = require("../models/Notification");
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const cloudinary = require("../config/cloudinary");
// const { getAdminProfile, updateAdminProfile } = require('../controllers/adminProfile');
// const {
//   getMainCategories,
//   getSubcategoriesByParent,
//   createCategory,
//   updateCategory,
//   deleteCategory,
//   toggleCategoryStatus,
//   addSubcategory,
//   updateSubcategory,
//   deleteSubcategory,
//   getCategoryStats
// } = require("../controllers/categoryController");



// router.get("/profile", verifyTokenAndAdmin, getAdminProfile);

// router.put(
//   "/profile/update",
//   verifyTokenAndAdmin,
//   upload.single("avatar"), 
//   updateAdminProfile
// );


// router.get("/dashboard", verifyTokenAndAdmin, (req, res) => {
//   res.json({ message: "Welcome to Admin Dashboard", user: req.user });
// });


// router.get("/categories/main", getMainCategories);
// router.get("/categories/parent/:parentId", getSubcategoriesByParent);
// router.post("/categories", verifyTokenAndAdmin, upload.single("image"), createCategory);
// router.put("/categories/:id", verifyTokenAndAdmin, upload.single("image"), updateCategory);
// router.delete("/categories/:id", verifyTokenAndAdmin, deleteCategory);
// router.put("/categories/:id/toggle-status", verifyTokenAndAdmin, toggleCategoryStatus);


// router.post("/categories/:id/sub", verifyTokenAndAdmin, upload.single("image"), addSubcategory);
// router.put("/categories/:id/sub/:subId", verifyTokenAndAdmin, upload.single("image"), updateSubcategory);
// router.delete("/categories/:id/sub/:subId", verifyTokenAndAdmin, deleteSubcategory);
// router.get("/categories/stats", verifyTokenAndAdmin, getCategoryStats);

// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const usersCount = await User.countDocuments();
//     const productsCount = await Product.countDocuments();
//     const ordersCount = await Order.countDocuments();
//     const categoriesCount = await Product.distinct("category");
//     const subcategoriesCount = await Product.distinct("subCategory");

//     const pendingOrders = await Order.countDocuments({ status: "Pending" });
//     const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
//     const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });
//     const returnedOrders = await Order.countDocuments({ returnStatus: "Returned" });

//     res.json({
//       users: usersCount,
//       products: productsCount,
//       orders: ordersCount,
//       categories: categoriesCount.length,
//       subcategories: subcategoriesCount.length,
//       pendingOrders,
//       deliveredOrders,
//       cancelledOrders,
//       returnedOrders,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching stats" });
//   }
// });


// router.get("/users", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const users = await User.find(); 
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/admin/admins — sab admins ki list
// router.get("/admins", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const admins = await User.find({ role: "admin" }).select("-password -otp");
//     res.status(200).json({
//       status: true,
//       count: admins.length,
//       admins,
//     });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// });
// // DELETE /api/admin/admins/:id — kisi admin ko delete karna
// router.delete("/admins/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const targetId = req.params.id;

//     // Khud ko is route se delete nahi kar sakte (self-delete ke liye alag route hai)
//     if (targetId === req.user.id) {
//       return res.status(400).json({
//         status: false,
//         message: "Apne aap ko yahan se delete nahi kar sakte. Profile page se karo.",
//       });
//     }

//     // Target user check karo
//     const target = await User.findById(targetId);
//     if (!target) {
//       return res.status(404).json({ status: false, message: "Admin nahi mila" });
//     }

//     if (target.role !== "admin") {
//       return res.status(400).json({ status: false, message: "Yeh user admin nahi hai" });
//     }

//     // Safety: aakhri admin delete nahi hone dena
//     const adminCount = await User.countDocuments({ role: "admin" });
//     if (adminCount <= 1) {
//       return res.status(400).json({
//         status: false,
//         message: "Cannot delete the last admin. At least one admin is required in the system.",
//       });
//     }

//     await User.findByIdAndDelete(targetId);

//     res.status(200).json({
//       status: true,
//       message: `Admin "${target.email}" has been deleted`,
//     });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// });
// router.put("/users/:id/make-admin", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ status: false, message: "User not found" });
//     if (user.role === "admin") return res.status(400).json({ status: false, message: "Already an admin" });

//     user.role = "admin";
//     await user.save();

//     res.json({ status: true, message: `${user.email} is now an admin` });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// });

// router.delete("/users/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// router.delete("/profile/delete", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const adminId = req.user.id;

//     const admin = await User.findById(adminId);
//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     // Safety check: last admin delete na ho jaye
//     const adminCount = await User.countDocuments({ role: "admin" });
//     if (adminCount <= 1) {
//       return res.status(400).json({
//         message: "Cannot delete the only remaining admin account. Create another admin first.",
//       });
//     }

//     await User.findByIdAndDelete(adminId);

//     res.status(200).json({ message: "Admin account deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// router.get("/orders", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 }).lean();
//     res.status(200).json({ status: true, orders });
//   } catch (err) {
//     res.status(500).json({ status: false, message: "Error fetching orders" });
//   }
// });

// router.get("/orders/:orderId", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const order = await Order.findOne({ orderId: req.params.orderId }).lean();
//     if (!order) return res.status(404).json({ status: false, message: "Order not found" });
//     res.status(200).json({ status: true, order });
//   } catch (err) {
//     res.status(500).json({ status: false, message: "Error fetching order details" });
//   }
// });
// // 
// router.put("/orders/:orderId/status", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const { status } = req.body;
//     // ✅ Cancelled add kiya
//     if (!["Pending", "Shipped", "Delivered", "Cancelled"].includes(status)) {
//       return res.status(400).json({ status: false, message: "Invalid status" });
//     }

//     const order = await Order.findOneAndUpdate(
//       { orderId: req.params.orderId },
//       { status },
//       { new: true }
//     ).lean();

//     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

//     if (order.userId) {
//       await Notification.create({
//         userId: order.userId.toString(),
//         role: "user",
//         type: "order",
//         message: `Your order ${req.params.orderId} status updated to ${status}`,
//         read: false,
//       });
//     }

//     res.json({ status: true, message: "Order status updated", order });
//   } catch (err) {
//     console.error("Update status error:", err);
//     res.status(500).json({ status: false, message: "Error updating order status" });
//   }
// });
// // router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const { returnStatus } = req.body;
// //     const validStatuses = ["Not Returned", "Requested", "Returned"];
// //     if (!validStatuses.includes(returnStatus)) {
// //       return res.status(400).json({ status: false, message: "Invalid return status" });
// //     }

// //     const order = await Order.findOneAndUpdate(
// //       { orderId: req.params.orderId },
// //       { returnStatus },
// //       { new: true }
// //     ).lean();

// //     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

// //     // ADD THIS: Create notification when admin updates return status
// //     if (order.userId) {
// //       await Notification.create({
// //         userId: order.userId.toString(),
// //         role: "user",
// //         type: "order",
// //         message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
// //         read: false,
// //       });
      
// //       console.log(`Created notification for user ${order.userId} - Order ${req.params.orderId} return status updated to ${returnStatus}`);
// //     }

// //     res.json({ status: true, message: "Return status updated", order });
// //   } catch (err) {
// //     res.status(500).json({ status: false, message: "Error updating return status" });
// //   }
// // });
// // adminRoutes.js mein yeh route update karein
// router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const { returnStatus } = req.body;
//     const validStatuses = ["Not Returned", "Requested", "Returned"];

//     if (!validStatuses.includes(returnStatus)) {
//       return res.status(400).json({ status: false, message: "Invalid return status" });
//     }

//     const order = await Order.findOne({ orderId: req.params.orderId });
//     if (!order) {
//       return res.status(404).json({ status: false, message: "Order not found" });
//     }

//     const oldReturnStatus = order.returnStatus;

//     if (returnStatus === "Returned" && oldReturnStatus !== "Returned") {
//       for (const item of order.items || []) {
//         if (!item.productId) continue;
//         const qty = Number(item.quantity) || 0;
//         if (qty <= 0) continue;

//         try {
//           if (item.size === "Custom") {
//             await Product.findByIdAndUpdate(
//               item.productId,
//               { $inc: { customStock: qty } }
//             );
//           } else {
//             await Product.findByIdAndUpdate(
//               item.productId,
//               { $inc: { [`stock.${item.size}`]: qty } }
//             );
//           }
//           console.log(`Stock restored: productId=${item.productId} size=${item.size} qty=${qty}`);
//         } catch (e) {
//           console.warn(`Stock restore failed for ${item.productId}: ${e.message}`);
//         }
//       }
//     }

//     order.returnStatus = returnStatus;
//     await order.save();

//     if (order.userId) {
//       await Notification.create({
//         userId: order.userId.toString(),
//         role: "user",
//         type: "order",
//         message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
//         read: false,
//       });
//     }

//     res.json({ status: true, message: "Return status updated", order });
//   } catch (err) {
//     console.error("Return status error:", err);
//     res.status(500).json({
//       status: false,
//       message: err.message || "Error updating return status",
//     });
//   }
// });

// // router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
// //   try {
// //     const { returnStatus } = req.body;
// //     const validStatuses = ["Not Returned", "Requested", "Returned"];
    
// //     if (!validStatuses.includes(returnStatus)) {
// //       return res.status(400).json({ status: false, message: "Invalid return status" });
// //     }

// //     const order = await Order.findOne({ orderId: req.params.orderId });
// //     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

// //     const oldReturnStatus = order.returnStatus;
// //     order.returnStatus = returnStatus;

// //     // ✅ STOCK RESTORE - Jab admin "Returned" status set kare
// //     if (returnStatus === "Returned" && oldReturnStatus !== "Returned") {
// //       for (let item of order.items) {
// //         const product = await Product.findById(item.productId);
// //         if (!product) continue;

// //         if (item.size === "Custom") {
// //           product.customStock += item.quantity;
// //         } else {
// //           product.stock[item.size] = (product.stock[item.size] || 0) + item.quantity;
// //         }

// //         await product.save();
// //         console.log(`✅ Stock restored for ${product.name} - Size: ${item.size}, Qty: ${item.quantity}`);
// //       }
// //     }

// //     await order.save();

// //     // ✅ User ko notification bhejein
// //     if (order.userId) {
// //       await Notification.create({
// //         userId: order.userId.toString(),
// //         role: "user",
// //         type: "order",
// //         message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
// //         read: false,
// //       });
      
// //       console.log(`📧 Notification sent to user ${order.userId}`);
// //     }

// //     res.json({ status: true, message: "Return status updated", order });
// //   } catch (err) {
// //     console.error("Return status error:", err);
// //     res.status(500).json({ status: false, message: "Error updating return status" });
// //   }
// // });
// // DELETE /api/admin/orders/:orderId
// router.delete("/orders/:orderId", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const order = await Order.findOne({ orderId });

//     if (!order) return res.status(404).json({ message: "Order not found" });

//     if (order.status !== "Cancelled") {
//       return res.status(400).json({ message: "Only cancelled orders can be deleted" });
//     }

//     await Order.deleteOne({ orderId });

//     await Notification.create({
//       userId: order.userId || null,
//       role: "admin",
//       type: "order",
//       message: `Cancelled order ${orderId} deleted by admin`,
//       read: false,
//     });

//     res.json({ message: "Cancelled order deleted successfully" });
//   } catch (err) {
//     console.error("Delete order error:", err);
//     res.status(500).json({ message: "Failed to delete order", error: err.message });
//   }
// });



// router.get("/products/stock", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const products = await Product.find().sort({ dateAdded: -1 });


//     const productsWithStatus = products.map((p) => {
//       const totalStock = Object.values(p.stock || {}).reduce((acc, val) => acc + val, 0) + (p.customStock || 0);
//       return {
//         ...p._doc,
//         available: totalStock > 0
//       };
//     });

//     res.json(productsWithStatus);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.put("/products/:id/stock", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const { size, quantity, type } = req.body;
//     let updateQuery;

//     if (type === 'custom') {
//       updateQuery = { $set: { customStock: Math.max(0, quantity) } };
//     } else {
//       updateQuery = { $set: { [`stock.${size}`]: Math.max(0, quantity) } };
//     }

//     const product = await Product.findByIdAndUpdate(req.params.id, updateQuery, { new: true });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get("/products/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch product" });
//   }
// });

// router.put("/products/:id", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
//   try {
//     const { name, old_price, new_price, description, existingImages } = req.body;

//     const updateData = {
//       name,
//       old_price: old_price ? Number(old_price) : 0,
//       new_price: new_price ? Number(new_price) : 0,
//       description: description ? description.split("\n").filter(line => line.trim()) : [],
//     };

  
//     let newImages = [];
//     if (req.files && req.files.length > 0) {
//       const results = await Promise.all(req.files.map(file =>
//         cloudinary.uploader.upload(file.path, { folder: "stylehub/products" })
//       ));
//       newImages = results.map(r => r.secure_url);
//     }

//     let oldImages = [];
//     if (existingImages) {
//       oldImages = JSON.parse(existingImages);
//     }

//     updateData.images = [...oldImages, ...newImages];

//     const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
//     if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

//     res.json({ message: "Product updated successfully", product: updatedProduct });
//   } catch (error) {
//     console.error("Update product error:", error);
//     res.status(500).json({ error: "Something went wrong while updating the product" });
//   }
// });


// router.post("/products", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
//   try {
//     console.log("REQ.BODY:", req.body);
//     console.log("REQ.FILES:", req.files);

//     const { name, category, subCategory, new_price, old_price, description, stock, customStock } = req.body;

//     if (!name || !category || !subCategory || !new_price) {
//       return res.status(400).json({ message: "Name, category, subCategory, and new_price are required." });
//     }

//     let imageUrls = [];
//     if (req.files && req.files.length > 0) {
//       const results = await Promise.all(
//         req.files.map(file =>
//           cloudinary.uploader.upload(file.path, { folder: "stylehub/products" })
//         )
//       );
//       imageUrls = results.map(r => r.secure_url);
//     }

  
//     let parsedStock = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
//     if (stock) parsedStock = JSON.parse(stock);
//     Object.keys(parsedStock).forEach(key => parsedStock[key] = Number(parsedStock[key]));

//     const parsedCustomStock = Number(customStock || 0);
//     const newPriceNum = Number(new_price);
//     const oldPriceNum = old_price ? Number(old_price) : 0;
//     const descriptionArr = description ? description.split("\n").map(l => l.trim()).filter(l => l) : [];

//     const product = new Product({
//       name,
//       category,
//       subCategory,
//       images: imageUrls,
//       new_price: newPriceNum,
//       old_price: oldPriceNum,
//       description: descriptionArr,
//       stock: parsedStock,
//       customStock: parsedCustomStock,
//       available: true,
//       dateAdded: new Date()
//     });

//     await product.save();
//     console.log("Product saved successfully:", product.name);
//     res.status(201).json({ message: "Product added successfully", product });
//   } catch (error) {
//     console.error("Failed to add product:", error);
//     res.status(500).json({ message: "Failed to add product", error: error.message });
//   }
// });

// router.delete("/products/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete product", error: error.message });
//   }
// });
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) return res.status(404).json({ message: "Admin not found" });

//     if (user.role !== "admin") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.json({
//       message: "Admin login successful",
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar,
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });



// module.exports = router;
const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const upload = require("../config/multer");
const Notification = require("../models/Notification");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cloudinary = require("../config/cloudinary");
const { getAdminProfile, updateAdminProfile } = require('../controllers/adminProfile');
const {
  getMainCategories,
  getSubcategoriesByParent,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getCategoryStats
} = require("../controllers/categoryController");

router.get("/profile", verifyTokenAndAdmin, getAdminProfile);

router.put(
  "/profile/update",
  verifyTokenAndAdmin,
  upload.single("avatar"),
  updateAdminProfile
);

router.get("/dashboard", verifyTokenAndAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard", user: req.user });
});

router.get("/categories/main", getMainCategories);
router.get("/categories/parent/:parentId", getSubcategoriesByParent);
router.post("/categories", verifyTokenAndAdmin, upload.single("image"), createCategory);
router.put("/categories/:id", verifyTokenAndAdmin, upload.single("image"), updateCategory);
router.delete("/categories/:id", verifyTokenAndAdmin, deleteCategory);
router.put("/categories/:id/toggle-status", verifyTokenAndAdmin, toggleCategoryStatus);

router.post("/categories/:id/sub", verifyTokenAndAdmin, upload.single("image"), addSubcategory);
router.put("/categories/:id/sub/:subId", verifyTokenAndAdmin, upload.single("image"), updateSubcategory);
router.delete("/categories/:id/sub/:subId", verifyTokenAndAdmin, deleteSubcategory);
router.get("/categories/stats", verifyTokenAndAdmin, getCategoryStats);

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const categoriesCount = await Product.distinct("category");
    const subcategoriesCount = await Product.distinct("subCategory");

    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });
    const returnedOrders = await Order.countDocuments({ returnStatus: "Returned" });

    res.json({
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      categories: categoriesCount.length,
      subcategories: subcategoriesCount.length,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

router.get("/users", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/admins", verifyTokenAndAdmin, async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password -otp");
    res.status(200).json({ status: true, count: admins.length, admins });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

router.delete("/admins/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const targetId = req.params.id;

    if (targetId === req.user.id) {
      return res.status(400).json({
        status: false,
        message: "Apne aap ko yahan se delete nahi kar sakte. Profile page se karo.",
      });
    }

    const target = await User.findById(targetId);
    if (!target) return res.status(404).json({ status: false, message: "Admin nahi mila" });
    if (target.role !== "admin") return res.status(400).json({ status: false, message: "Yeh user admin nahi hai" });

    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res.status(400).json({
        status: false,
        message: "Cannot delete the last admin. At least one admin is required in the system.",
      });
    }

    await User.findByIdAndDelete(targetId);
    res.status(200).json({ status: true, message: `Admin "${target.email}" has been deleted` });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

router.put("/users/:id/make-admin", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ status: false, message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ status: false, message: "Already an admin" });

    user.role = "admin";
    await user.save();
    res.json({ status: true, message: `${user.email} is now an admin` });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
});

router.delete("/users/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/profile/delete", verifyTokenAndAdmin, async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res.status(400).json({
        message: "Cannot delete the only remaining admin account. Create another admin first.",
      });
    }

    await User.findByIdAndDelete(adminId);
    res.status(200).json({ message: "Admin account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/orders", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ status: true, orders });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching orders" });
  }
});

router.get("/orders/:orderId", verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).lean();
    if (!order) return res.status(404).json({ status: false, message: "Order not found" });
    res.status(200).json({ status: true, order });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching order details" });
  }
});

router.put("/orders/:orderId/status", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Shipped", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ status: false, message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    ).lean();

    if (!order) return res.status(404).json({ status: false, message: "Order not found" });

    if (order.userId) {
      await Notification.create({
        userId: order.userId.toString(),
        role: "user",
        type: "order",
        message: `Your order ${req.params.orderId} status updated to ${status}`,
        read: false,
      });
    }

    res.json({ status: true, message: "Order status updated", order });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ status: false, message: "Error updating order status" });
  }
});

router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { returnStatus } = req.body;
    const validStatuses = ["Not Returned", "Requested", "Returned"];

    if (!validStatuses.includes(returnStatus)) {
      return res.status(400).json({ status: false, message: "Invalid return status" });
    }

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ status: false, message: "Order not found" });

    const oldReturnStatus = order.returnStatus;

    if (returnStatus === "Returned" && oldReturnStatus !== "Returned") {
      for (const item of order.items || []) {
        if (!item.productId) continue;
        const qty = Number(item.quantity) || 0;
        if (qty <= 0) continue;

        try {
          if (item.size === "Custom") {
            await Product.findByIdAndUpdate(item.productId, { $inc: { customStock: qty } });
          } else {
            await Product.findByIdAndUpdate(item.productId, { $inc: { [`stock.${item.size}`]: qty } });
          }
        } catch (e) {
          console.warn(`Stock restore failed for ${item.productId}: ${e.message}`);
        }
      }
    }

    order.returnStatus = returnStatus;
    await order.save();

    if (order.userId) {
      await Notification.create({
        userId: order.userId.toString(),
        role: "user",
        type: "order",
        message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
        read: false,
      });
    }

    res.json({ status: true, message: "Return status updated", order });
  } catch (err) {
    console.error("Return status error:", err);
    res.status(500).json({ status: false, message: err.message || "Error updating return status" });
  }
});

router.delete("/orders/:orderId", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "Cancelled") {
      return res.status(400).json({ message: "Only cancelled orders can be deleted" });
    }

    await Order.deleteOne({ orderId });

    await Notification.create({
      userId: order.userId || null,
      role: "admin",
      type: "order",
      message: `Cancelled order ${orderId} deleted by admin`,
      read: false,
    });

    res.json({ message: "Cancelled order deleted successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Failed to delete order", error: err.message });
  }
});

// ✅ FIX: p._doc ki jagah p.toObject() use kiya — Mixed type stock ke saath _doc spread fail hota tha
// router.get("/products/stock", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const products = await Product.find().sort({ dateAdded: -1 });

//     const productsWithStatus = products.map((p) => {
//       const stockObj = p.stock ? p.stock.toObject ? p.stock.toObject() : Object.fromEntries(p.stock) : {};
//       const totalStock = Object.values(stockObj).reduce((acc, val) => acc + (Number(val) || 0), 0) + (p.customStock || 0);
//       return {
//         ...p.toObject(),        // ✅ _doc ki jagah toObject() — safe aur reliable
//         available: totalStock > 0,
//       };
//     });

//     res.json(productsWithStatus);
//   } catch (error) {
//     console.error("Products stock error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });
router.get("/products/stock", verifyTokenAndAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ dateAdded: -1 });

    const productsWithStatus = products.map((p) => {
      const raw = p.toObject();
      const stockValues = raw.stock ? Object.values(raw.stock) : [];
      const totalStock = stockValues.reduce((acc, val) => acc + (Number(val) || 0), 0) + (raw.customStock || 0);
      return { ...raw, available: totalStock > 0 };
    });

    res.json(productsWithStatus);
  } catch (error) {
    console.error("Products stock error:", error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
});
router.put("/products/:id/stock", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { size, quantity, type } = req.body;
    let updateQuery;

    if (type === 'custom') {
      updateQuery = { $set: { customStock: Math.max(0, quantity) } };
    } else {
      updateQuery = { $set: { [`stock.${size}`]: Math.max(0, quantity) } };
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateQuery, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/products/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

router.put("/products/:id", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
  try {
    const { name, old_price, new_price, description, existingImages } = req.body;

    const updateData = {
      name,
      old_price: old_price ? Number(old_price) : 0,
      new_price: new_price ? Number(new_price) : 0,
      description: description ? description.split("\n").filter(line => line.trim()) : [],
    };

    let newImages = [];
    if (req.files && req.files.length > 0) {
      const results = await Promise.all(req.files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: "stylehub/products" })
      ));
      newImages = results.map(r => r.secure_url);
    }

    let oldImages = [];
    if (existingImages) oldImages = JSON.parse(existingImages);

    updateData.images = [...oldImages, ...newImages];

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Something went wrong while updating the product" });
  }
});

router.post("/products", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
  try {
    const { name, category, subCategory, new_price, old_price, description, stock, customStock } = req.body;

    if (!name || !category || !subCategory || !new_price) {
      return res.status(400).json({ message: "Name, category, subCategory, and new_price are required." });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const results = await Promise.all(
        req.files.map(file => cloudinary.uploader.upload(file.path, { folder: "stylehub/products" }))
      );
      imageUrls = results.map(r => r.secure_url);
    }

    let parsedStock = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
    if (stock) parsedStock = JSON.parse(stock);
    Object.keys(parsedStock).forEach(key => parsedStock[key] = Number(parsedStock[key]));

    const product = new Product({
      name,
      category,
      subCategory,
      images: imageUrls,
      new_price: Number(new_price),
      old_price: old_price ? Number(old_price) : 0,
      description: description ? description.split("\n").map(l => l.trim()).filter(l => l) : [],
      stock: parsedStock,
      customStock: Number(customStock || 0),
      available: true,
      dateAdded: new Date()
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Failed to add product:", error);
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
});

router.delete("/products/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "Admin not found" });
    if (user.role !== "admin") return res.status(403).json({ message: "Access denied. Admins only." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;