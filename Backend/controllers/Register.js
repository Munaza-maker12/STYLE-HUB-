
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const registerUser = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const { error: validationError } = validateUser(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError.details[0].message });
  }

  try {
    const formattedEmail = email.toLowerCase();
    const formattedName = name.toLowerCase();

    const existingUser = await User.findOne({ email: formattedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'This email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: formattedName,
      email: formattedEmail,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user',
    });

    await user.save();

     await Notification.create({
      userId: null,
      role: "admin",
      type: "user",
      message: ` New user registered: ${formattedName} (${formattedEmail})`,
      read: false,
    });
    console.log(`✅ Admin notified about new user: ${formattedName}`);
    const token = jwt.sign(
      { 
        id: user._id.toString(),  
        email: user.email, 
        role: user.role 
      },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: "7d" }
    );

   
    console.log("Registration token generated successfully");

    const { password: _, ...userWithoutPassword } = user._doc;

    res.status(201).json({
      message: "User registered successfully",
      status: true,
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    next(error);
  }
};

function validateUser(data) {
  const userSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
    role: Joi.string().optional()
  });

  return userSchema.validate(data);
}

module.exports = { registerUser };