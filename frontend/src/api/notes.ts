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
  searchNotesStart,
  searchNotesSuccess,
  searchNotesFailure,
  getNoteStart,
  getNoteSuccess,
  getNoteFailure,
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
export const fetchAllNotes = async (page = 1, limit = 6, lastkey) => {
  const dispatch = store.dispatch;
  const userId = getSessionItem("user")?.userId;
  try {
    dispatch(fetchNotesStart());
    const res = await axiosInstance.get(
      `${PATH.notes}/${userId}?page=${page}&limit=${limit}&lastKey=${lastkey}`
    );

    dispatch(fetchNotesSuccess(res.data));
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
    const res = await axiosInstance.post(`${PATH.notes}/${userId}`, {
      userId,
      ...noteData,
    });

    dispatch(addNote(res.data.note));
  } catch (error) {
    console.error("Failed to create note", error);
  }
};
export const updateNote = async (
  noteId: string,
  noteData: {
    title: string;
    content: string;
    tags: string[];
  }
) => {
  const res = await axiosInstance.put(`${PATH.notes}/${noteId}`, noteData);
  toast.success(res.data.message);
  return res.data;
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
