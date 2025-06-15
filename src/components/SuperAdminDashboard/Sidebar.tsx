import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  FileText,
  FileSearch,
  DollarSign,
  CreditCard,
  Clock,
  Calendar,
  Megaphone,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  path?: string;
  children?: NavItem[];
  action?: () => void; // optional action for buttons like logout
};

interface SidebarProps {
  navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/super-admin" },
  { label: "Schools", icon: <Users size={20} />, path: "/super-admin/schools" },
  { label: "Parents", icon: <Users size={20} />, path: "/super-admin/parents" },
  { label: "Teachers", icon: <UserPlus size={20} />, path: "/super-admin/teachers" },
  { label: "Students", icon: <GraduationCap size={20} />, path: "/super-admin/students" },
  { label: "Staff", icon: <Users size={20} />, path: "/super-admin/staff" },
  { label: "Admins", icon: <ShieldCheck size={20} />, path: "/super-admin/admins" },
  { label: "Subjects", icon: <BookOpen size={20} />, path: "/super-admin/courses" },
  {
    label: "Classes",
    icon: <ClipboardList size={20} />,
    children: [
      { label: "Class", icon: <ClipboardList size={16} />, path: "/super-admin/classes" },
      { label: "Class Timetable", icon: <CalendarCheck size={16} />, path: "/super-admin/classes/timetable" },
      { label: "Class Teacher", icon: <UserPlus size={16} />, path: "/super-admin/classes/teacher" },
      { label: "Class Students", icon: <GraduationCap size={16} />, path: "/super-admin/classes/students" },
    ],
  },
  {
    label: "Exams",
    icon: <FileText size={20} />,
    children: [
      { label: "Exam Timetable", icon: <CalendarCheck size={16} />, path: "/super-admin/exams/timetable" },
      { label: "Exam Results", icon: <BarChart3 size={16} />, path: "/super-admin/exams/results" },
      { label: "Exam Questions", icon: <FileSearch size={16} />, path: "/super-admin/exams/questions" },
      { label: "Exam Grading", icon: <ClipboardList size={16} />, path: "/super-admin/exams/grading" },
    ],
  },
  {
    label: "Test",
    icon: <FileText size={20} />,
    children: [
      { label: "Test Timetable", icon: <CalendarCheck size={16} />, path: "/super-admin/tests/timetable" },
      { label: "Test Results", icon: <BarChart3 size={16} />, path: "/super-admin/tests/results" },
      { label: "Test Questions", icon: <FileSearch size={16} />, path: "/super-admin/tests/questions" },
      { label: "Test Grading", icon: <ClipboardList size={16} />, path: "/super-admin/tests/grading" },
    ],
  },
  {
    label: "Finances",
    icon: <DollarSign size={20} />,
    children: [
      { label: "School Fees", icon: <CreditCard size={16} />, path: "/super-admin/finances/school_fees" },
      { label: "Student Fees", icon: <CreditCard size={16} />, path: "/super-admin/finances/student_fees" },
      { label: "Staff Salary", icon: <DollarSign size={16} />, path: "/super-admin/finances/staff_salary" },
      { label: "Payments", icon: <CreditCard size={16} />, path: "/super-admin/finances/payments" },
    ],
  },
  { label: "Attendance", icon: <Clock size={20} />, path: "/super-admin/attendance" },
  { label: "Library", icon: <BookOpen size={20} />, path: "/super-admin/library" },
  { label: "Events", icon: <Calendar size={20} />, path: "/super-admin/events" },
  { label: "Notifications", icon: <Megaphone size={20} />, path: "/super-admin/notifications" },
  { label: "Announcement", icon: <Megaphone size={20} />, path: "/super-admin/announcement" },
  { label: "Role Management", icon: <ShieldCheck size={20} />, path: "/super-admin/role_management" },
  { label: "School Super Admin", icon: <Users size={20} />, path: "/super-admin/user_management" },
  { label: "Chat", icon: <Users size={20} />, path: "/super-admin/chat" },
  // { label: "Reports", icon: <BarChart3 size={20} />, path: "/super-admin/reports" },
  { label: "Report Card", icon: <BarChart3 size={20} />, path: "/super-admin/report_card" },
  { label: "Settings", icon: <Settings size={20} />, path: "/super-admin/settings" },
  {
    label: "Logout",
    icon: <LogOut size={20} />,
    action: () => {
      // Clear user data and redirect to login
      localStorage.clear();
      window.location.href = "/login";
    },
  },
];

const Sidebar: React.FC<SidebarProps> = ({ navItems: propsNavItems }) => {
  const nav = propsNavItems ?? defaultNavItems;
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const [collapsed, setCollapsed] = useState(false);

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (item: NavItem): boolean => {
    if (item.path && location.pathname === item.path) return true;
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path);
    }
    return false;
  };

  return (
    <aside
      className={`h-screen shadow-md bg-blue-900 text-white p-4 overflow-auto transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-800"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      <nav>
        <ul>
          {nav.map((item) => {
            const active = isActive(item);
            const expanded = expandedMenus[item.label] ?? active;

            if (item.children) {
              return (
                <li key={item.label} className="mb-2">
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={`flex items-center w-full px-3 py-2 rounded hover:bg-gray-600 ${
                      active ? " font-semibold" : ""
                    }`}
                  >
                    <span className={`mr-2 ${collapsed ? "" : "inline"}`}>{item.icon}</span>
                    <span className={`flex-1 text-left ${collapsed ? "hidden" : "inline"}`}>
                      {item.label}
                    </span>
                    <span className={`ml-auto ${collapsed ? "" : "inline"}`}>
                      {expanded ? "▾" : "▸"}
                    </span>
                  </button>

                  {expanded && !collapsed && (
                    <ul className="pl-6 mt-1">
                      {item.children.map((child) => (
                        <li key={child.label} className="mb-1">
                          <NavLink
                            to={child.path!}
                            className={({ isActive }) =>
                              `flex items-center px-3 py-1 rounded hover:bg-gray-600 ${
                                isActive ? "bg-gray-300 font-semibold" : ""
                              }`
                            }
                          >
                            <span className="mr-2">{child.icon}</span>
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            } else {
              if (item.action) {
                // Render a button if action exists (e.g. logout)
                return (
                  <li key={item.label} className="mb-2">
                    <button
                      onClick={item.action}
                      className="flex items-center w-full px-3 py-2 rounded hover:bg-gray-600"
                    >
                      <span className={`mr-2 ${collapsed ? "" : "inline"}`}>{item.icon}</span>
                      <span className={`${collapsed ? "" : "inline"}`}>{item.label}</span>
                    </button>
                  </li>
                );
              }
              return (
                <li key={item.label} className="mb-2">
                  <NavLink
                    to={item.path!}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 rounded hover:bg-gray-600 ${
                        isActive ? " font-semibold" : ""
                      }`
                    }
                  >
                    <span className={`mr-2 ${collapsed ? "" : "inline"}`}>{item.icon}</span>
                    <span className={`${collapsed ? "hidden" : "inline"}`}>{item.label}</span>
                  </NavLink>
                </li>
              );
            }
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
