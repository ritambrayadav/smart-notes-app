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
router.get("/search/:userId", searchNotes);
router.get("/get-note/:noteId", getNoteById);
router.put("/:noteId", updateNote);
router.delete("/:noteId", deleteNote);
router.post("/user/:userId", createNote);
router.get("/user/:userId", getNotes);

export default router;
