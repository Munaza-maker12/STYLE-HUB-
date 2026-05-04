



// const User = require('../models/User');

// const verifyOTPHandler = async (req, res, next) => {
//   const { otp } = req.body;

//   try {
//     if (!otp) {
//       const error = new Error("OTP is required");
//       error.statusCode = 400;
//       throw error;
//     }

//     const otpString = otp.toString();
//     const user = await User.findOne({ 'otp.otp': otpString });

//     if (!user) {
//       const error = new Error("Invalid OTP");
//       error.statusCode = 400;
//       throw error;
//     }

//     const otpValidDuration = 10 * 60 * 1000; // 10 minutes
//     if (!user.otp?.sendTime || Date.now() > user.otp.sendTime + otpValidDuration) {
//       const error = new Error("OTP has expired");
//       error.statusCode = 400;
//       throw error;
//     }

//     // Clear OTP after verification
//     user.otp = null;
//     await user.save();

//     res.status(200).json({
//       message: 'OTP verified successfully',
//       status: true,
//       userId: user._id,
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = { verifyOTPHandler };
const User = require('../models/User');

const verifyOTPHandler = async (req, res, next) => {
  const { otp, token } = req.body;

  try {
    if (!otp) {
      const error = new Error("OTP is required");
      error.statusCode = 400;
      throw error;
    }

    if (!token) {
      const error = new Error("Token is required");
      error.statusCode = 400;
      throw error;
    }

    const otpString = otp.toString();
    const user = await User.findOne({ 
      'otp.otp': otpString,
      'otp.token': token
    });

    if (!user) {
      const error = new Error("Invalid OTP or token");
      error.statusCode = 400;
      throw error;
    }

    const otpValidDuration = 10 * 60 * 1000;
    if (!user.otp?.sendTime || Date.now() > user.otp.sendTime + otpValidDuration) {
      const error = new Error("OTP has expired");
      error.statusCode = 400;
      throw error;
    }

    // ✅ Sirf otp clear karo, token rehne do taake password update ho sake
    user.otp.otp = null;
    await user.save();

    res.status(200).json({
      message: 'OTP verified successfully',
      status: true,
      userId: user._id,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { verifyOTPHandler };
