import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    console.error("FATAL ERROR: process.env.JWT_SECRET is undefined. Halting server execution.");
    process.exit(1);
  }

  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(" ");
      console.log(`Auth Header total parts: ${parts.length}`);
      parts.forEach((part, index) => {
        console.log(`Auth Header part[${index}] length: ${part.length}`);
      });
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // IMPORTANT FIX HERE 👇
    const userId = decoded.id || decoded._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;