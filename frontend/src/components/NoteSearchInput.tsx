import React from "react";
import Input from "./Input";

interface NoteSearchInputProps {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NoteSearchInput: React.FC<NoteSearchInputProps> = ({
  searchQuery,
  handleSearchChange,
}) => (
  <div className="mb-6">
    <Input
      type="text"
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder="Search by title, tags or description"
    />
  </div>
);

export default NoteSearchInput;
