
const jwt = require("jsonwebtoken"); 
const User = require("../models/User"); 

const verifyTokenAndAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    
    if (!decoded.role || decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = decoded;
    next();

  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Token verification failed" });
  }
};
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    
    // ✅ FIX: Check both 'id' and 'userId' since your tokens use 'id'
    const userId = decoded.id || decoded.userId;
    
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }
    
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Protect middleware error:", error.message);
    return res.status(401).json({ message: "Token verification failed" });
  }
};

module.exports = { protect, verifyTokenAndAdmin };