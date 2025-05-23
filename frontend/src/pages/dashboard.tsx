import React from "react";
import DashboardContainer from "@/components/dashboard/DashboardContainer";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <DashboardContainer />
      </div>
    </div>
  );
};

export default Dashboard;
