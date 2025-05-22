import { SetStateAction } from "react";

export interface AuthPayload {
  user: User | null;
}
export interface SignupData {
  userName: string;
  email: string;
  password?: string;
}
export interface User {
  lastKey: string;
  userId: string;
  userName: string;
  email: string;
  hasSeenOnboarding?: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface LoginData {
  email: string;
  password: string;
}
export interface AuthResponse {
  user: User;
}
export interface AuthState {
  user: User | null;
  fetchedUser: User | null;
  loading: boolean;
  error: string | null;
}
export interface Note {
  noteId: string | null | undefined;
  title: string;
  content?: string;
  tags: string[];
  summery?: string;
  totalPages: number;
  createdAt: string;
  updatedAt?: string;
}
export interface NotesGridProps {
  notes: Note[];
  onEdit: (id: string | null | undefined) => void;
  onDelete: (id: string | null | undefined) => void;
}
export interface LastKey {
  userId: string;
  noteId: string;
}
export interface NotesResponse {
  lastKey: LastKey;
  notes: Note[];
  totalPages: number;
}
export interface NotesState {
  notes: NotesResponse;
  loading: boolean;
  error: string | null;
  suggestedTags: string[];
  suggestLoading: boolean;
  suggestError: string | null;
  singleNote?: Note | null;
  singleNoteLoading?: boolean;
  singleNoteError?: string | null;
}
