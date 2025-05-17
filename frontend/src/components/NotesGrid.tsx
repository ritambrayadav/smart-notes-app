import React from "react";
import Button from "./Button";

interface Note {
  noteId: string;
  title: string;
  description?: string;
  content?: string;
  tags: string[];
  createdAt: string;
}

interface NotesGridProps {
  notes: Note;
  onEdit: (id: string) => void;
}
const NotesGrid: React.FC<NotesGridProps> = ({ notes, onEdit }) => {
  return (
    <div
      key={notes.noteId}
      className="bg-white border border-gray-200 p-5 rounded-2xl shadow hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-gray-800 truncate">
        {notes.title}
      </h3>
      <p className="text-sm text-gray-600 mt-2 line-clamp-3">
        {notes.description || notes.content}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {notes?.tags?.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        {new Date(notes.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={() => onEdit(notes.noteId)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Edit
        </Button>
      </div>
    </div>
  );
};
export default NotesGrid;
