
import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar";


const DashboardLayout = () => {
  return (
    <div className=" flex h-screen bg-gray-200 w-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Navbar />
        <main className="p-4 bg-gray-100 flex-1 overflow-y-auto ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
