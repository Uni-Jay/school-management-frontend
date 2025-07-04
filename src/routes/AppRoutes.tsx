import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminLayout from "../pages/SuperAdminLayout";

// Super Admin Dashboard Pages
import Dashboard from "../components/SuperAdminDashboard/Dashboard";
import AnnouncementsPage from "../components/SuperAdminDashboard/Announcement";
import SchoolPage from "../components/SuperAdminDashboard/School";
import SchoolSuperAdminManagement from "../components/SuperAdminDashboard/SchoolSuperAdmin";
import TeacherManagement from "../components/SuperAdminDashboard/Teachers";

const AppRoutes = () => {
  return (
    <Routes>
      
      {/* Redirect base path to /super-admin */}
      <Route path="/" element={<Navigate to="/super-admin" replace />} />
      {/* Super Admin Layout (Navbar + Sidebar + Nested Pages) */}
      <Route path="/super-admin" element={<SuperAdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="announcement" element={<AnnouncementsPage />} />
        {/* You can add more nested routes here, like: */}
        <Route path="schools" element={<SchoolPage />} />
        <Route path="school_super_admin" element={<SchoolSuperAdminManagement/>}/>
        <Route path="teachers" element={<TeacherManagement/>}/>
        {/* <Route path="teachers" element={<TeachersPage />} /> */}
      </Route>

      {/* Catch-All Route */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
