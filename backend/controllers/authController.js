import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";

const signup = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const existingUser = await User.query("email").eq(email).exec();
  if (existingUser.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    userId: uuidv4(),
    userName,
    email,
    password: hashedPassword,
    hasSeenOnboarding: false,
  });
  await user.save();
  res.status(201).json({
    message: "User created successfully",
    user: { userName, email },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const users = await User.query("email").eq(email).using("email-index").exec();
  if (users.length === 0) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({
    message: "Login successful",
    token,
    user: {
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      hasSeenOnboarding: user.hasSeenOnboarding,
    },
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "Invalid or missing user ID" });
  }

  try {
    const user = await User.get(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, ...safeUserData } = user.toJSON?.() ?? user;
    res.status(200).json({ user: safeUserData });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const markOnboardingSeen = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.get(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.update(userId, {
      hasSeenOnboarding: true,
    });

    res.status(200).json({
      message: "Onboarding marked as seen",
    });
  } catch (error) {
    console.error("Failed to update onboarding status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { signup, login, getUserById, markOnboardingSeen };
