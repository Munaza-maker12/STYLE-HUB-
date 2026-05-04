const express = require('express');
const router = express.Router();

// Import named controller functions 
const { registerUser } = require('../controllers/Register');
const { loginUser } = require('../controllers/login');
const { forgetPasswordHandler } = require('../controllers/forgetPassword');
const { verifyOTPHandler } = require('../controllers/verifyOTP');
const { getOTPTimeHandler } = require('../controllers/getOTPTime');
const { passwordUpdateHandler } = require('../controllers/passwordUpdate');
const getAccess = require('../controllers/getAccess');
const { updateProfile, getMeasurements, saveMeasurements } = require('../controllers/userController');


const parser = require('../config/multer');           
const { protect } = require('../middlewares/authMiddleware');
const User = require('../models/User');
router.post('/verify/otp', verifyOTPHandler);

router.post('/register', registerUser);                  
router.post('/login', loginUser);                       
router.post('/forget/password', forgetPasswordHandler);  
router.post('/get/otp/time', getOTPTimeHandler);        
router.post('/password/update', passwordUpdateHandler);  
router.put('/profile', protect, parser.single('avatar'), updateProfile);
router.get('/measurements', protect, getMeasurements);
router.put('/measurements', protect, saveMeasurements);
// router.post('/get/access', getAccess);  
router.post('/get/access', getAccess);  
// router.get("/:userId/measurements", async (req, res) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json({ measurements: user.measurements || {} });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// }); 
router.get('/:userId/measurements', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.params.userId).select('measurements');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ measurements: user.measurements || {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});             // Get access route 
// Wishlist routes
router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    // res.json({ wishlist: user.wishlist || [] });
    const updated = await User.findById(req.user._id).populate('wishlist');
res.json({ wishlist: updated.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;
    const isPresent = user.wishlist.includes(productId);

    if (isPresent) {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Export the router
module.exports = router;