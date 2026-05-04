
const User = require('../models/User');
const bcrypt = require('bcrypt');

const passwordUpdateHandler = async (req, res, next) => {
    const { password, confirmPassword, token } = req.body;

    try {
        const findUser = await User.findOne({ 'otp.token': token });
        if (!findUser) {
            const error = new Error('Something went wrong');
            error.statusCode = 400;
            throw error;
        }


        if (new Date(findUser.otp.sendTime).getTime() + 5 * 60 * 1000 < new Date().getTime()) {
            const error = new Error('OTP has expired');
            error.statusCode = 400;
            throw error;
        }

        if (password !== confirmPassword) {
            const error = new Error('Passwords do not match');
            error.statusCode = 400;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        findUser.password = hashedPassword;
        findUser.otp.sendTime = null;
        findUser.otp.token = null;
        await findUser.save();

        res.status(200).json({ message: 'Password updated successfully', status: true });

    } catch (error) {
        next(error);
    }
};

module.exports = { passwordUpdateHandler };
