import React from "react";
import { FiUser } from "react-icons/fi";
import { BsLightbulb } from "react-icons/bs";
import { DashboardGreetingProps } from "@/utils/interface";

const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ userName }) => (
  <header className="w-full bg-white border border-gray-200 rounded-xl px-6 py-3 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-2">
      <BsLightbulb className="text-yellow-500 text-xl" aria-hidden="true" />
      <span className="text-lg font-semibold text-gray-800">Smart Notes</span>
    </div>

    <div className="flex items-center gap-2">
      <button
        aria-label="Open Profile Menu"
        className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
      >
        <FiUser className="text-gray-600 text-xl" />
      </button>
      {userName && (
        <span className="text-sm text-gray-700 font-medium hidden sm:inline">
          {userName}
        </span>
      )}
    </div>
  </header>
);

export default DashboardGreeting;
