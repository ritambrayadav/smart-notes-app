import express from "express";
import {
  createNote,
  getNotes,
  updateNote,
  searchNotes,
  generateSummary,
  getSuggestedTags,
  getNoteById,
  deleteNote,
} from "../controllers/notesController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/generate-summary", generateSummary);
router.post("/suggest-tags", getSuggestedTags);
router.put("/:noteId", updateNote);
router.get("/search/:userId", searchNotes);
router.get("/get-note/:noteId", getNoteById);
router.post("/:userId", createNote);
router.get("/:userId", getNotes);
router.delete("/:noteId", deleteNote);
export default router;
