"use client";
import React, { useCallback } from "react";
import Input from "@/components/common/Input";
import { NoteSearchInputProps } from "@/utils/interface";
import { useDebouncedCallback } from "@/hooks/useDebouncehook";

const NoteSearchInput: React.FC<NoteSearchInputProps> = ({
  searchQuery,
  handleSearchChange,
}) => {
  const debouncedChangeHandler = useDebouncedCallback(handleSearchChange, 300);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedChangeHandler(e);
    },
    [debouncedChangeHandler]
  );

  return (
    <div className="mb-6">
      <Input
        type="text"
        defaultValue={searchQuery}
        onChange={handleChange}
        placeholder="Search by title, tags or description"
      />
    </div>
  );
};

export default NoteSearchInput;
