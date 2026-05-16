import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { STATUSES } from "../utils/helpers";

import TaskForm from "../components/forms/TaskForm";
import Drawer from "../components/ui/Drawer";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";

import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

import { FaClock } from "react-icons/fa";

// API
import { useTasks, useDeleteTask } from "../hooks/useTasks";

import { useProjects } from "../hooks/useProjects";

import { useEmployees } from "../hooks/useEmployees";

export default function TaskBoard() {
  const navigate = useNavigate();

  // =========================
  // THEME
  // =========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // =========================
  // TASKS
  // =========================

  const { data: tasks = [], isLoading, error } = useTasks();

  // =========================
  // PROJECTS
  // =========================

  const { data: projects = [] } = useProjects();

  // =========================
  // EMPLOYEES
  // =========================

  const { data: employees = [] } = useEmployees();

  // =========================
  // DELETE
  // =========================

  const deleteMutation = useDeleteTask();

  // =========================
  // STATE
  // =========================

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState(null);

  const [filterProject, setFilterProject] = useState("");

  // =========================
  // EDIT
  // =========================

  const handleEdit = (task) => {
    setEditData(task);

    setOpen(true);
  };

  // =========================
  // DELETE
  // =========================

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

  // =========================
  // STATUS LABEL
  // =========================

  const getStatusLabel = (key) => {
    return STATUSES.find((s) => s.key === key)?.label || key;
  };

  // =========================
  // STATUS BADGE
  // =========================

  const getStatusColor = (key) => {
    switch (key?.toLowerCase()) {
      case "completed":
        return dark
          ? "border-green-500 text-green-400 bg-green-500/10"
          : "border-green-300 text-green-700 bg-green-100";

      case "inprogress":
        return dark
          ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
          : "border-yellow-300 text-yellow-700 bg-yellow-100";

      case "needtest":
        return dark
          ? "border-purple-500 text-purple-400 bg-purple-500/10"
          : "border-purple-300 text-purple-700 bg-purple-100";

      case "reopen":
        return dark
          ? "border-red-500 text-red-400 bg-red-500/10"
          : "border-red-300 text-red-700 bg-red-100";

      default:
        return dark
          ? "border-gray-600 text-gray-300 bg-gray-500/10"
          : "border-gray-300 text-gray-700 bg-gray-100";
    }
  };

  // =========================
  // STATUS BORDER
  // =========================

  const getStatusBorder = (key) => {
    switch (key?.toLowerCase()) {
      case "completed":
        return "border-t-green-500";

      case "inprogress":
        return "border-t-yellow-500";

      case "needtest":
        return "border-t-purple-500";

      case "reopen":
        return "border-t-red-500";

      default:
        return "border-t-gray-500";
    }
  };

  // =========================
  // FILTER
  // =========================

  const filteredTasks = filterProject
    ? tasks.filter(
        (t) =>
          String(t.projectId?._id || t.projectId) === String(filterProject),
      )
    : tasks;

  // =========================
  // LOADING
  // =========================

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

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
      className={`min-h-screen transition-all duration-300
      ${dark ? "bg-[#020617] text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {/* HEADER */}
      <div className="p-4 sm:p-6 lg:p-8">
      <div
        className={`relative overflow-hidden border backdrop-blur-2xl transition-all duration-300 rounded-3xl
      ${
        dark
          ? `
            bg-[#020617]/85
            border-slate-700/70
            shadow-[0_10px_40px_rgba(0,0,0,0.45)]
          `
          : `
            bg-white/80
            border-gray-200
            shadow-[0_10px_30px_rgba(0,0,0,0.08)]
          `
      }`}
      >
        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 px-4 sm:px-6 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* LEFT */}
            <div className="min-w-0 flex-1">
              {/* TITLE */}
              <div>
                <h1
                  className={`text-3xl sm:text-4xl font-black tracking-tight break-words
            ${dark ? "text-white" : "text-gray-900"}`}
                >
                  Task Board
                </h1>

                <p
                  className={`mt-2 text-sm sm:text-base max-w-2xl
            ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Organize, track and manage tasks visually across project
                  stages.
                </p>
              </div>

              {/* QUICK STATS */}
              <div className="flex gap-3 mt-3">
                {/* TOTAL */}
                <div
                  className={`w-40 text-center px-4 py-3 rounded-2xl border
            ${
              dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
            }`}
                >
                  <p
                    className={`text-[11px] uppercase tracking-wider font-medium
              ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Total Tasks
                  </p>

                  <h3
                    className={`text-2xl font-bold mt-1
              ${dark ? "text-white" : "text-gray-900"}`}
                  >
                    {tasks.length}
                  </h3>
                </div>

                {/* PROJECTS */}
                <div
                  className={`w-40 text-center px-4 py-3 rounded-2xl border
            ${
              dark
                ? "bg-cyan-500/10 border-cyan-500/20"
                : "bg-cyan-50 border-cyan-200"
            }`}
                >
                  <p
                    className={`text-[11px] uppercase tracking-wider font-medium
              ${dark ? "text-cyan-300" : "text-cyan-600"}`}
                  >
                    Projects
                  </p>

                  <h3
                    className={`text-2xl font-bold mt-1
              ${dark ? "text-cyan-400" : "text-cyan-700"}`}
                  >
                    {projects.length}
                  </h3>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0">
              {/* FILTER */}
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className={`h-14 rounded-2xl px-4 border outline-none transition-all duration-300 w-full sm:min-w-[240px]
          ${
            dark
              ? `
                bg-[#0b1220]
                border-slate-700
                text-white
                focus:border-cyan-500/50
                focus:ring-4
                focus:ring-cyan-500/10
              `
              : `
                bg-white
                border-gray-300
                text-gray-900
                focus:border-cyan-500
                focus:ring-4
                focus:ring-cyan-100
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
      </div>
      </div>

      {/* BOARD */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-6 overflow-x-auto custom-scroll pb-4">
          {STATUSES.map((status) => {
            const columnTasks = filteredTasks.filter(
              (t) => t.status?.toLowerCase().replace(/\s+/g, "") === status.key,
            );

            return (
              <div
                key={status.key}
                className={`w-[340px] shrink-0 self-start border-t-4 rounded-3xl border transition-all duration-300
                  ${getStatusBorder(status.key)}
                  ${
                    dark
                      ? "bg-[#111827] border-white/10"
                      : "bg-white border-gray-200"
                  }`}
              >
                {/* COLUMN HEADER */}
                <div
                  className={`rounded-t-3xl px-5 py-4 border-b
                    ${
                      dark
                        ? "bg-[#111827] border-white/10"
                        : "bg-white border-gray-200"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`px-3 py-1 rounded-full border text-xs font-semibold ${getStatusColor(
                        status.key,
                      )}`}
                    >
                      {status.label}
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                        ${
                          dark
                            ? "bg-white/5 text-white"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {columnTasks.length}
                    </div>
                  </div>
                </div>

                {/* TASK LIST */}
                <div className="p-4 space-y-3 overflow-y-auto custom-scroll h-fit max-h-[75vh]">
                  {columnTasks.map((task) => {
                    // PROJECT
                    const project = projects.find(
                      (p) =>
                        String(p._id) ===
                        String(task.projectId?._id || task.projectId),
                    );

                    // EMPLOYEES
                    const assignedEmployees = employees.filter((emp) => {
                      if (!Array.isArray(task.employeeIds)) {
                        return false;
                      }

                      return task.employeeIds.some(
                        (employee) =>
                          String(employee._id || employee) === String(emp._id),
                      );
                    });

                    return (
                      <div
                        key={task._id}
                        onClick={() => navigate(`/tasks/${task._id}`)}
                        className={`group cursor-pointer rounded-3xl p-5 border border-t-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
                        ${getStatusBorder(task.status)}
                        ${
                          dark
                            ? `bg-[#131c2e] border-slate-700 hover:bg-[#1b263b] shadow-black/30`
                            : `bg-white border-gray-200 hover:bg-gray-50`
                        }`}
                      >
                        {/* TOP */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <h3
                              className={`font-bold text-lg truncate transition
                                  ${
                                    dark
                                      ? "text-white group-hover:text-cyan-400"
                                      : "text-gray-900 group-hover:text-cyan-600"
                                  }`}
                            >
                              {task.title}
                            </h3>

                            <p
                              className={`text-xs mt-1 truncate
                                  ${dark ? "text-gray-400" : "text-gray-500"}`}
                            >
                              {project?.title || "No Project"}
                            </p>
                          </div>

                          {/* STATUS */}
                          <span
                            className={`text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap ${getStatusColor(
                              task.status,
                            )}`}
                          >
                            {getStatusLabel(task.status)}
                          </span>
                        </div>

                        {/* DESCRIPTION */}
                        <p
                          className={`text-sm line-clamp-3
                              ${dark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {task.description}
                        </p>

                        {/* FOOTER */}
                        <div className="flex items-center justify-between mt-3">
                          {/* EMPLOYEES */}
                          <div className="flex -space-x-3">
                            {assignedEmployees.slice(0, 4).map((emp) => (
                              <div key={emp._id}>
                                {emp.image ? (
                                  <img
                                    src={`http://localhost:5000${emp.image}`}
                                    alt={emp.name}
                                    className={`w-10 h-10 rounded-full object-cover border-2 shadow-lg
                                            ${
                                              dark
                                                ? "border-[#0f172a]"
                                                : "border-white"
                                            }`}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-semibold text-white border-2 shadow-lg">
                                    {emp.name?.charAt(0)?.toUpperCase()}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* ETA */}
                          <div
                            className={`flex items-center gap-2 text-xs
                                ${dark ? "text-gray-400" : "text-gray-500"}`}
                          >
                            <FaClock />

                            {task.eta
                              ? new Date(task.eta).toLocaleDateString()
                              : "No ETA"}
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div
                          className="flex gap-2 mt-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            onClick={() => handleEdit(task)}
                            variant="secondary"
                            className="flex-1"
                          >
                            <FiEdit size={14} />
                          </Button>

                          <Button
                            onClick={() => handleDelete(task._id)}
                            variant="danger"
                            className="flex-1"
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  {/* EMPTY */}
                  {columnTasks.length === 0 && (
                    <div
                      className={`rounded-2xl border border-dashed py-10 text-center text-sm
                        ${
                          dark
                            ? "border-white/10 text-gray-500"
                            : "border-gray-300 text-gray-500"
                        }`}
                    >
                      No Tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DRAWER */}
      <Drawer
        isOpen={open}
        onClose={() => {
          setOpen(false);

          setEditData(null);
        }}
      >
        <TaskForm
          editData={editData}
          onClose={() => {
            setOpen(false);

            setEditData(null);
          }}
        />
      </Drawer>
    </div>
  );
}
