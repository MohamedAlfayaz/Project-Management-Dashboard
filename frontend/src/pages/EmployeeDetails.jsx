import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import * as FaIcons from "react-icons/fa";

import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";

import {
  FiMail,
  FiBriefcase,
  FiFolder,
  FiCheckSquare,
  FiCalendar,
} from "react-icons/fi";

import { useEmployee } from "../hooks/useEmployees";
import { useProjects } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";

import { STATUSES } from "../utils/helpers";

export default function EmployeeDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  // ==========================
  // THEME
  // ==========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // ==========================
  // API
  // ==========================

  const { data: employee, isLoading, error } = useEmployee(id);

  const { data: projects = [] } = useProjects();

  const { data: tasks = [] } = useTasks();

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
        className={`min-h-screen flex items-center justify-center text-lg
        ${dark ? "bg-[#020617] text-red-400" : "bg-gray-100 text-red-500"}`}
      >
        Failed to load employee
      </div>
    );
  }

  // ==========================
  // NOT FOUND
  // ==========================

  if (!employee) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-lg
        ${dark ? "bg-[#020617] text-gray-300" : "bg-gray-100 text-gray-500"}`}
      >
        Employee not found
      </div>
    );
  }

  // ==========================
  // FILTER PROJECTS
  // ==========================

  const employeeProjects = projects.filter((project) =>
    project.employees?.some(
      (empId) => empId.toString() === employee._id.toString(),
    ),
  );

  // ==========================
  // FILTER TASKS
  // ==========================

  const employeeTasks = tasks.filter((task) => {
    if (!Array.isArray(task.employeeIds)) {
      return false;
    }

    return task.employeeIds.some(
      (emp) => String(emp._id || emp) === String(employee._id),
    );
  });

  // ==========================
  // COMPLETED
  // ==========================

  const completedTasks = employeeTasks.filter(
    (task) => task.status?.toLowerCase() === "completed",
  ).length;

  // ==========================
  // PROGRESS
  // ==========================

  const progress =
    employeeTasks.length > 0
      ? Math.round((completedTasks / employeeTasks.length) * 100)
      : 0;

  // ==========================
  // INITIALS
  // ==========================

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // ==========================
  // STATUS LABEL
  // ==========================

  const getStatusLabel = (key) => {
    return STATUSES.find((s) => s.key === key)?.label || key;
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 transition-all duration-300
      ${dark ? "bg-[#020617] text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {/* BACK */}
      <div className="mb-6">
        <Button onClick={() => navigate("/employees")}>
          ← Back to Employees
        </Button>
      </div>

      {/* HERO */}
      <div
        className={`relative overflow-hidden rounded-3xl shadow-2xl p-5 sm:p-8 border transition-all duration-300
        ${
          dark
            ? "bg-gradient-to-br from-[#172554] via-[#0f172a] to-[#020617] border-white/10"
            : "bg-gradient-to-br from-blue-100 via-white to-gray-100 border-gray-200"
        }`}
      >
        {/* BG GLOW */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* TOP */}
          <div className="flex flex-col xl:flex-row items-center justify-center gap-4">
            {/* LEFT */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* IMAGE */}
              {employee.image ? (
                <img
                  src={`http://localhost:5000${employee.image}`}
                  alt={employee.name}
                  className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 shadow-2xl
                  ${dark ? "border-white/10" : "border-white"}`}
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                  {getInitials(employee.name)}
                </div>
              )}

              {/* INFO */}
              <div className="min-w-0">
                <h1
                  className={`text-xl text-center sm:text-4xl font-bold tracking-wide break-words
                  ${dark ? "text-white" : "text-gray-900"}`}
                >
                  {employee.name}
                </h1>

                <div className="flex flex-col gap-3 mt-3">
                  {/* EMAIL */}
                  <div
                    className={`flex items-center gap-3
                    ${dark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${dark ? "bg-white/5" : "bg-gray-200"}`}
                    >
                      <FiMail />
                    </div>

                    <span className="break-all text-sm sm:text-lg">{employee.email}</span>
                  </div>

                  {/* POSITION */}
                  <div
                    className={`flex items-center gap-3
                    ${dark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                      ${dark ? "bg-white/5" : "bg-gray-200"}`}
                    >
                      <FiBriefcase />
                    </div>

                    <span className="text-sm sm:text-lg">{employee.position}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="w-full xl:w-[420px] shrink-0">
              {/* TOP */}
              <div className="flex items-center justify-between mb-3">
                <p
                  className={`text-sm font-medium
                  ${dark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Task Performance
                </p>

                <p className="text-lg text-cyan-400 font-bold">{progress}%</p>
              </div>

              {/* PROGRESS BAR */}
              <div
                className={`h-3 rounded-full overflow-hidden border
                ${
                  dark
                    ? "bg-white/10 border-white/10"
                    : "bg-gray-200 border-gray-200"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-700
                  ${
                    progress === 100
                      ? "bg-gradient-to-r from-green-400 to-emerald-500"
                      : progress >= 50
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                        : "bg-gradient-to-r from-cyan-400 to-blue-500"
                  }`}
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto gap-4 sm:gap-5 mt-6">
            {/* PROJECTS */}
            <div
              className={`rounded-2xl p-4 sm:p-5 backdrop-blur-md transition
              ${
                dark
                  ? "bg-white/5 border border-white/10 hover:bg-white/10"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <p
                  className={`text-xs uppercase tracking-wider
                  ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Projects
                </p>

                <FiFolder className="text-cyan-400 text-lg" />
              </div>

              <h3
                className={`mt-2 text-xl text-center sm:text-3xl font-bold
                ${dark ? "text-white" : "text-gray-900"}`}
              >
                {employeeProjects.length}
              </h3>
            </div>

            {/* TASKS */}
            <div
              className={`rounded-2xl p-4 sm:p-5 backdrop-blur-md transition
              ${
                dark
                  ? "bg-white/5 border border-white/10 hover:bg-white/10"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <p
                  className={`text-xs uppercase tracking-wider
                  ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Tasks
                </p>

                <FiCheckSquare className="text-green-400 text-lg" />
              </div>

              <h3
                className={`mt-2 text-xl text-center sm:text-3xl font-bold
                ${dark ? "text-white" : "text-gray-900"}`}
              >
                {employeeTasks.length}
              </h3>
            </div>

            {/* COMPLETED */}
            <div
              className={`rounded-2xl p-4 sm:p-5 backdrop-blur-md transition
              ${
                dark
                  ? "bg-white/5 border border-white/10 hover:bg-white/10"
                  : "bg-white border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <p
                className={`text-xs uppercase tracking-wider
                ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Completed
              </p>

              <h3 className="mt-2 text-xl text-center sm:text-3xl font-bold text-green-400">
                {completedTasks}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1 mt-8 overflow-hidden">
        {/* ========================== */}
        {/* PROJECTS */}
        {/* ========================== */}

        <div className="lg:col-span-1 flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className={`text-xl font-bold
          ${dark ? "text-white" : "text-gray-900"}`}
              >
                Assigned Projects
              </h2>

              <p
                className={`text-sm mt-1
          ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                {employeeProjects.length} projects assigned
              </p>
            </div>

            <div
              className={`px-3 py-1 rounded-full border text-xs
        ${
          dark
            ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
            : "bg-cyan-100 border-cyan-200 text-cyan-700"
        }`}
            >
              Projects
            </div>
          </div>

          {/* EMPTY */}
          {employeeProjects.length === 0 ? (
            <div
              className={`rounded-3xl p-8 text-center
        ${
          dark
            ? "bg-[#1e293b] border border-white/10 text-gray-400"
            : "bg-white border border-gray-200 text-gray-500"
        }`}
            >
              No Projects Assigned
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 custom-scroll space-y-3">
              {employeeProjects.map((project) => {
                const IconComponent =
                  FaIcons[project.icon] || FaIcons.FaProjectDiagram;

                return (
                  <div
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className={`group cursor-pointer transition-all duration-300 rounded-2xl p-3 border
                ${
                  dark
                    ? "bg-[#1e293b] hover:bg-[#243041] border-white/5 hover:border-cyan-500/30"
                    : "bg-white hover:bg-gray-50 border-gray-200 hover:border-cyan-300"
                }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* ICON */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl text-white shadow-lg shrink-0">
                        <IconComponent />
                      </div>

                      {/* INFO */}
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-lg font-bold transition truncate
                      ${
                        dark
                          ? "text-white group-hover:text-cyan-400"
                          : "text-gray-900 group-hover:text-cyan-600"
                      }`}
                        >
                          {project.title}
                        </h3>

                        <p
                          className={`text-sm mt-0.5 line-clamp-1
                      ${dark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {project.description || "No description"}
                        </p>

                        <p
                          className={`flex items-center gap-1 mt-2 text-xs
                      ${dark ? "text-gray-500" : "text-gray-500"}`}
                        >
                          <FiCalendar className="text-sm" />

                          {project.startDate
                            ? new Date(project.startDate).toLocaleDateString()
                            : "No Date"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================== */}
        {/* TASKS */}
        {/* ========================== */}

        <div className="lg:col-span-2 flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className={`text-xl font-bold
          ${dark ? "text-white" : "text-gray-900"}`}
              >
                Assigned Tasks
              </h2>

              <p
                className={`text-sm mt-1
          ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                {employeeTasks.length} tasks assigned
              </p>
            </div>

            <div
              className={`px-3 py-1 rounded-full border text-xs
        ${
          dark
            ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
            : "bg-purple-100 border-purple-200 text-purple-700"
        }`}
            >
              Task Board
            </div>
          </div>

          {/* EMPTY */}
          {employeeTasks.length === 0 ? (
            <div
              className={`rounded-3xl p-8 text-center
        ${
          dark
            ? "bg-[#1e293b] border border-white/10 text-gray-400"
            : "bg-white border border-gray-200 text-gray-500"
        }`}
            >
              No Tasks Assigned
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
              <div className="grid sm:grid-cols-2 gap-4">
                {employeeTasks.map((task) => {
                  const project = projects.find(
                    (p) =>
                      String(p._id) ===
                      String(task.projectId?._id || task.projectId),
                  );

                  const status = task.status?.toLowerCase()?.trim();

                  const statusColor =
                    status === "completed"
                      ? dark
                        ? "border-green-400 text-green-400 bg-green-400/10"
                        : "border-green-300 text-green-700 bg-green-100"
                      : status === "inprogress"
                        ? dark
                          ? "border-yellow-400 text-yellow-400 bg-yellow-400/10"
                          : "border-yellow-300 text-yellow-700 bg-yellow-100"
                        : status === "needtest"
                          ? dark
                            ? "border-purple-400 text-purple-400 bg-purple-400/10"
                            : "border-purple-300 text-purple-700 bg-purple-100"
                          : status === "reopen"
                            ? dark
                              ? "border-red-400 text-red-400 bg-red-400/10"
                              : "border-red-300 text-red-700 bg-red-100"
                            : dark
                              ? "border-gray-400 text-gray-400 bg-gray-400/10"
                              : "border-gray-300 text-gray-700 bg-gray-100";

                  const leftBorderColor =
                    status === "completed"
                      ? "border-l-green-400"
                      : status === "inprogress"
                        ? "border-l-yellow-400"
                        : status === "needtest"
                          ? "border-l-purple-400"
                          : status === "reopen"
                            ? "border-l-red-400"
                            : "border-l-gray-400";

                  return (
                    <div
                      key={task._id}
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className={`group cursor-pointer rounded-2xl p-4 border-l-4 transition-all duration-300 hover:scale-[1.01]
                  ${leftBorderColor}
                  ${
                    dark
                      ? "bg-[#1e293b] border-white/5 hover:border-cyan-500/20 hover:bg-[#243041]"
                      : "bg-white border-gray-200 hover:border-cyan-300 hover:bg-gray-50"
                  }`}
                    >
                      {/* TOP */}
                      <div className="flex items-start justify-between gap-3">
                        {/* LEFT */}
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <h3
                            className={`text-lg font-bold leading-snug break-words line-clamp-2 transition
                          ${
                            dark
                              ? "text-white group-hover:text-cyan-400"
                              : "text-gray-900 group-hover:text-cyan-600"
                          }`}
                          >
                            {task.title}
                          </h3>

                          <p
                            className={`text-sm mt-2 break-words line-clamp-2
      ${dark ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {task.description || "No description"}
                          </p>
                        </div>

                        {/* STATUS */}
                        <div
                          className={`shrink-0 px-3 py-1 rounded-full border text-[11px] whitespace-nowrap h-fit ${statusColor}`}
                        >
                          {getStatusLabel(task.status)}
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="mt-5 flex items-center justify-between gap-2">
                        {/* ETA */}
                        <div>
                          <p
                            className={`text-[10px] uppercase tracking-wider
                        ${dark ? "text-gray-500" : "text-gray-500"}`}
                          >
                            ETA
                          </p>

                          <p
                            className={`text-sm mt-1
                        ${dark ? "text-gray-300" : "text-gray-700"}`}
                          >
                            {task.eta
                              ? new Date(task.eta).toLocaleDateString()
                              : "No ETA"}
                          </p>
                        </div>

                        {/* PROJECT */}
                        <div className="text-right">
                          <p
                            className={`text-[10px] uppercase tracking-wider
                        ${dark ? "text-gray-500" : "text-gray-500"}`}
                          >
                            Project
                          </p>

                          <p className="text-sm text-cyan-400 truncate max-w-[120px] mt-1">
                            {project?.title || "No Project"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
