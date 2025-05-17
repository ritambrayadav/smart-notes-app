import React from "react";
import Button from "./Button";
const OnboardingModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Welcome to Smart Notes 🎉
        </h2>
        <p className="text-gray-600 mb-6">
          Start by creating your first note. You can add tags, generate AI
          summaries, and organize your ideas efficiently.
        </p>
        <Button onClick={onClose} className="w-full">
          Let’s Go!
        </Button>
      </div>
    </div>
  );
};

export default OnboardingModal;
