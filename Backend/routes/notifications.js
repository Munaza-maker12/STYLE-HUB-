
const express = require("express");
const Notification = require("../models/Notification");
const { protect, verifyTokenAndAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, role, type, message } = req.body;
    const notification = new Notification({ userId, role, type, message });
    await notification.save();
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get("/user/:userId", protect, async (req, res) => {
  try {
    console.log("Fetching notifications for userId:", req.params.userId);
    console.log("Param userId type:", typeof req.params.userId);
    console.log("User from token:", req.user._id);
    
    // Try both string and ObjectId queries
    const stringQuery = await Notification.find({
      userId: req.params.userId,
      role: "user"
    }).sort({ createdAt: -1 });
    
    console.log("String query results:", stringQuery.length);
    
    // Also try with ObjectId conversion
    const mongoose = require('mongoose');
    let objectIdQuery = [];
    try {
      objectIdQuery = await Notification.find({
        userId: new mongoose.Types.ObjectId(req.params.userId),
        role: "user"
      }).sort({ createdAt: -1 });
      console.log("ObjectId query results:", objectIdQuery.length);
    } catch (e) {
      console.log("ObjectId query failed:", e.message);
    }
    
    // Use whichever query returned results
    const notifications = stringQuery.length > 0 ? stringQuery : objectIdQuery;
    
    console.log(`Found ${notifications.length} user notifications for user ${req.params.userId}`);
    console.log("Notifications:", notifications.map(n => ({
      id: n._id,
      message: n.message,
      userId: n.userId,
      userIdType: typeof n.userId,
      createdAt: n.createdAt
    })));
    
    res.json({ success: true, notifications });
  } catch (error) {
    console.error("User notifications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/admin", verifyTokenAndAdmin, async (req, res) => {
  try {
    console.log("Admin notifications endpoint reached");
    
    const notifications = await Notification.find({ role: "admin" })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${notifications.length} admin notifications`);
    console.log("Admin notifications:", notifications.map(n => ({
      id: n._id,
      message: n.message,
      type: n.type,
      createdAt: n.createdAt
    })));
    
    res.json({ success: true, notifications });
  } catch (error) {
    console.error("Admin notifications error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    
    console.log("Notification marked as read:", req.params.id);
    res.json({ success: true, notification });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;