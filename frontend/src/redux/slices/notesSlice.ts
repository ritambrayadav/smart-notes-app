import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NotesState, NotesResponse, Note } from "@/utils/interface";

const initialState: NotesState = {
  notes: {
    notes: [],
    totalPages: 0,
    lastKey: {
      userId: "",
      noteId: "",
      createdAt: "",
    },
  },
  loading: false,
  error: null,
  suggestedTags: [],
  suggestLoading: false,
  suggestError: null,
  singleNote: null,
  isSubmitting: false,
  submitError: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    fetchNotesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchNotesSuccess(state, action: PayloadAction<NotesResponse>) {
      state.notes = action.payload;
      state.loading = false;
    },
    fetchNotesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addNote(state, action: PayloadAction<Note>) {
      state.notes.notes.unshift(action.payload);
    },
    updateNoteById(state, action: PayloadAction<Note>) {
      state.notes.notes = state.notes.notes.map((note) =>
        note.noteId === action.payload.noteId ? action.payload : note
      );
    },
    submitNoteStart(state) {
      state.isSubmitting = true;
      state.submitError = null;
    },
    submitNoteSuccess(state) {
      state.isSubmitting = false;
    },
    submitNoteFailure(state, action: PayloadAction<string>) {
      state.isSubmitting = false;
      state.submitError = action.payload;
    },
    deleteNote(state, action: PayloadAction<string>) {
      state.notes.notes = state.notes.notes.filter(
        (note) => note.noteId !== action.payload
      );
    },
    searchNotesStart(state) {
      state.loading = true;
      state.error = null;
    },
    searchNotesSuccess(state, action: PayloadAction<NotesResponse>) {
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
    getNoteStart(state) {
      state.singleNoteLoading = true;
      state.singleNoteError = null;
    },
    getNoteSuccess(state, action: PayloadAction<Note>) {
      state.singleNote = action.payload;
      state.singleNoteLoading = false;
    },
    getNoteFailure(state, action: PayloadAction<string>) {
      state.singleNoteLoading = false;
      state.singleNoteError = action.payload;
    },

    clearSingleNote(state) {
      state.singleNote = null;
      state.singleNoteLoading = false;
      state.singleNoteError = null;
    },
    clearSuggestedTags(state) {
      state.suggestedTags = [];
    },
    clearNotes(state) {
      state.notes = {
        notes: [],
        totalPages: 0,
        lastKey: { userId: "", noteId: "", createdAt: "" },
      };
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
  updateNoteById,
  deleteNote,
  clearNotes,
  searchNotesStart,
  searchNotesSuccess,
  searchNotesFailure,
  suggestTagsStart,
  suggestTagsSuccess,
  suggestTagsFailure,
  clearSuggestedTags,
  getNoteStart,
  getNoteSuccess,
  getNoteFailure,
  clearSingleNote,
  submitNoteStart,
  submitNoteSuccess,
  submitNoteFailure,
} = notesSlice.actions;

export default notesSlice.reducer;
