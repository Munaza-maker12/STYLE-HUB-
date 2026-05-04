// const nodeMailer = require('nodemailer');

// const sendMailer = (otp, email) => {
//   try {
//     const transporter = nodeMailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PASSWORD
//       }
//     });

//     // Check SMTP connection
//     transporter.verify((error, success) => {
//       if (error) {
//         console.log('❌ SMTP connection failed:', error);
//       } else {
//         console.log('✅ SMTP server is ready to send emails');
//       }
//     });

//     const mailOptions = {
//       from: process.env.EMAIL,
//       to: email,
//       subject: 'Password Reset OTP',
//       html: `
//         <div style="font-family: Arial, sans-serif; padding: 15px; border: 1px solid #ddd;">
//           <h2>Password Reset</h2>
//           <p>Your OTP is: <strong>${otp}</strong></p>
//         </div>
//       `
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error('❌ SendMail error:', error);
//         throw new Error('Failed to send email');
//       } else {
//         console.log('✅ Email sent successfully:', info.response);
//       }
//     });

//   } catch (error) {
//     console.log('📛 Error in sendMailer:', error.message);
//   }
// };

// module.exports = sendMailer;
// sendMailer.js - Fixed version
// const nodeMailer = require('nodemailer');

// const sendMailer = async (otp, email) => {
//   const transporter = nodeMailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD
//     }
//   });

//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: 'Password Reset OTP',
//     html: `
//       <div style="font-family: Arial, sans-serif; padding: 15px; border: 1px solid #ddd;">
//         <h2>Password Reset</h2>
//         <p>Your OTP is: <strong>${otp}</strong></p>
//       </div>
//     `
//   };

//   const info = await transporter.sendMail(mailOptions);
//   console.log('✅ Email sent:', info.response);
// };

// module.exports = sendMailer; 

const nodeMailer = require('nodemailer');

const sendMailer = async (otp, email) => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: `"Your Shop" <${process.env.EMAIL}>`,
    to: email,
    subject: '🔐 Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #333;">Password Reset</h2>
        <p style="color: #555;">Aapka OTP code:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #e74c3c; padding: 16px 0;">
          ${otp}
        </div>
        <p style="color: #999; font-size: 13px;">Yeh OTP 10 minutes mein expire ho jayega.</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('✅ Email sent:', info.response);
};

module.exports = sendMailer;
