import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Note {
  noteId: Key | null | undefined;
  id: string;
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  suggestedTags: string[];
  suggestLoading: boolean;
  suggestError: string | null;
}

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null,
  suggestedTags: [],
  suggestLoading: false,
  suggestError: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    fetchNotesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchNotesSuccess(state, action: PayloadAction<Note[]>) {
      state.notes = action.payload;
      state.loading = false;
    },
    fetchNotesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addNote(state, action: PayloadAction<Note>) {
      state.notes.unshift(action.payload); // Add new note to top
    },
    updateNote(state, action: PayloadAction<Note>) {
      state.notes = state.notes.map((note) =>
        note.id === action.payload.id ? action.payload : note
      );
    },
    deleteNote(state, action: PayloadAction<string>) {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
    },
    searchNotesStart(state) {
      state.loading = true;
      state.error = null;
    },
    searchNotesSuccess(state, action: PayloadAction<Note[]>) {
      state.notes = action.payload;
      state.loading = false;
    },
    searchNotesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    suggestTagsStart(state) {
      state.suggestLoading = true;
      state.suggestError = null;
    },
    suggestTagsSuccess(state, action: PayloadAction<string[]>) {
      state.suggestLoading = false;
      state.suggestedTags = action.payload;
    },
    suggestTagsFailure(state, action: PayloadAction<string>) {
      state.suggestLoading = false;
      state.suggestError = action.payload;
    },
    clearSuggestedTags(state) {
      state.suggestedTags = [];
    },
    clearNotes(state) {
      state.notes = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchNotesStart,
  fetchNotesSuccess,
  fetchNotesFailure,
  addNote,
  updateNote,
  deleteNote,
  clearNotes,
  searchNotesStart,
  searchNotesSuccess,
  searchNotesFailure,
  suggestTagsStart,
  suggestTagsSuccess,
  suggestTagsFailure,
  clearSuggestedTags,
} = notesSlice.actions;

export default notesSlice.reducer;
