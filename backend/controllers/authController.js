import User from "../models/Users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";

const register = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  const existingUser = await User.scan("email").eq(email).exec();
  if (existingUser.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    userId: uuidv4(),
    userName,
    email,
    password: hashedPassword,
  });
  await user.save();
  res.status(201).json({
    message: "User created successfully",
    user: { userName, email },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const users = await User.scan("email").eq(email).exec();

  if (users.length === 0) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, user }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const users = await User.scan("userId").eq(userId).exec();
  if (users.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const { ...userData } = users[0];
  res.status(200).json({ user: userData });
});

export { register, login, getUserById };
