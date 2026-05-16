import { useState, useMemo } from "react";

import { useSelector } from "react-redux";

import TaskForm from "../components/forms/TaskForm";
import Drawer from "../components/ui/Drawer";
import Loading from "../components/ui/Loading";

import { FiPlus, FiSearch, FiEdit, FiTrash2 } from "react-icons/fi";

import { FaClock } from "react-icons/fa";

import Button from "../components/ui/Button";

import { useNavigate } from "react-router-dom";

import { STATUSES } from "../utils/helpers";

// ✅ TASK API
import { useTasks, useDeleteTask } from "../hooks/useTasks";

// ✅ PROJECT API
import { useProjects } from "../hooks/useProjects";

// ✅ EMPLOYEE API
import { useEmployees } from "../hooks/useEmployees";

export default function Tasks() {
  const navigate = useNavigate();

  // ==========================
  // THEME
  // ==========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // ==========================
  // TASK API
  // ==========================

  const { data: tasks = [], isLoading, error } = useTasks();

  // ==========================
  // PROJECT API
  // ==========================

  const { data: projects = [] } = useProjects();

  // ==========================
  // EMPLOYEE API
  // ==========================

  const { data: employees = [] } = useEmployees();

  // ==========================
  // DELETE MUTATION
  // ==========================

  const deleteMutation = useDeleteTask();

  // ==========================
  // STATE
  // ==========================

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState(null);

  const [filterProject, setFilterProject] = useState("");

  const [search, setSearch] = useState("");

  // ==========================
  // EDIT
  // ==========================

  const handleEdit = (task) => {
    setEditData(task);

    setOpen(true);
  };

  // ==========================
  // DELETE
  // ==========================

  const handleDelete = async (id) => {
    if (window.confirm("Delete task?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error(error);

        alert(error?.response?.data?.message || "Delete failed");
      }
    }
  };

  // ==========================
  // FILTER + SEARCH
  // ==========================

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const taskProjectId = t.projectId?._id || t.projectId;

      const matchProject = filterProject
        ? String(taskProjectId) === String(filterProject)
        : true;

      const matchSearch = `${t.title} ${t.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchProject && matchSearch;
    });
  }, [tasks, filterProject, search]);

  // ==========================
  // STATS
  // ==========================

  const completed = tasks.filter(
    (t) => t.status?.toLowerCase() === "completed",
  ).length;

  const pending = tasks.length - completed;

  // ==========================
  // STATUS LABEL
  // ==========================

  const getStatusLabel = (key) =>
    STATUSES.find((s) => s.key === key)?.label || key;

  // ==========================
  // LOADING
  // ==========================

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  // ==========================
  // ERROR
  // ==========================

  if (error) {
    return (
      <div
        className={`p-6
        ${dark ? "text-red-400" : "text-red-500"}`}
      >
        Failed to load tasks
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 transition-all duration-300
      ${dark ? "bg-[#020617] text-gray-200" : "bg-gray-100 text-gray-800"}`}
    >
      {/* HEADER */}
      <div
        className={`relative overflow-hidden rounded-[32px] border p-6 sm:p-7 mb-6 transition-all duration-300
  ${
    dark
      ? `
        bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]
        border-slate-800
        shadow-2xl shadow-black/20
      `
      : `
        bg-white
        border-gray-200
        shadow-sm
      `
  }`}
      >
        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* LEFT */}
          <div className="flex flex-col gap-4">
            {/* TITLE */}
            <div>
              <h2
                className={`text-3xl sm:text-4xl font-black tracking-tight
          ${dark ? "text-white" : "text-gray-900"}`}
              >
                Task Management
              </h2>

              <p
                className={`mt-2 text-sm sm:text-base
          ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Manage, track and organize your project tasks efficiently.
              </p>
            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-4">
              {/* TOTAL */}
              <div
                className={`min-w-[110px] rounded-2xl text-center px-4 py-3 border transition-all
          ${
            dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide
            ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Total
                </p>

                <h3
                  className={`text-2xl font-bold mt-1
            ${dark ? "text-white" : "text-gray-900"}`}
                >
                  {tasks.length}
                </h3>
              </div>

              {/* COMPLETED */}
              <div
                className={`min-w-[110px] rounded-2xl text-center px-4 py-3 border transition-all
          ${
            dark
              ? "bg-green-500/10 border-green-500/20"
              : "bg-green-50 border-green-200"
          }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide
            ${dark ? "text-green-300" : "text-green-600"}`}
                >
                  Completed
                </p>

                <h3
                  className={`text-2xl font-bold mt-1
            ${dark ? "text-green-400" : "text-green-700"}`}
                >
                  {completed}
                </h3>
              </div>

              {/* PENDING */}
              <div
                className={`min-w-[110px] rounded-2xl text-center px-4 py-3 border transition-all
          ${
            dark
              ? "bg-yellow-500/10 border-yellow-500/20"
              : "bg-yellow-50 border-yellow-200"
          }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide
            ${dark ? "text-yellow-300" : "text-yellow-600"}`}
                >
                  Pending
                </p>

                <h3
                  className={`text-2xl font-bold mt-1
            ${dark ? "text-yellow-400" : "text-yellow-700"}`}
                >
                  {pending}
                </h3>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            {/* SEARCH */}
            <div
              className={`flex items-center gap-3 px-4 h-14 rounded-2xl border w-full sm:w-[320px] transition-all duration-300
        ${
          dark
            ? `
              bg-[#0b1220]
              border-slate-700
              focus-within:border-cyan-500/50
              focus-within:ring-4
              focus-within:ring-cyan-500/10
            `
            : `
              bg-white
              border-gray-300
              focus-within:border-cyan-500
              focus-within:ring-4
              focus-within:ring-cyan-100
            `
        }`}
            >
              <FiSearch
                className={`text-lg shrink-0
          ${dark ? "text-gray-400" : "text-gray-500"}`}
              />

              <input
                type="text"
                placeholder="Search tasks..."
                className={`bg-transparent outline-none text-sm w-full
          ${
            dark
              ? "text-white placeholder:text-gray-500"
              : "text-gray-900 placeholder:text-gray-400"
          }`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* FILTER */}
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className={`h-14 rounded-2xl px-4 border outline-none transition-all duration-300 min-w-[190px]
        ${
          dark
            ? `
              bg-[#0b1220]
              border-slate-700
              text-white
              focus:border-cyan-500/50
            `
            : `
              bg-white
              border-gray-300
              text-gray-900
              focus:border-cyan-500
            `
        }`}
            >
              <option value="">All Projects</option>

              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>

            {/* ADD BUTTON */}
            <Button
              onClick={() => {
                setEditData(null);
                setOpen(true);
              }}
              variant="header"
            >
              <FiPlus className="text-lg" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-24">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-5
            ${dark ? "bg-white/5" : "bg-white"}`}
          >
            <FiSearch className="text-5xl text-cyan-400" />
          </div>

          <h3
            className={`text-xl font-bold
            ${dark ? "text-white" : "text-gray-900"}`}
          >
            No Tasks Found
          </h3>

          <p
            className={`mt-2 text-sm
            ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Try changing your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 ">
          {filteredTasks.map((task) => {
            // ==========================
            // PROJECT
            // ==========================

            const project = projects.find(
              (p) =>
                String(p._id) === String(task.projectId?._id || task.projectId),
            );

            // ==========================
            // EMPLOYEES
            // ==========================

            const assignedEmployees = employees.filter((emp) => {
              if (!Array.isArray(task.employeeIds)) {
                return false;
              }

              return task.employeeIds.some(
                (employee) =>
                  String(employee._id || employee) === String(emp._id),
              );
            });

            // ==========================
            // STATUS
            // ==========================

            const status = task.status?.toLowerCase();

            const statusColor =
              status === "completed"
                ? dark
                  ? "border-green-500"
                  : "border-green-400"
                : status === "inprogress"
                  ? dark
                    ? "border-yellow-500"
                    : "border-yellow-400"
                  : status === "needtest"
                    ? dark
                      ? "border-purple-500"
                      : "border-purple-400"
                    : status === "reopen"
                      ? dark
                        ? "border-red-500"
                        : "border-red-400"
                      : dark
                        ? "border-gray-600"
                        : "border-gray-300";

            return (
              <div
                key={task._id}
                onClick={() => navigate(`/tasks/${task._id}`)}
                className={`group cursor-pointer rounded-3xl border-l-4 p-4 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]
                  ${statusColor}
                  ${
                    dark
                      ? "bg-gradient-to-br from-[#1e293b] to-[#0f172a]"
                      : "bg-white border-gray-200"
                  }`}
              >
                {/* TOP */}
                <div className="flex justify-between items-start gap-3">
                  {/* LEFT */}
                  <div className="min-w-0 flex-1">
                    <h3
                      className={`font-bold text-md leading-snug line-clamp-2 transition
        ${
          dark
            ? "text-white group-hover:text-cyan-400"
            : "text-gray-900 group-hover:text-cyan-600"
        }`}
                    >
                      {task.title}
                    </h3>

                    <p
                      className={`text-sm mt-2 truncate
        ${dark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {project?.title || "No Project"}
                    </p>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`shrink-0 px-4 py-2 text-xs rounded-full border whitespace-nowrap h-fit
      ${
        status === "completed"
          ? dark
            ? "border-green-500 text-green-400 bg-green-500/10"
            : "border-green-300 text-green-700 bg-green-100"
          : status === "inprogress"
            ? dark
              ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
              : "border-yellow-300 text-yellow-700 bg-yellow-100"
            : status === "needtest"
              ? dark
                ? "bg-purple-500/20 text-purple-400 border-purple-500"
                : "bg-purple-100 text-purple-700 border-purple-300"
              : status === "reopen"
                ? dark
                  ? "border-red-500 text-red-400 bg-red-500/10"
                  : "border-red-300 text-red-700 bg-red-100"
                : dark
                  ? "border-gray-600 text-gray-300 bg-gray-500/10"
                  : "border-gray-300 text-gray-700 bg-gray-100"
      }`}
                  >
                    {getStatusLabel(task.status)}
                  </span>
                </div>

                {/* DESCRIPTION */}
                <p
                  className={`text-sm line-clamp-2 min-h-[40px]
                    ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {task.description}
                </p>

                {/* EMPLOYEES */}
                <div className="flex items-center">
                  {assignedEmployees.slice(0, 5).map((emp, index) => (
                    <div
                      key={emp._id}
                      className={`relative group/avatar
                            ${index !== 0 ? "-ml-3" : ""}`}
                    >
                      {emp.image ? (
                        <img
                          src={`http://localhost:5000${emp.image}`}
                          alt={emp.name}
                          className={`w-10 h-10 rounded-full object-cover border-2 shadow-lg transition-transform duration-300 hover:scale-110 hover:z-20
                                ${dark ? "border-[#0f172a]" : "border-white"}`}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-semibold text-white border-2 shadow-lg transition-transform duration-300 hover:scale-110 hover:z-20">
                          {emp.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}

                      {/* TOOLTIP */}
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 z-30">
                        {emp.name}
                      </div>
                    </div>
                  ))}

                  {/* EXTRA */}
                  {assignedEmployees.length > 5 && (
                    <div
                      className={`-ml-3 w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold shadow-lg
                        ${
                          dark
                            ? "bg-gray-700 border-2 border-[#0f172a] text-white"
                            : "bg-gray-200 border-2 border-white text-gray-800"
                        }`}
                    >
                      +{assignedEmployees.length - 5}
                    </div>
                  )}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-2">
                  {/* ETA */}
                  <span
                    className={`flex gap-2 items-center text-sm
                      ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <FaClock />

                    {task.eta
                      ? new Date(task.eta).toLocaleDateString()
                      : "No ETA"}
                  </span>

                  {/* ACTIONS */}
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* EDIT */}
                    <Button
                      onClick={() => handleEdit(task)}
                      variant="secondary"
                    >
                      <FiEdit size={14} />
                    </Button>

                    {/* DELETE */}
                    <Button
                      onClick={() => handleDelete(task._id)}
                      variant="danger"
                    >
                      <FiTrash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DRAWER */}
      <Drawer
        isOpen={open}
        onClose={() => {
          setOpen(false);

          setEditData(null);
        }}
      >
        <TaskForm
          onClose={() => {
            setOpen(false);

            setEditData(null);
          }}
          editData={editData}
        />
      </Drawer>
    </div>
  );
}
