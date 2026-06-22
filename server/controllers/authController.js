import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
    });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error: error.message
    });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ CRITICAL AUTH ENGINE FAILURE: process.env.JWT_SECRET is undefined inside the login route execution context.");
      return res.status(500).json({ error: "Authentication system configuration signature missing." });
    }

    try {
      const sanitizedSecret = process.env.JWT_SECRET.trim().replace(/\\r/g, '');
      const token = jwt.sign({ id: user._id }, sanitizedSecret, { expiresIn: '24h' });
      return res.status(200).json({ token, user: { id: user._id, email: user.email } });
    } catch (jwtError) {
      console.error("❌ JWT SIGN EXCEPTION:", jwtError.message);
      return res.status(500).json({ error: "Internal token compilation fault.", details: jwtError.message });
    }
  } catch (error) {
    console.error('❌ Login Error:', error);
    res.status(500).json({
      message: 'Login failed',
      error: error.message
    });
  }
};