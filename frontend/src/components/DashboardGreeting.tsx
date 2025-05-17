import React from "react";

interface DashboardGreetingProps {
  userName?: string;
}

const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ userName }) => (
  <div className="mb-6">
    <h1 className="text-2xl font-semibold text-gray-800">
      Welcome{userName ? `, ${userName}` : ""}
    </h1>
    <p className="text-sm text-gray-500 mt-1">Here are your recent notes</p>
  </div>
);


export default DashboardGreeting;