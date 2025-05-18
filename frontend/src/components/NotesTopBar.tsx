import React from "react";
import Button from "./Button";

interface NotesTopBarProps {
  filteredCount?: number;
  totalNotes?: number;
  handleCreateNote: () => void;
}

const NotesTopBar: React.FC<NotesTopBarProps> = ({
  filteredCount,
  totalNotes,
  handleCreateNote,
}) => (
  <div className="flex items-center justify-between mb-6">
    <Button onClick={handleCreateNote}>+ Create Note</Button>
  </div>
);

export default NotesTopBar;
