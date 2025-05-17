import axiosInstance from "./api";
import { PATH } from "./path";
import { getSessionItem } from "@/utils/sessionStorage";
import {
  fetchNotesStart,
  fetchNotesSuccess,
  fetchNotesFailure,
  addNote,
  suggestTagsStart,
  suggestTagsSuccess,
  suggestTagsFailure,
} from "@/redux/slices/notesSlice";
import { AppDispatch } from "@/redux/store";
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
export const fetchAllNotes = async (
  dispatch: AppDispatch,
  page = 1,
  limit = 10
) => {
  const userId = getSessionItem("user")?.userId;

  try {
    dispatch(fetchNotesStart());

    const res = await axiosInstance.get(
      `${PATH.notes}/${userId}?page=${page}&limit=${limit}`
    );

    dispatch(fetchNotesSuccess(res.data.notes));
  } catch (error: any) {
    dispatch(
      fetchNotesFailure(error?.response?.data?.error || "Failed to fetch notes")
    );
  }
};

// 2️⃣ Create Note
export const createNewNote = async (
  dispatch: AppDispatch,
  noteData: NoteInput
) => {
  const userId = getSessionItem("user")?.userId;

  try {
    const res = await axiosInstance.post(`${PATH.notes}/${userId}`, {
      userId,
      ...noteData,
    });

    dispatch(addNote(res.data.note)); // Make sure your backend sends back { note: {} }
  } catch (error) {
    console.error("Failed to create note", error);
    // Optionally dispatch an error reducer or show toast
  }
};
export const updateNote = async (
  id: string,
  noteData: {
    title: string;
    content: string;
    tags: string[];
  }
) => {
  const token = localStorage.getItem("token");
  const response = await axiosInstance.put(`${PATH.notes}/${id}`, noteData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
export const getNoteById = async (): Promise<DashboardData> => {
  const res = await axiosInstance.get(`${PATH.notes}/:id`);
  return res.data;
};
export const searchNotes = async (
  dispatch: AppDispatch,
  page = 1,
  limit = 10,
  query
) => {
  const userId = getSessionItem("user")?.userId;

  try {
    dispatch(fetchNotesStart());

    const res = await axiosInstance.get(
      `${PATH.notes}/search/${userId}?page=${page}&limit=${limit}&query=${query}`
    );

    dispatch(fetchNotesSuccess(res.data.notes));
  } catch (error: any) {
    dispatch(
      fetchNotesFailure(error?.response?.data?.error || "Failed to fetch notes")
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
