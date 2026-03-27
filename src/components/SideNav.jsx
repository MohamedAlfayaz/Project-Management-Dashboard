import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiGrid,
  FiMenu,
  FiX,
} from "react-icons/fi";

export default function SideNav() {
  const [open, setOpen] = useState(false);

  const menu = [
    { name: "Dashboard", path: "/", icon: <FiHome /> },
    { name: "Employees", path: "/employees", icon: <FiUsers /> },
    { name: "Projects", path: "/projects", icon: <FiFolder /> },
    { name: "Tasks", path: "/tasks", icon: <FiCheckSquare /> },
    { name: "Task Board", path: "/taskboard", icon: <FiGrid /> },
  ];

  return (
    <div className="flex h-screen bg-[#0f172a]">

      {/* MOBILE HEADER */}
      <div className="fixed top-0 left-0 right-0 bg-[#1e293b] text-white flex items-center justify-between px-4 py-3 md:hidden z-50 border-b border-gray-800">
        <h1 className="font-semibold text-lg">
          Project Dashboard
        </h1>

        <button onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-[180px] bg-[#1e293b] text-gray-300 p-4 z-40 transform transition-transform duration-300 border-r border-gray-800
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* LOGO / TITLE */}
        <div className="hidden md:flex items-center justify-center my-8">
          <h2 className="text-xl font-bold text-center text-white tracking-wide">
            Project Dashboard
          </h2>
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
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all
                ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "hover:bg-[#0f172a] hover:text-white"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* OVERLAY (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="mt-14 md:mt-0 h-full overflow-y-auto bg-[#0f172a]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}