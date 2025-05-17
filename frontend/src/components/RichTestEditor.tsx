"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";

type Props = {
  content: string;
  onChange: (value: string) => void;
};

const RichTextEditor = ({ content, onChange }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => editor?.chain().focus().toggleBold().run()} className="btn">
          Bold
        </button>
        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="btn">
          Italic
        </button>
        <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className="btn">
          Underline
        </button>
        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="btn">
          Bullet
        </button>
        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="btn">
          Number
        </button>
      </div>

      <EditorContent editor={editor} className="border p-4 rounded bg-white min-h-[200px]" />
    </div>
  );
};

export default RichTextEditor;
