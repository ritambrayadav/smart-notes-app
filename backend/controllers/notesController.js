import Note from "../models/Notes.js";
import { v4 as uuidv4 } from "uuid";
import { generateSummaryFromContent } from "../services/openAI.js";
import { suggestTagsFromContent } from "../services/openAI.js";
export const createNote = async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;
    const userId = req.params.userId;
    const createdAt = new Date().toISOString(); // Ensures it's a string
    const updatedAt = createdAt;
    // Basic validation
    // if (!title || !content) {
    //   return res.status(400).json({ error: "Title and content are required." });
    // }

    const summery = await generateSummaryFromContent(content);
    const newNote = await Note.create({
      noteId: uuidv4(),
      userId,
      title,
      content,
      summery,
      tags: tags.length > 0 ? tags : [],
      createdAt,
      updatedAt,
    });

    return res.status(201).json({ note: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).json({ error: "Failed to create note" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = parseInt(req.query.limit) || 5;
    let lastKey = req.query.lastKey ? JSON.parse(req.query.lastKey) : null;

    const totalNotesResult = await Note.query("userId")
      .eq(userId)
      .using("userId-createdAt-index")
      .count()
      .exec();
    const totalPages = totalNotesResult.count;

    let query = Note.query("userId")
      .eq(userId)
      .using("userId-createdAt-index")
      .sort("descending")
      .limit(limit);

    if (lastKey) {
      query = query.startAt(lastKey);
    }

    const result = await query.exec();

    res.status(200).json({
      notes: result,
      limit,
      totalPages,
      lastKey: result.lastKey ? JSON.stringify(result.lastKey) : null,
      hasMore: Boolean(result.lastKey),
    });
  } catch (error) {
    console.error("Error fetching notes by userId using index:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};
export const updateNote = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { title, content, tags } = req.body;
    const updatedAt = new Date().toISOString();
    const summary = await generateSummaryFromContent(content);

    const note = await Note.get(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.title = title;
    note.content = content;
    note.summery = summary;
    note.tags = tags;
    note.updatedAt = updatedAt;

    await note.save();

    res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (err) {
    console.error("Error updating note:", err);
    res
      .status(500)
      .json({ message: "Error updating note", error: err.message });
  }
};

export const searchNotes = async (req, res) => {
  const { query, page = 1, limit = 6 } = req.query;
  const userId = req.params.userId;

  try {
    const allNotesResult = await Note.scan("userId").eq(userId).exec();

    let filteredNotes = allNotesResult;
    if (query) {
      const q = query.toLowerCase();
      filteredNotes = allNotesResult.filter((note) => {
        return (
          (note.title && note.title.toLowerCase().includes(q)) ||
          (note.description && note.description.toLowerCase().includes(q)) ||
          (Array.isArray(note.tags) &&
            note.tags.some((tag) => tag.toLowerCase().includes(q)))
        );
      });
    }
    const totalPages = filteredNotes.length;
    const startIndex = (page - 1) * limit;
    const paginatedNotes = filteredNotes.slice(
      startIndex,
      startIndex + parseInt(limit)
    );

    res.status(200).json({
      notes: paginatedNotes,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      totalPages: Math.ceil(totalPages / limit),
      hasMore: startIndex + limit < totalPages,
    });
  } catch (err) {
    console.error("Error in searchNotes:", err);
    res.status(500).json({
      message: "Failed to search notes",
      error: err.message,
    });
  }
};

export const generateSummary = async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    return res
      .status(400)
      .json({ message: "Content is required to generate a summary" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: `Summarize the following note content in 2-3 concise sentences:\n\n${content}`,
        max_tokens: 100,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const summary = response.data.choices[0].text.trim();

    return res.status(200).json({ summary });
  } catch (err) {
    console.error(
      "Error generating summary:",
      err.response?.data || err.message
    );
    return res.status(500).json({
      message: "Failed to generate summary",
      error: err.message,
    });
  }
};
export const getSuggestedTags = async (req, res) => {
  const { content } = req.body;
  try {
    const suggestedTags = await suggestTagsFromContent(content);
    res.status(200).json({ tags: suggestedTags });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getNoteById = async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const note = await Note.get({ noteId: noteId });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ note });
  } catch (error) {
    console.error("Failed to fetch note:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
};
export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    await Note.delete(noteId);

    res.status(200).json({ message: "Note deleted successfully", noteId });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
};
