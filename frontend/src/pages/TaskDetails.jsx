import { useParams, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { STATUSES } from "../utils/helpers";

import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";

import { FiCalendar, FiUsers, FiCheckSquare } from "react-icons/fi";

import { FaClock, FaFolderOpen } from "react-icons/fa";

// ✅ TASK API
import { useTaskById } from "../hooks/useTasks";

// ✅ PROJECT API
import { useProjects } from "../hooks/useProjects";

// ✅ EMPLOYEE API
import { useEmployees } from "../hooks/useEmployees";

export default function TaskDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  // ==========================
  // THEME
  // ==========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // ==========================
  // TASK API
  // ==========================

  const { data: task, isLoading, error } = useTaskById(id);

  // ==========================
  // PROJECT API
  // ==========================

  const { data: projects = [] } = useProjects();

  // ==========================
  // EMPLOYEE API
  // ==========================

  const { data: employees = [] } = useEmployees();

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
        Failed to load task
      </div>
    );
  }

  // ==========================
  // TASK NOT FOUND
  // ==========================

  if (!task) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-lg
        ${dark ? "bg-[#020617] text-gray-300" : "bg-gray-100 text-gray-500"}`}
      >
        Task not found
      </div>
    );
  }

  // ==========================
  // PROJECT
  // ==========================

  const project = projects.find(
    (p) => String(p._id) === String(task.projectId?._id || task.projectId),
  );

  // ==========================
  // EMPLOYEES
  // ==========================

  const assignedEmployees = employees.filter((emp) => {
    if (!Array.isArray(task.employeeIds)) {
      return false;
    }

    return task.employeeIds.some(
      (employee) => String(employee._id || employee) === String(emp._id),
    );
  });

  // ==========================
  // STATUS LABEL
  // ==========================

  const getStatusLabel = (key) =>
    STATUSES.find((s) => s.key === key)?.label || key;

  // ==========================
  // STATUS COLOR
  // ==========================

  const status = task.status?.toLowerCase();

  const statusColor =
    status === "completed"
      ? "border-green-500"
      : status === "inprogress"
        ? "border-yellow-500"
        : status === "needtest"
          ? "border-purple-500"
          : status === "reopen"
            ? "border-red-500"
            : "border-gray-600";

  return (
    <div
      className={`min-h-screen transition-all duration-300
      ${dark ? "bg-[#020617] text-white" : "bg-gray-100 text-gray-900"}`}
    >
      <div className="p-4 sm:p-6">
        {/* BACK */}
        <div className="mb-3">
          <Button onClick={() => navigate("/tasks")}>← Back to Tasks</Button>
        </div>

        {/* ========================= */}
        {/* TASK HEADER */}
        {/* ========================= */}

        <div
          className={`relative overflow-hidden rounded-3xl shadow-2xl p-5 sm:p-8 border-l-4 ${statusColor} transition-all duration-300
          ${
            dark
              ? "bg-gradient-to-br from-[#172554] via-[#0f172a] to-[#020617]"
              : "bg-gradient-to-br from-blue-100 via-white to-gray-100 border-gray-200"
          }`}
        >
          {/* BG GLOW */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* TOP */}
            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-4">
              {/* LEFT */}
              <div className="flex-1 min-w-0">
                {/* TITLE */}
                <h1
                  className={`text-2xl sm:text-3xl font-bold break-words
                  ${dark ? "text-white" : "text-gray-900"}`}
                >
                  {task.title}
                </h1>

                {/* DESC */}
                <p
                  className={`mt-2 text-sm sm:text-base leading-relaxed break-words
                  ${dark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {task.description || "No description added"}
                </p>

                {/* INFO */}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {/* PROJECT */}
                  <div
                    className={`flex items-center gap-2 rounded-2xl px-4 py-1 text-sm
                    ${
                      dark
                        ? "bg-white/5 text-gray-300 border border-white/10"
                        : "bg-white text-gray-700 border border-gray-200"
                    }`}
                  >
                    <FaFolderOpen className="text-cyan-400" />

                    {project?.title || "No Project"}
                  </div>

                  {/* ETA */}
                  <div
                    className={`flex items-center gap-2 rounded-2xl px-4 py-1 text-sm
                    ${
                      dark
                        ? "bg-white/5 text-gray-300 border border-white/10"
                        : "bg-white text-gray-700 border border-gray-200"
                    }`}
                  >
                    <FaClock className="text-yellow-400" />

                    {task.eta
                      ? new Date(task.eta).toLocaleDateString()
                      : "No ETA"}
                  </div>

                  {/* STATUS */}
                  <div
                    className={`px-4 py-1 text-sm rounded-2xl border
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
                              ? "border-purple-500 bg-purple-500/20 text-purple-400"
                              : "border-purple-300 bg-purple-100 text-purple-700"
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
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="grid grid-cols-2 gap-4 w-full xl:w-[300px]">
                {/* EMPLOYEES */}
                <div
                  className={`rounded-2xl p-3
                  ${
                    dark
                      ? "bg-white/5 border border-white/10"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs uppercase tracking-wider
                      ${dark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Members
                    </p>

                    <FiUsers className="text-cyan-400" />
                  </div>

                  <h3
                    className={`mt-2 text-2xl text-center font-bold
                    ${dark ? "text-white" : "text-gray-900"}`}
                  >
                    {assignedEmployees.length}
                  </h3>
                </div>

                {/* STATUS */}
                <div
                  className={`rounded-2xl p-3
                  ${
                    dark
                      ? "bg-white/5 border border-white/10"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs uppercase tracking-wider
                      ${dark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Status
                    </p>

                    <FiCheckSquare className="text-green-400" />
                  </div>

                  <h3
                    className={`mt-3 text-center text-sm font-semibold
                    ${dark ? "text-white" : "text-gray-900"}`}
                  >
                    {getStatusLabel(task.status)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* CONTENT */}
        {/* ========================= */}

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* EMPLOYEES */}
          <div className="lg:col-span-1">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className={`text-xl font-bold
                  ${dark ? "text-white" : "text-gray-900"}`}
                >
                  Assigned Employees
                </h2>

                <p
                  className={`text-sm mt-1
                  ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {assignedEmployees.length} members assigned
                </p>
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
                No Employees Assigned
              </div>
            ) : (
              <div className="space-y-3">
                {assignedEmployees.map((emp) => (
                  <div
                    key={emp._id}
                    className={`group rounded-2xl p-3 transition-all duration-300 border
                      ${
                        dark
                          ? "bg-[#1e293b] hover:bg-[#243041] border-white/5"
                          : "bg-white hover:bg-gray-50 border-gray-200"
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
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                          {emp.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}

                      {/* INFO */}
                      <div className="min-w-0">
                        <h3
                          className={`font-semibold truncate
                            ${dark ? "text-white" : "text-gray-900"}`}
                        >
                          {emp.name}
                        </h3>

                        <p
                          className={`text-xs mt-1
                            ${dark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {emp.position || "No Position"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* IMAGE */}
          <div className="lg:col-span-2">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2
                  className={`text-xl font-bold
                  ${dark ? "text-white" : "text-gray-900"}`}
                >
                  Reference Image
                </h2>

                <p
                  className={`text-sm mt-1
                  ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Attached task reference
                </p>
              </div>
            </div>

            {/* IMAGE BOX */}
            <div
              className={`rounded-3xl overflow-hidden border
              ${
                dark
                  ? "bg-[#1e293b] border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >
              {task.image ? (
                <img
                  src={`http://localhost:5000${task.image}`}
                  alt="Task"
                  className="w-full max-h-[500px] object-cover"
                />
              ) : (
                <div
                  className={`flex flex-col items-center justify-center py-24
                  ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  <FiCalendar className="text-5xl mb-4 text-cyan-400" />

                  <p>No image uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
