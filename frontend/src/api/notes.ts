import axiosInstance from "./api";
import { PATH } from "./path";
import { getSessionItem } from "@/utils/sessionStorage";
import {
  fetchNotesStart,
  fetchNotesSuccess,
  fetchNotesFailure,
  addNote,
  updateNoteById,
  suggestTagsStart,
  suggestTagsSuccess,
  suggestTagsFailure,
  searchNotesStart,
  searchNotesSuccess,
  searchNotesFailure,
  getNoteStart,
  getNoteSuccess,
  getNoteFailure,
  submitNoteStart,
  submitNoteSuccess,
  submitNoteFailure,
} from "@/redux/slices/notesSlice";
import { AppDispatch } from "@/redux/store";
import { store } from "@/redux/store";
import { toast } from "react-toastify";
export interface DashboardData {
  user: {
    name: string;
    email: string;
  };
  notes: {
    id: string;
    title: string;
    summary: string;
    createdAt: string;
  }[];
}
export interface NoteInput {
  title: string;
  content: string;
  summary?: string;
}
export const fetchAllNotes = async (page = 1, limit = 6, lastKey: any) => {
  const dispatch = store.dispatch;
  const userId = getSessionItem("user")?.userId;
  try {
    dispatch(fetchNotesStart());
    let query = `?page=${page}&limit=${limit}`;
    if (lastKey) {
      query += `&lastKey=${encodeURIComponent(lastKey)}`;
    }
    const url = `${PATH.notes}/user/${userId}${query}`;
    const res = await axiosInstance.get(url);

    dispatch(fetchNotesSuccess(res.data));
    return res.data;
  } catch (error: any) {
    dispatch(
      fetchNotesFailure(error?.response?.data?.error || "Failed to fetch notes")
    );
  }
};

export const createNewNote = async (noteData: NoteInput) => {
  const userId = getSessionItem("user")?.userId;
  const dispatch = store.dispatch;

  try {
    dispatch(submitNoteStart());
    const res = await axiosInstance.post(`${PATH.notes}/user/${userId}`, {
      userId,
      ...noteData,
    });

    dispatch(addNote(res.data.note));
    dispatch(submitNoteSuccess());
  } catch (error: any) {
    console.error("Failed to create note", error);
    dispatch(submitNoteFailure(error.message || "Note submission failed"));
  }
};
export const updateNote = async (noteId: string, noteData: NoteInput) => {
  const dispatch = store.dispatch;
  dispatch(submitNoteStart());
  try {
    const res = await axiosInstance.put(`${PATH.notes}/${noteId}`, noteData);
    toast.success(res.data.message);
    dispatch(updateNoteById(res.data.note));
    dispatch(submitNoteSuccess());
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Update failed";
    dispatch(submitNoteFailure(message));
    toast.error(message);
  }
};

export const getNoteById = async (noteId: string) => {
  const dispatch = store.dispatch;
  try {
    dispatch(getNoteStart());
    const res = await axiosInstance.get(`${PATH.notes}/get-note/${noteId}`);
    dispatch(getNoteSuccess(res.data.note));
  } catch (error: any) {
    dispatch(
      getNoteFailure(error?.response?.data?.message || "Failed to fetch note")
    );
  }
};
export const searchNotes = async (page = 1, limit = 6, query: string) => {
  const dispatch = store.dispatch;
  const userId = getSessionItem("user")?.userId;
  try {
    dispatch(searchNotesStart());
    const res = await axiosInstance.get(
      `${PATH.notes}/search/${userId}?page=${page}&limit=${limit}&query=${query}`
    );
    dispatch(searchNotesSuccess(res.data));
  } catch (error: any) {
    dispatch(
      searchNotesFailure(
        error?.response?.data?.error || "Failed to fetch notes"
      )
    );
  }
};

export const fetchSuggestedTags = async (
  dispatch: AppDispatch,
  content: string
) => {
  dispatch(suggestTagsStart());
  try {
    const res = await axiosInstance.post<{ tags: string[] }>(
      `${PATH.notes}/suggest-tags`,
      { content }
    );
    dispatch(suggestTagsSuccess(res.data.tags));
  } catch (err: any) {
    const message =
      err.response?.data?.message || err.message || "Failed to suggest tags";
    dispatch(suggestTagsFailure(message));
  }
};
export const deleteNode = async (
  noteId: string | null | undefined
): Promise<DashboardData> => {
  const res = await axiosInstance.delete(`${PATH.notes}/${noteId}`);
  toast.error(res.data.message);
  return res.data;
};
