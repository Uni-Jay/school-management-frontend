import React, { useState, useEffect } from "react";
import { Bell, Search, Moon, Sun } from "lucide-react";
import axios from "axios";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

interface SuperAdmin {
  id: number;
  email: string;
  img?: string;
}

interface Notification {
  id: number;
  message: string;
  timestamp?: string;
}

interface School {
  name: string;
  logo?: string;
}

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const [schoolName, setSchoolName] = useState("Loading...");
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null);
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);

  const role = localStorage.getItem("role") || "";
  const school_id = localStorage.getItem("school_id");
  const full_name = localStorage.getItem("full_name") || "";
  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();

  // 🧑 Get Super Admin Details
  useEffect(() => {
    if (!user_id) return;

    const fetchSuperAdmin = async () => {
      try {
        const res = await api.get(`/superAdmins/user/${user_id}`);
        setSuperAdmin(res.data.superAdmin);
      } catch (err) {
        console.error("Failed to fetch super admin:", err);
        setSuperAdmin(null);
      }
    };

    fetchSuperAdmin();
  }, [user_id]);

  // 🏫 Fetch School Info
  useEffect(() => {
    if (!school_id) return;

    const fetchSchool = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<School>(
          `${import.meta.env.VITE_API_BASE_URL}/school/${school_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSchoolName(res.data.name);
        setSchoolLogo(res.data.logo || null);
      } catch (err) {
        console.error("Error fetching school", err);
        setSchoolName("Unknown School");
      }
    };

    fetchSchool();
  }, [school_id]);

  // 🔔 Fetch Notifications from API
  useEffect(() => {
    if (!user_id) return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<Notification[]>(
          `${import.meta.env.VITE_API_BASE_URL}/notifications/user/${user_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user_id]);

  const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!searchQuery.trim()) return;

  try {
    const token = localStorage.getItem("token");
    const response = await api.get(
      `${import.meta.env.VITE_API_BASE_URL}/search?query=${searchQuery}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const results = response.data.results;
    // Navigate to a search results page or show a dropdown
    console.log("Search Results:", results);
    // Optionally: open a modal, redirect, or update a section with results
  } catch (error) {
    console.error("Search error", error);
  }
};


  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const formatRole = (role: string): string =>
    role
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="shadow-md p-4 flex justify-between items-center w-full bg-orange-100 dark:bg-gray-800 dark:text-white">
      <div className="flex items-center gap-3">
        {/* 🏫 Logo */}
        {schoolLogo ? (
          <img
            src={`${api.defaults.baseURL}/uploads/${schoolLogo}`}
            alt="School Logo"
            className="w-10 h-10 rounded object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-400 rounded" />
        )}
        <span className="text-xl font-bold text-orange-600 dark:text-white">
          {schoolName}
        </span>
      </div>

      {/* 🔍 Search */}
      <form onSubmit={handleSearch} className="flex items-center w-1/3">
        <input
          type="text"
          placeholder="Search dashboard..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-l-md focus:outline-none dark:bg-gray-700 dark:text-white"
        />
        <button className="bg-orange-500 p-2 rounded-r-md text-white">
          <Search size={20} />
        </button>
      </form>

      {/* 🔧 Right Panel */}
      <div className="flex items-center gap-4">
        {/* 🌙 Toggle */}
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-orange-200 dark:hover:bg-gray-700"
            >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>


        {/* 🔔 Notification Bell */}
        <div className="relative">
          <Bell className="text-gray-700 dark:text-white cursor-pointer" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
              {notifications.length}
            </span>
          )}
        </div>

        {/* 👤 Profile */}
        <div className="relative">
          {superAdmin ? (
            <img
              src={`${api.defaults.baseURL}/uploads/${superAdmin.img || "default.png"}`}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border"
              onClick={() => setShowProfile((prev) => !prev)}
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
          )}

          {showProfile && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-gray-900 shadow-lg p-4 rounded-lg w-64 z-50 text-sm">
              <p className="font-bold">{full_name}</p>
              <p className="text-gray-600 dark:text-gray-300">
                {superAdmin?.email}
              </p>
              <p className="text-gray-700 dark:text-gray-400">
                Role: <span className="font-medium">{formatRole(role)}</span>
              </p>
              <p className="text-gray-700 dark:text-gray-400">
                School: <span className="font-medium">{schoolName}</span>
              </p>

              {/* 🛠 Edit Profile */}
              <button
                onClick={() => navigate("/edit-profile")}
                className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
              >
                Edit Profile
              </button>

              {/* 🚪 Logout */}
              <button
                onClick={handleLogout}
                className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
