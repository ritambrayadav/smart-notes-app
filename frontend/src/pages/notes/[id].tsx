"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getNoteById } from "@/api/notes";

const NoteDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (!id) return;
        const data = await getNoteById(id as string);
        setNote(data);
      } catch (err) {
        console.error("Failed to fetch note details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  if (loading) return <p className="p-4">Loading note...</p>;
  if (!note) return <p className="p-4 text-red-500">Note not found.</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{note.title}</h1>

        <div className="mb-6">
          <p className="text-gray-700 whitespace-pre-line">{note.content}</p>
        </div>

        {note.summary && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-4">
            <h2 className="font-semibold text-yellow-700 mb-2">AI Summary:</h2>
            <p className="text-gray-800">{note.summary}</p>
          </div>
        )}

        {note.tags && note.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700">Tags:</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {note.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-6">
          Last updated:{" "}
          {new Date(note.updatedAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
    </div>
  );
};

export default NoteDetailPage;
