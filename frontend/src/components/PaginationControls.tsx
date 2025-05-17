import React from "react";
import Button from "./Button";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPrev?: () => void;
  onNext?: () => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onPrev,
  onNext,
}) => (
  <div className="flex justify-center items-center gap-4 mt-10">
    <Button onClick={onPrev} disabled={page === 1}>
      Prev
    </Button>
    <span className="text-sm text-gray-700">
      Page {page} of {totalPages}
    </span>
    <Button onClick={onNext} disabled={page === totalPages}>
      Next
    </Button>
  </div>
);

export default PaginationControls;
