// import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminLayout from "../pages/SuperAdminLayout";
import Dashboard from "../components/SuperAdminDashboard/Dashboard";
import AnnouncementsPage from "../components/SuperAdminDashboard/Announcement";

// Import your page components for each route here:
// import Dashboard from "./pages/super_admin/Dashboard";
// import Schools from "./pages/super_admin/Schools";
// import Parents from "./pages/super_admin/Parents";
// import Teachers from "./pages/super_admin/Teachers";
// import Students from "./pages/super_admin/Students";
// import Staff from "./pages/super_admin/Staff";
// import Admins from "./pages/super_admin/Admins";
// import Subjects from "./pages/super_admin/Subjects";
// import Classes from "./pages/super_admin/Classes";
// ... import other pages similarly

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/super-admin" replace />} />

      <Route path="/super-admin" element={<SuperAdminLayout />}>
        <Route index element={<Dashboard/>} />
          <Route path="announcements" element={<AnnouncementsPage/>}/>
        </Route>

      {/* Fallback route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
