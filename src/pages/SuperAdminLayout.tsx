import React from "react";
import DashboardLayout from "../components/SuperAdminDashboard/DashboardLAyout";

const SuperAdminLayout: React.FC = () => {
  return (
   <div className="flex h-screen overflow-hidden">
      <DashboardLayout/>
    </div>
  );
};

export default SuperAdminLayout;
