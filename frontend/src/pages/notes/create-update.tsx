"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "@/redux/store";
import { createNewNote, updateNote, getNoteById } from "@/api/notes";
import { fetchSuggestedTags } from "@/api/notes";
import { clearSuggestedTags } from "@/redux/slices/notesSlice";
import Input from "@/components/Input";
import Button from "@/components/Button";
import TextAreaInput from "@/components/TextAreaInput";

// simple debounce hook
function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const CreateEditNote = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const noteId = searchParams.get("id");

  const { user } = useSelector((state: RootState) => state.auth);

  const { suggestedTags, suggestLoading, suggestError } = useSelector(
    (state: RootState) => state.notes
  );

  const [form, setForm] = useState({
    title: "",
    content: "",
    tagInput: "",
    tags: [] as string[],
  });

  const debouncedContent = useDebounce(form.content, 800);

  // load existing note in edit mode
  useEffect(() => {
    if (!noteId) return;

    getNoteById(noteId).then((data) =>
      setForm((f) => ({
        ...f,
        title: data.title,
        content: data.content,
        tags: data.tags || [],
      }))
    );

    // clear suggestions when editing
    dispatch(clearSuggestedTags());
  }, [noteId, dispatch]);

  // fetch suggested tags when creating and content is long enough
  useEffect(() => {
    if (noteId || debouncedContent.trim().length < 10) {
      dispatch(clearSuggestedTags());
    } else {
      fetchSuggestedTags(dispatch, debouncedContent);
    }
  }, [debouncedContent, noteId, dispatch]);

  const handleChange = (field: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleAddTag = (tagToAdd?: string) => {
    const newTag = (tagToAdd ?? form.tagInput).trim();
    if (newTag && !form.tags.includes(newTag)) {
      setForm((f) => ({
        ...f,
        tags: [...f.tags, newTag],
        tagInput: "",
      }));
    }
  };

  const handleRemoveTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const noteData = {
      title: form.title,
      content: form.content,
      tags: form.tags,
    };
    try {
      if (noteId) {
        await updateNote(noteId, noteData);
      } else {
        await createNewNote(dispatch, noteData);
      }
      router.push("/dashboard");
    } catch (err) {
      console.error("Note submission failed", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">
        {noteId ? "Edit Note" : "Create Note"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />

        <TextAreaInput
          placeholder="Content"
          value={form.content}
          onChange={(e) => handleChange("content", e.target.value)}
          className="h-40"
          required
        />

        {/* Manual Tags */}
        <div>
          <label className="block mb-1 font-medium">Tags</label>
          <div className="flex space-x-2 mb-3">
            <Input
              placeholder="Enter a tag and press Enter"
              value={form.tagInput}
              onChange={(e) => handleChange("tagInput", e.target.value)}
              onKeyDown={handleTagKey}
              className="flex-1"
            />
            <Button type="button" onClick={() => handleAddTag()}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Suggested Tags */}
        {!noteId && (
          <div>
            <label className="block mb-1 font-medium">You might add</label>

            {suggestLoading && (
              <p className="text-sm text-gray-500">Loading suggestions…</p>
            )}
            {suggestError && (
              <p className="text-sm text-red-500">{suggestError}</p>
            )}
            {!suggestLoading && !suggestError && suggestedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddTag(tag)}
                    className="bg-gray-200 hover:bg-gray-300 text-sm px-2 py-1 rounded"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {!suggestLoading && !suggestError && suggestedTags.length === 0 && (
              <p className="text-sm text-gray-400">
                Type more content to see suggestions
              </p>
            )}
          </div>
        )}

        <div className="pt-4 text-right">
          <Button type="submit">
            {noteId ? "Update Note" : "Create Note"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEditNote;
