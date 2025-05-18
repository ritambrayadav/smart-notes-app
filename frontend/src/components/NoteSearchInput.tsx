import React, { useMemo, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import Input from "./Input";

interface NoteSearchInputProps {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NoteSearchInput: React.FC<NoteSearchInputProps> = ({
  searchQuery,
  handleSearchChange,
}) => {
  const debouncedChangeHandler = useMemo(
    () => debounce(handleSearchChange, 300),
    [handleSearchChange]
  );

  useEffect(() => {
    return () => {
      debouncedChangeHandler.cancel();
    };
  }, [debouncedChangeHandler]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
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
