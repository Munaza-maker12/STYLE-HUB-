const Order = require('../models/Order'); 


const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId; 
    const orders = await Order.find({ order_userID: userId }).sort({ order_date: -1 });

    res.status(200).json({
      status: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserOrders };
