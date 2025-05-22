import express from "express";
import {
  signup,
  login,
  logout,
  getUserById,
  markOnboardingSeen,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/:userId", authMiddleware, getUserById);
router.put("/:userId", authMiddleware, markOnboardingSeen);

export default router;
