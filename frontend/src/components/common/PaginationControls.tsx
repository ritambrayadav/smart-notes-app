import React from "react";
import Button from "./Button";
import { PaginationControlsProps } from "@/utils/interface";

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onPrev,
  onNext,
  setPage,
}) => {
  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      <Button onClick={handlePrev} disabled={page === 1}>
        Prev
      </Button>
      <span className="text-sm text-gray-700">
        Page {page} of {totalPages}
      </span>
      <Button onClick={handleNext} disabled={page === totalPages}>
        Next
      </Button>
    </div>
  );
};

export default PaginationControls;
