"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import {
  createNewNote,
  updateNote,
  getNoteById,
  fetchSuggestedTags,
} from "@/api/notes";
import { clearSuggestedTags, clearSingleNote } from "@/redux/slices/notesSlice";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import TextAreaInput from "@/components/common/TextAreaInput";
import TagInput from "@/components/notes/TagInput";
import TagList from "@/components/notes/TagList";
import SuggestedTags from "@/components/notes/SuggestedTags";
import { useDebouncedCallback } from "@/hooks/useDebouncehook";

const NoteForm = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { noteId } = router.query;
  const isEditMode = noteId && noteId !== "new";
  const { singleNote, suggestedTags, suggestLoading, suggestError } =
    useSelector((state: RootState) => state.notes);

  const [form, setForm] = useState({
    title: "",
    content: "",
    tagInput: "",
    tags: [] as string[],
  });

  const [debouncedContent, setDebouncedContent] = useState(form.content);

  const updateDebouncedContent = useDebouncedCallback((content: string) => {
    setDebouncedContent(content);
  }, 800);

  useEffect(() => {
    updateDebouncedContent(form.content);
  }, [form.content, updateDebouncedContent]);

  useEffect(() => {
    if (!router.isReady) return;
    if (isEditMode) getNoteById(noteId as string);
    else {
      dispatch(clearSingleNote());
      setForm({ title: "", content: "", tagInput: "", tags: [] });
    }
    dispatch(clearSuggestedTags());
  }, [router.isReady, noteId, dispatch]);

  useEffect(() => {
    if (isEditMode && singleNote) {
      setForm({
        title: singleNote.title ?? "",
        content: singleNote.content ?? "",
        tagInput: "",
        tags: singleNote.tags ?? [],
      });
    }
  }, [singleNote]);

  useEffect(() => {
    if (debouncedContent.trim().length < 10) {
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
      setForm((f) => ({ ...f, tags: [...f.tags, newTag], tagInput: "" }));
    }
  };

  const handleRemoveTag = (tag: string) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const noteData = {
      title: form.title,
      content: form.content,
      tags: form.tags,
    };
    try {
      isEditMode
        ? await updateNote(noteId as string, noteData)
        : await createNewNote(noteData);
      router.push("/dashboard");
    } catch (err) {
      console.error("Note submission failed", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Note" : "Create New Note"}
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

        <TagInput
          tagInput={form.tagInput}
          onInputChange={(val) => handleChange("tagInput", val)}
          onAddTag={handleAddTag}
        />

        <TagList tags={form.tags} onRemoveTag={handleRemoveTag} />

        <SuggestedTags
          suggestedTags={suggestedTags}
          suggestLoading={suggestLoading}
          suggestError={suggestError}
          onSelectTag={handleAddTag}
        />

        <div className="pt-4 text-right">
          <Button type="submit">
            {isEditMode ? "Update Note" : "Create Note"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
