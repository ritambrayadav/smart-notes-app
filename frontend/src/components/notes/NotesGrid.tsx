import React from "react";
import Button from "@/components/common/Button";
import { NotesGridProps } from "@/utils/interface";
import { FiTrash2 } from "react-icons/fi";
import Link from "next/link";
const NotesGrid: React.FC<NotesGridProps> = ({ notes, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {notes?.map((note) => (
        <div
          key={note.noteId}
          className="relative bg-white border border-gray-200 p-5 rounded-2xl shadow hover:shadow-md transition flex flex-col h-full min-h-[250px]"
        >
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            onClick={() => onDelete(note.noteId)}
            aria-label="Delete note"
          >
            <FiTrash2 size={18} />
          </button>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 truncate">
              {note.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">
              {note.summery || note.content}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {note?.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 flex items-center justify-between border-t border-gray-100">
            <p className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full shadow-sm">
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
            <Link href={`/notes/${note.noteId}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm">
                Edit
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesGrid;
