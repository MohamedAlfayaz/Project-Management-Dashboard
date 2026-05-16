import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../app/themeSlice";

import {
  FiHome,
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiGrid,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
} from "react-icons/fi";

export default function SideNav() {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  const menu = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "Employees", path: "/employees", icon: <FiUsers /> },
    { name: "Projects", path: "/projects", icon: <FiFolder /> },
    { name: "Tasks", path: "/tasks", icon: <FiCheckSquare /> },
    { name: "Task Board", path: "/taskboard", icon: <FiGrid /> },
  ];

  return (
    <div
      className={`flex h-screen transition-colors duration-300 ${
        dark ? "bg-[#0f172a]" : "bg-gray-100"
      }`}
    >
      {/* MOBILE HEADER */}
      <div
        className={`fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 md:hidden z-50 border-b transition-colors duration-300
        ${
          dark
            ? "bg-[#1e293b] text-white border-gray-800"
            : "bg-white text-gray-900 border-gray-200"
        }`}
      >
        <h1 className="font-semibold text-lg">Project Dashboard</h1>

        <div className="flex items-center gap-3">
          {/* THEME BUTTON */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`p-2 rounded-lg transition ${
              dark
                ? "bg-slate-700 text-yellow-300"
                : "bg-gray-200 text-orange-500"
            }`}
          >
            {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* MENU BUTTON */}
          <button onClick={() => setOpen(!open)}>
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 right-0 h-full w-60 mt-4 lg:mt-0 p-4 z-40 transform transition-all duration-300
        ${
          dark
            ? "bg-[#1e293b] text-gray-300 border-gray-800"
            : "bg-white text-gray-700 border-gray-200"
        }
        ${open ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
      >
        {/* LOGO */}
        <div className="hidden md:flex items-center justify-between my-8">
          <h2
            className={`text-xl font-bold tracking-wide ${
              dark ? "text-white" : "text-gray-900"
            }`}
          >
            Dashboard
          </h2>

          {/* THEME TOGGLE */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`p-2 rounded-xl transition
            ${
              dark
                ? "bg-slate-700 text-yellow-300"
                : "bg-gray-200 text-orange-500"
            }`}
          >
            {dark ? <FiSun /> : <FiMoon />}
          </button>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-2 mt-10 md:mt-0">
          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? dark
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "bg-blue-100 text-blue-600 border border-blue-200"
                    : dark
                      ? "hover:bg-[#0f172a] hover:text-white"
                      : "hover:bg-gray-100 hover:text-black"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div
          className={`mt-14 md:mt-0 h-full overflow-y-auto transition-colors duration-300
          ${dark ? "bg-[#0f172a] text-white" : "bg-gray-100 text-gray-900"}`}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}
