import express from "express";
import { register, login, getUserById } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:userId", authMiddleware, getUserById);

export default router;
