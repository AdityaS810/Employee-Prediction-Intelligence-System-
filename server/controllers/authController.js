const bcrypt = require("bcryptjs");
const EmployeeProfile = require("../models/EmployeeProfile");
const Performance = require("../models/Performance");
const User = require("../models/User");
const { signToken } = require("../utils/token");

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

async function register(req, res) {
  try {
    const {
      name,
      email,
      password,
      employeeId,
      department,
      designation,
      dateOfJoining,
      personalDetails
    } = req.body;

    if (!name || !email || !password || !employeeId) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered." });
    }

    const existingProfile = await EmployeeProfile.findOne({ employeeId });
    if (existingProfile) {
      return res.status(409).json({ message: "Employee ID already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "employee"
    });

    await EmployeeProfile.create({
      userId: user._id,
      employeeId,
      department,
      designation,
      dateOfJoining,
      personalDetails
    });

    await Performance.create({
      employeeId,
      rating: 3.2,
      satisfactionScore: 72,
      promotionProbability: 48
    });

    const token = signToken(user);

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: "Role mismatch for this account." });
    }

    const token = signToken(user);

    return res.json({
      message: "Login successful.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  register,
  login
};
