import Note from "../models/Notes.js";
import { v4 as uuidv4 } from "uuid";
import { generateSummaryFromContent } from "../services/openAI.js";
import { suggestTagsFromContent } from "../services/openAI.js";
export const createNote = async (req, res) => {
  try {
    const { title, content, tags = [] } = req.body;
    const userId = req.params.userId;

    // Basic validation
    // if (!title || !content) {
    //   return res.status(400).json({ error: "Title and content are required." });
    // }

    // Generate tags if none provided
    // const finalTags = tags.length ? tags : await suggestTagsFromContent(content);
    const summary = await generateSummaryFromContent(content);
    // Create note
    const newNote = await Note.create({
      noteId: uuidv4(),
      userId,
      title,
      content,
      summary,
      tags: tags.length > 0 ? tags : tags,
      createdAt: new Date(),
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let lastKey = req.query.lastKey ? JSON.parse(req.query.lastKey) : null;

    const totalNotesResult = await Note.query("userId")
      .eq(userId)
      .using("userId-index")
      .count()
      .exec();
    const totalPages = totalNotesResult.count;

    // Step 2: Paginated query
    let query = Note.query("userId")
      .eq(userId)
      .using("userId-index")
      .sort("descending")
      .limit(limit);

    if (lastKey) {
      query = query.startAt(lastKey);
    }

    const result = await query.exec();

    res.status(200).json({
      notes: result,
      page,
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

// export const updateNote = async (req, res) => {
//   try {
//     const noteId = req.params.id;
//     const { title, content, tags } = req.body;

//     const summary = await generateSummary(content);

//     const updatedNote = await Note.findByIdAndUpdate(
//       noteId,
//       {
//         title,
//         content,
//         summary,
//         tags,
//         updatedAt: new Date(),
//       },
//       { new: true }
//     );

//     if (!updatedNote) {
//       return res.status(404).json({ message: "Note not found" });
//     }

//     res.status(200).json(updatedNote);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating note", error: err });
//   }
// };
export const searchNotes = async (req, res) => {
  const { query } = req.query;
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const lastKey = req.query.lastKey ? JSON.parse(req.query.lastKey) : null;

  try {
    let scan = Note.scan("userId").eq(userId);

    if (lastKey) {
      scan = scan.startAt(lastKey);
    }

    scan = scan.limit(limit);

    const result = await scan.exec();
    let notes = result;
    if (query) {
      const q = query.toLowerCase();
      notes = notes.filter(
        (note) =>
          (note.title && note.title.toLowerCase().includes(q)) ||
          (note.description && note.description.toLowerCase().includes(q)) ||
          (Array.isArray(note.tags) &&
            note.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    }
    const allNotesResult = await Note.scan("userId").eq(userId).exec();
    const filteredTotalCount = query
      ? allNotesResult.filter(
          (note) =>
            (note.title &&
              note.title.toLowerCase().includes(query.toLowerCase())) ||
            (note.description &&
              note.description.toLowerCase().includes(query.toLowerCase())) ||
            (Array.isArray(note.tags) &&
              note.tags.some((tag) =>
                tag.toLowerCase().includes(query.toLowerCase())
              ))
        ).length
      : allNotesResult.length;

    res.status(200).json({
      notes,
      page,
      limit,
      totalCount: filteredTotalCount,
      lastKey: result.lastKey ? JSON.stringify(result.lastKey) : null,
      hasMore: Boolean(result.lastKey),
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
// export const getNoteById = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const noteId = req.params.id;

//     const note = await Note.get({ id: noteId, userId });

//     if (!note) {
//       return res.status(404).json({ error: "Note not found" });
//     }

//     res.status(200).json({ note });
//   } catch (error) {
//     console.error("Failed to fetch note:", error);
//     res.status(500).json({ error: "Failed to fetch note" });
//   }
// };
