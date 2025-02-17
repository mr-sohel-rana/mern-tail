const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const jwtSecret = process.env.JWT_SECRET || "default-secret-key";

 
 // Middleware to check if the user is signed in
const requireSignIn = async (req, res, next) => {
  try {
    let token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    console.log("Token from cookies or headers:", token);  // Log the token

    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, jwtSecret);
    console.log("Decoded token:", decoded);  // Log the decoded token

    req.user = { _id: decoded.user_id, ...decoded };  // Use user_id consistently

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};


// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user._id);  // Fix here: use _id instead of user_id
    if (!user || user.role !== 1) {
      return res.status(403).json({ message: "Unauthorized access, admin privileges required" });
    }
    next();
  } catch (error) {
    console.error("Error verifying admin role:", error);
    res.status(500).json({ message: "Internal server error while checking admin status" });
  }
};

module.exports = { requireSignIn, isAdmin };
