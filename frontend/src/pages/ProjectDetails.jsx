import { useParams, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import * as FaIcons from "react-icons/fa";

import { STATUSES } from "../utils/helpers";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";

import { FiCalendar, FiUsers, FiCheckSquare } from "react-icons/fi";

// API
import { useProject } from "../hooks/useProjects";
import { useEmployees } from "../hooks/useEmployees";
import { useTasks } from "../hooks/useTasks";

export default function ProjectDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  // =========================
  // THEME
  // =========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // =========================
  // PROJECT
  // =========================

  const { data: project, isLoading, error } = useProject(id);

  // =========================
  // EMPLOYEES
  // =========================

  const { data: employees = [] } = useEmployees();

  // =========================
  // TASKS
  // =========================

  const { data: tasks = [] } = useTasks();

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
        className={`min-h-screen flex items-center justify-center text-lg
        ${dark ? "bg-[#020617] text-red-400" : "bg-gray-100 text-red-500"}`}
      >
        Failed to load project
      </div>
    );
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!project) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-lg
        ${dark ? "bg-[#020617] text-gray-300" : "bg-gray-100 text-gray-500"}`}
      >
        Project not found
      </div>
    );
  }

  // =========================
  // PROJECT ICON
  // =========================

  const IconComponent = FaIcons[project.icon] || FaIcons.FaProjectDiagram;

  // =========================
  // EMPLOYEES
  // =========================

  const assignedEmployees = employees.filter((emp) =>
    project.employees?.some(
      (employeeId) => employeeId.toString() === emp._id.toString(),
    ),
  );

  // =========================
  // PROJECT TASKS
  // =========================

  const projectTasks = tasks.filter(
    (task) =>
      String(task.projectId?._id || task.projectId) === String(project._id),
  );

  // =========================
  // COMPLETED
  // =========================

  const completedTasks = projectTasks.filter(
    (task) => task.status?.toLowerCase() === "completed",
  ).length;

  // =========================
  // PROGRESS
  // =========================

  const progress =
    projectTasks.length > 0
      ? Math.round((completedTasks / projectTasks.length) * 100)
      : 0;

  // =========================
  // STATUS LABEL
  // =========================

  const getStatusLabel = (key) => {
    return STATUSES.find((s) => s.key === key)?.label || key;
  };

  // =========================
  // INITIALS
  // =========================

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300
      ${dark ? "bg-[#020617] text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <div className="p-4 sm:p-6">
        {/* BACK BUTTON */}
        <div className="mb-6">
          <Button onClick={() => navigate("/projects")}>
            ← Back to Projects
          </Button>
        </div>

        {/* ========================= */}
        {/* PROJECT HEADER */}
        {/* ========================= */}

        <div
          className={`relative overflow-hidden rounded-3xl shadow-2xl p-5 sm:p-8 border transition-all duration-300
          ${
            dark
              ? "bg-gradient-to-br from-[#172554] via-[#0f172a] to-[#020617] border-white/10"
              : "bg-gradient-to-br from-blue-100 via-white to-gray-100 border-gray-200"
          }`}
        >
          {/* BG GLOW */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* TOP */}
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">
              {/* LEFT */}
              <div className="flex sm:flex-row items-start gap-5 flex-1 min-w-0">
                {/* PROJECT ICON */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl sm:text-4xl shadow-2xl text-white shrink-0">
                  <IconComponent />
                </div>

                {/* TITLE */}
                <div className="min-w-0">
                  <h1
                    className={`text-2xl sm:text-3xl xl:text-4xl font-bold tracking-wide break-words
                    ${dark ? "text-white" : "text-gray-900"}`}
                  >
                    {project.title}
                  </h1>

                  <p
                    className={`mt-3 leading-relaxed text-sm sm:text-base break-words
                    ${dark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {project.description || "No description added"}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="w-full xl:w-150 shrink-0">
                {/* TOP */}
                <div className="flex items-center justify-between mb-3">
                  <p
                    className={`text-sm font-medium
                    ${dark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Project Progress
                  </p>

                  <p className="text-lg sm:text-xl text-cyan-400 font-bold">
                    {progress}%
                  </p>
                </div>

                {/* PROGRESS BAR */}
                <div
                  className={`h-4 rounded-full overflow-hidden border
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

                {/* LABELS */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3">
                  <p
                    className={`text-xs
                    ${dark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    {completedTasks}/{projectTasks.length} Completed
                  </p>

                  <p
                    className={`text-xs
                    ${dark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-10">
              {/* START DATE */}
              <div
                className={`rounded-2xl p-5 backdrop-blur-md transition
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
                  Start Date
                </p>

                <h3
                  className={`mt-3 text-sm sm:text-lg font-semibold
                  ${dark ? "text-white" : "text-gray-900"}`}
                >
                  {project.startDate
                    ? new Date(project.startDate).toLocaleDateString()
                    : "N/A"}
                </h3>
              </div>

              {/* END DATE */}
              <div
                className={`rounded-2xl p-5 backdrop-blur-md transition
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
                  Deadline
                </p>

                <h3
                  className={`mt-3 text-sm sm:text-lg font-semibold
                  ${dark ? "text-white" : "text-gray-900"}`}
                >
                  {project.endDate
                    ? new Date(project.endDate).toLocaleDateString()
                    : "N/A"}
                </h3>
              </div>

              {/* MEMBERS */}
              <div
                className={`rounded-2xl p-5 backdrop-blur-md transition
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
                    Team Members
                  </p>

                  <FiUsers className="text-cyan-400" />
                </div>

                <h3
                  className={`mt-3 text-sm sm:text-lg font-semibold
                  ${dark ? "text-white" : "text-gray-900"}`}
                >
                  {assignedEmployees.length} Members
                </h3>
              </div>

              {/* TASKS */}
              <div
                className={`rounded-2xl p-5 backdrop-blur-md transition
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
                    Total Tasks
                  </p>

                  <FiCheckSquare className="text-green-400" />
                </div>

                <h3
                  className={`mt-3 text-sm sm:text-lg font-semibold
                  ${dark ? "text-white" : "text-gray-900"}`}
                >
                  {projectTasks.length} Tasks
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 flex-1 mt-6 overflow-hidden">
          {/* ================= TEAM ================= */}
          <div className="lg:col-span-1 flex flex-col overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className={`text-xl font-bold
          ${dark ? "text-white" : "text-gray-900"}`}
                >
                  Team ({assignedEmployees.length})
                </h2>

                <p
                  className={`text-sm mt-1
          ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Assigned project members
                </p>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs border
        ${
          dark
            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
            : "bg-cyan-100 text-cyan-700 border-cyan-200"
        }`}
              >
                Members
              </div>
            </div>

            {/* EMPTY */}
            {assignedEmployees.length === 0 ? (
              <div
                className={`rounded-3xl p-8 text-center
        ${
          dark
            ? "bg-[#1e293b] border border-white/10 text-gray-400"
            : "bg-white border border-gray-200 text-gray-500"
        }`}
              >
                No Team Members
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 custom-scroll space-y-3">
                {assignedEmployees.map((emp) => (
                  <div
                    key={emp._id}
                    className={`group transition-all duration-300 rounded-2xl p-3 border
              ${
                dark
                  ? "bg-[#1e293b] hover:bg-[#243041] border-white/5 hover:border-cyan-500/20"
                  : "bg-white hover:bg-gray-50 border-gray-200 hover:border-cyan-300"
              }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* IMAGE */}
                      {emp.image ? (
                        <img
                          src={`http://localhost:5000${emp.image}`}
                          alt={emp.name}
                          className={`w-12 h-12 rounded-2xl object-cover border
                    ${dark ? "border-white/10" : "border-gray-200"}`}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                          {getInitials(emp.name)}
                        </div>
                      )}

                      {/* INFO */}
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-sm font-semibold truncate transition
                    ${
                      dark
                        ? "text-white group-hover:text-cyan-400"
                        : "text-gray-900 group-hover:text-cyan-600"
                    }`}
                        >
                          {emp.name}
                        </h3>

                        <p
                          className={`text-xs mt-1 truncate
                    ${dark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {emp.position || "No Position"}
                        </p>
                      </div>

                      {/* STATUS DOT */}
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ================= TASKS ================= */}
          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className={`text-xl font-bold
          ${dark ? "text-white" : "text-gray-900"}`}
                >
                  Tasks ({projectTasks.length})
                </h2>

                <p
                  className={`text-sm mt-1
          ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Active project tasks
                </p>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs border
        ${
          dark
            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
            : "bg-purple-100 text-purple-700 border-purple-200"
        }`}
              >
                Active Board
              </div>
            </div>

            {/* EMPTY */}
            {projectTasks.length === 0 ? (
              <div
                className={`rounded-3xl p-8 text-center
        ${
          dark
            ? "bg-[#1e293b] border border-white/10 text-gray-400"
            : "bg-white border border-gray-200 text-gray-500"
        }`}
              >
                No Tasks Added
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projectTasks.map((task) => {
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
                      ? "bg-[#1e293b] hover:bg-[#243041] border border-white/5 hover:border-cyan-500/20"
                      : "bg-white hover:bg-gray-50 border border-gray-200 hover:border-cyan-300"
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
                        <div className="mt-5 flex items-center justify-between">
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
    </div>
  );
}
