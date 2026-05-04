const User = require('../models/User');

const getOTPTimeHandler = async (req, res, next) => {
  const { token } = req.body;

  try {
    const user = await User.findOne({ 'otp.token': token });

    if (!user || !user.otp || !user.otp.sendTime) {
      const error = new Error('User or OTP data not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'OTP send time retrieved successfully',
      status: true,
      sendTime: user.otp.sendTime
    });

  } catch (error) {
    next(error); 
  }
};

module.exports = { getOTPTimeHandler };
