import React from "react";
import Button from "@/components/common/Button";
import Link from "next/link";
interface NotesTopBarProps {
  handleCreateNote: () => void;
}

const NotesTopBar: React.FC<NotesTopBarProps> = ({ handleCreateNote }) => (
  <div className="flex items-center justify-between mb-6">
    <Link href="/notes/new">
      <Button onClick={handleCreateNote}>+ Create Note</Button>
    </Link>
  </div>
);

export default NotesTopBar;
