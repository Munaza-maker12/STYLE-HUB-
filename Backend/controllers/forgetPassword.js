// // const crypto = require('crypto');
// // const User = require('../models/User');
// // const sendMailer = require('../utils/sendMailer');

// // const forgetPasswordHandler = async (req, res, next) => {
// //   const { email } = req.body;

// //   try {
// //     if (!email) {
// //       const error = new Error("Email is required");
// //       error.statusCode = 400;
// //       throw error;
// //     }

// //     const formattedEmail = email.toLowerCase();
// //     const user = await User.findOne({ email: formattedEmail });

// //     if (!user) {
// //       const error = new Error("User not found");
// //       error.statusCode = 404;
// //       throw error;
// //     }

// //     // Rate limiting OTP requests (1 per 60 sec)
// //     if (user.otp?.sendTime && Date.now() - user.otp.sendTime < 60 * 1000) {
// //       const waitTime = new Date(user.otp.sendTime + 60 * 1000).toLocaleTimeString();
// //       const error = new Error(`Please wait until ${waitTime} to request another OTP`);
// //       error.statusCode = 429;
// //       throw error;
// //     }

// //     const otp = Math.floor(Math.random() * 900000) + 100000;
// //     const token = crypto.randomBytes(32).toString('hex');

// //     user.otp = { otp, sendTime: Date.now(), token };
// //     await user.save();

// //     try {
// //       await sendMailer(otp, formattedEmail);
// //     } catch (mailError) {
// //       console.error(mailError);
// //       const error = new Error("Failed to send OTP email");
// //       error.statusCode = 500;
// //       throw error;
// //     }

// //     res.status(200).json({
// //       message: 'OTP sent successfully',
// //       status: true,
// //       token,
// //     });

// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // module.exports = { forgetPasswordHandler };

// // // const crypto = require('crypto');
// // // const User = require('../models/User');
// // // const sendMailer = require('../utils/sendMailer');
// // // const { send } = require('process');
// // // const forgetPasswordHandler = async (req, res, next) => {
// // //   const { email } = req.body;

// // //   try {
// // //     const formattedEmail = email.toLowerCase();
// // //     const findUser = await User.findOne({ email: formattedEmail });

// // //     if (!findUser) {
// // //       const error = new Error('User not found');
// // //       error.statusCode = 404;
// // //       throw error;
// // //     }

// // //     if (
// // //       findUser.otp &&
// // //       findUser.otp.sendTime &&
// // //       new Date().getTime() - findUser.otp.sendTime < 60 * 1000
// // //     ) {
// // //       const waitTime = new Date(findUser.otp.sendTime + 60 * 1000).toLocaleTimeString();
// // //       throw new Error(`Please wait until ${waitTime} to request another OTP`);
// // //     }

// // //     const otp = Math.floor(Math.random() * 900000) + 100000;
// // //     const token = crypto.randomBytes(32).toString('hex');

// // //     if (!findUser.otp) {
// // //       findUser.otp = {};
// // //     }

// // //     findUser.otp.otp = otp;
// // //     findUser.otp.sendTime = new Date().getTime(); 

// // //     findUser.otp.token = token;

// // //     await findUser.save();
// // //  sendMailer(otp, formattedEmail);



// // //     console.log("Generated OTP:", otp);
// // //     res.status(200).json({
// // //       message: 'Please check your email for the OTP',
// // //       status: true,
// // //       token,
// // //     });

// // //   } catch (error) {
// // //     next(error);
// // //   }
// // // };


// // // module.exports = { forgetPasswordHandler };

// const crypto = require('crypto');
// const User = require('../models/User');
// // const sendMailer = require('../utils/sendMailer'); // comment kar do

// const forgetPasswordHandler = async (req, res, next) => {
//   const { email } = req.body;

//   try {
//     if (!email) {
//       const error = new Error("Email is required");
//       error.statusCode = 400;
//       throw error;
//     }

//     const formattedEmail = email.toLowerCase();
//     const user = await User.findOne({ email: formattedEmail });

//     if (!user) {
//       const error = new Error("User not found");
//       error.statusCode = 404;
//       throw error;
//     }

//     if (user.otp?.sendTime && Date.now() - user.otp.sendTime < 60 * 1000) {
//       const waitTime = new Date(user.otp.sendTime + 60 * 1000).toLocaleTimeString();
//       const error = new Error(`Please wait until ${waitTime} to request another OTP`);
//       error.statusCode = 429;
//       throw error;
//     }

//     const otp = Math.floor(Math.random() * 900000) + 100000;
//     const token = crypto.randomBytes(32).toString('hex');

//     user.otp = { otp, sendTime: Date.now(), token };
//     await user.save();

//     // ✅ Development ke liye
//     console.log("🔑 OTP:", otp);
//     console.log("📧 Email:", formattedEmail);

//     // await sendMailer(otp, formattedEmail); // comment rakho abhi

//     res.status(200).json({
//       message: 'OTP sent successfully',
//       status: true,
//       token,
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = { forgetPasswordHandler };

const crypto = require('crypto');
const User = require('../models/User');
const sendMailer = require('../utils/sendMailer');

const forgetPasswordHandler = async (req, res, next) => {
  const { email } = req.body;

  try {
    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    const formattedEmail = email.toLowerCase();
    const user = await User.findOne({ email: formattedEmail });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.otp?.sendTime && Date.now() - user.otp.sendTime < 60 * 1000) {
      const waitTime = new Date(user.otp.sendTime + 60 * 1000).toLocaleTimeString();
      const error = new Error(`Please wait until ${waitTime} to request another OTP`);
      error.statusCode = 429;
      throw error;
    }

    const otp = Math.floor(Math.random() * 900000) + 100000;
    const token = crypto.randomBytes(32).toString('hex');

    user.otp = { otp, sendTime: Date.now(), token };
    await user.save();

    // OTP hamesha TEST_EMAIL pe jayega chahe koi bhi email form mein dale
    const sendTo = process.env.TEST_EMAIL;
    await sendMailer(otp, sendTo);

    console.log("🔑 OTP:", otp);
    console.log("📧 Bheja gaya:", sendTo);

    res.status(200).json({
      message: 'OTP sent successfully',
      status: true,
      token,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { forgetPasswordHandler };