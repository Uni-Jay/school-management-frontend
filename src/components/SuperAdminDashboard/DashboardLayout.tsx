import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";
import { useState } from "react";
import { Menu } from "lucide-react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-200 w-full overflow-hidden">
      {/* Sidebar for large screens */}
      <div className={`hidden md:block`}>
        <Sidebar />
      </div>

      {/* Sidebar toggle for mobile */}
      <div className="md:hidden fixed top-0 left-0 z-50">
        <button
          className="m-2 p-2 bg-blue-600 text-white rounded"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Slide-in sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-white shadow h-full">
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Navbar />
        <main className="p-4 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
