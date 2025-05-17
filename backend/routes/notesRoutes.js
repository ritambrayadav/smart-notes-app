import express from "express";
import {
  createNote,
  getNotes,
  // updateNote,
  searchNotes,
  generateSummary,
  getSuggestedTags,
} from "../controllers/notesController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/generate-summary", generateSummary);
router.post("/suggest-tags", getSuggestedTags);
// router.put("/:id", updateNote);
router.get("/search/:userId", searchNotes);
// router.get("/:id", getNoteById);
router.post("/:userId", createNote);
router.get("/:userId", getNotes);
export default router;
