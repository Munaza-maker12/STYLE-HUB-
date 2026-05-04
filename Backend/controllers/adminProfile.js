
const User = require('../models/User');
const Joi = require('joi');
const cloudinary = require('../config/cloudinary');


const getAdminProfile = async (req, res, next) => {
  try {
    // const adminId = req.user._id; 
     const adminId = req.user.userId;
    const admin = await User.findById(adminId).select('-password -otp');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
 
const updateAdminProfile = async (req, res, next) => {
  try {
    // const adminId = req.user._id;
     const adminId = req.user.userId;
    let updateData = {};

   
    if (req.body.name) {
      updateData.name = req.body.name.trim();
    }


    if (req.body.avatar) {
      updateData.avatar = req.body.avatar;
    }

   
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "stylehub/admins",
      });
      updateData.avatar = result.secure_url;
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      adminId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password -otp");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      message: "Profile updated successfully",
      profile: updatedAdmin,
    });
  } catch (error) {
    console.error("Update admin profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { getAdminProfile, updateAdminProfile };