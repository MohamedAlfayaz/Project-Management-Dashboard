import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { STATUSES } from "../utils/helpers";

import Button from "../components/ui/Button";
import DashboardCard from "../components/ui/DashboardCard";
import Loading from "../components/ui/Loading";

import {
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiTrendingUp,
  FiArrowRight,
  FiCalendar,
  FiSmile,
  FiClipboard,
  FiActivity,
} from "react-icons/fi";

// ✅ EMPLOYEE API
import { useEmployees } from "../hooks/useEmployees";

// ✅ PROJECT API
import { useProjects } from "../hooks/useProjects";

// ✅ TASK API
import { useTasks } from "../hooks/useTasks";

export default function Dashboard() {
  // =========================
  // THEME
  // =========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // =========================
  // EMPLOYEES API
  // =========================

  const { data: employees = [], isLoading: employeesLoading } = useEmployees();

  // =========================
  // PROJECTS API
  // =========================

  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  // =========================
  // TASKS API
  // =========================

  const { data: tasks = [], isLoading: tasksLoading } = useTasks();

  const navigate = useNavigate();

  // =========================
  // LOADING
  // =========================

  if (employeesLoading || projectsLoading || tasksLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  // =========================
  // NORMALIZE
  // =========================

  const normalize = (v) => v?.toLowerCase()?.replace(/\s+/g, "");

  // =========================
  // COUNTS
  // =========================

  const totalTasks = tasks.length;

  const inProgress = tasks.filter(
    (t) => normalize(t.status) === "inprogress",
  ).length;

  const completedTasks = tasks.filter(
    (t) => normalize(t.status) === "completed",
  ).length;

  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // =========================
  // STATUS COUNTS
  // =========================

  const statusCounts = {};

  STATUSES.forEach((s) => {
    statusCounts[s.key] = tasks.filter(
      (t) => normalize(t.status) === s.key,
    ).length;
  });

  // =========================
  // RECENT TASKS
  // =========================

  const recentTasks = [...tasks].reverse().slice(0, 6);

  // =========================
  // RECENT PROJECTS
  // =========================

  const recentProjects = [...projects].reverse().slice(0, 4);

  // =========================
  // COLORS
  // =========================

  const getColor = (key) => {
    switch (key) {
      case "completed":
        return "bg-green-500";

      case "inprogress":
        return "bg-yellow-500";

      case "needtest":
        return "bg-purple-500";

      case "reopen":
        return "bg-red-500";

      default:
        return "bg-blue-500";
    }
  };

  // =========================
  // BADGE
  // =========================

  const getBadge = (key) => {
    switch (key) {
      case "completed":
        return dark
          ? "border-green-500 text-green-400 bg-green-500/10"
          : "border-green-200 text-green-700 bg-green-50";

      case "inprogress":
        return dark
          ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
          : "border-yellow-200 text-yellow-700 bg-yellow-50";

      case "needtest":
        return dark
          ? "border-purple-500 text-purple-400 bg-purple-500/10"
          : "border-purple-200 text-purple-700 bg-purple-50";

      case "reopen":
        return dark
          ? "border-red-500 text-red-400 bg-red-500/10"
          : "border-red-200 text-red-700 bg-red-50";

      default:
        return dark
          ? "border-gray-600 text-gray-300 bg-gray-500/10"
          : "border-gray-300 text-gray-600 bg-gray-100";
    }
  };

  // =========================
  // LABEL
  // =========================

  const getLabel = (key) => STATUSES.find((s) => s.key === key)?.label;

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 transition-all duration-300
      ${dark ? "bg-[#020617] text-white" : "bg-gray-100 text-gray-900"}`}
    >
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div
        className={`relative overflow-hidden rounded-3xl shadow-2xl p-6 sm:p-8 mb-4 border transition-all duration-300
        ${
          dark
            ? "bg-gradient-to-br from-[#172554] via-[#0f172a] to-[#020617] border-white/10"
            : "bg-gradient-to-br from-blue-100 via-white to-gray-100 border-gray-200"
        }`}
      >
        {/* GLOW */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          {/* LEFT */}
          <div>
            <p className="text-cyan-400 font-medium mb-3 flex items-center gap-2">
              Welcome Back
              <FiSmile className="text-lg" />
            </p>

            <h1
              className={`text-4xl sm:text-5xl font-bold tracking-wide
              ${dark ? "text-white" : "text-gray-900"}`}
            >
              Project Dashboard
            </h1>

            <p
              className={`mt-4 max-w-2xl text-sm sm:text-base leading-relaxed
              ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              Track employees, projects, and tasks with real-time analytics and
              productivity monitoring.
            </p>
          </div>

          {/* RIGHT */}
          <div className="w-full xl:w-[420px]">
            {/* TOP */}
            <div className="flex items-center justify-between mb-2">
              <p
                className={`text-sm font-medium
                ${dark ? "text-gray-300" : "text-gray-700"}`}
              >
                Overall Task Progress
              </p>

              <p className="text-lg text-cyan-400 font-bold">{progress}%</p>
            </div>

            {/* BAR */}
            <div
              className={`h-5 rounded-full overflow-hidden border
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
            <div className="flex items-center justify-between mt-3">
              <p
                className={`text-xs
                ${dark ? "text-gray-500" : "text-gray-500"}`}
              >
                {completedTasks}/{totalTasks} Tasks Completed
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
      </div>

      {/* ========================= */}
      {/* TOP CARDS */}
      {/* ========================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <DashboardCard
          title="Employees"
          value={employees.length}
          icon={<FiUsers />}
          color="bg-cyan-500"
          onClick={() => navigate("/employees")}
        />

        <DashboardCard
          title="Projects"
          value={projects.length}
          icon={<FiFolder />}
          color="bg-yellow-500"
          onClick={() => navigate("/projects")}
        />

        <DashboardCard
          title="Tasks"
          value={totalTasks}
          icon={<FiCheckSquare />}
          color="bg-green-500"
          onClick={() => navigate("/tasks")}
        />

        <DashboardCard
          title="In Progress"
          value={inProgress}
          icon={<FiTrendingUp />}
          color="bg-purple-500"
          onClick={() => navigate("/taskboard")}
        />
      </div>

      {/* ========================= */}
      {/* MAIN GRID */}
      {/* ========================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* STATUS OVERVIEW */}
        <div
          className={`rounded-3xl p-5 shadow-xl border transition-all duration-300
          ${
            dark
              ? "bg-gradient-to-br from-[#111827] to-[#0f172a] border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2
                className={`text-2xl font-bold
                ${dark ? "text-white" : "text-gray-900"}`}
              >
                Task Status
              </h2>

              <p
                className={`text-sm mt-1
                ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Real-time task analytics
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
              <FiActivity className="text-cyan-400 text-xl" />
            </div>
          </div>

          {/* STATUS LIST */}
          <div className="space-y-3">
            {STATUSES.map((s) => {
              const count = statusCounts[s.key];

              const percent =
                totalTasks === 0 ? 0 : Math.round((count / totalTasks) * 100);

              return (
                <div key={s.key}>
                  {/* LABEL */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getColor(s.key)}`}
                      />

                      <span
                        className={`font-medium
                          ${dark ? "text-white" : "text-gray-800"}`}
                      >
                        {s.label}
                      </span>
                    </div>

                    <span
                      className={`text-sm
                        ${dark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {count} Tasks
                    </span>
                  </div>

                  {/* BAR */}
                  <div
                    className={`h-3 rounded-full overflow-hidden
                      ${dark ? "bg-white/10" : "bg-gray-200"}`}
                  >
                    <div
                      className={`h-full rounded-full ${getColor(s.key)}`}
                      style={{
                        width: `${percent}%`,
                      }}
                    />
                  </div>

                  {/* PERCENT */}
                  <div
                    className={`text-right mt-1 text-xs
                      ${dark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    {percent}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT TASKS */}
        <div
          className={`rounded-3xl p-5 shadow-xl border transition-all duration-300
          ${
            dark
              ? "bg-gradient-to-br from-[#111827] to-[#0f172a] border-white/10"
              : "bg-white border-gray-200"
          }`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className={`text-2xl font-bold
                ${dark ? "text-white" : "text-gray-900"}`}
              >
                Recent Tasks
              </h2>

              <p
                className={`text-sm mt-1
                ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Latest team activity
              </p>
            </div>

            <Button onClick={() => navigate("/taskboard")} variant="secondary">
              View Board
            </Button>
          </div>

          {/* EMPTY */}
          {recentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[350px] text-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-4
                ${dark ? "bg-white/5" : "bg-gray-100"}`}
              >
                <FiClipboard
                  className={`text-4xl
                  ${dark ? "text-white/80" : "text-gray-500"}`}
                />
              </div>

              <h3
                className={`text-lg font-semibold
                ${dark ? "text-white" : "text-gray-900"}`}
              >
                No Tasks Found
              </h3>

              <p
                className={`mt-2 text-sm
                ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Create tasks to see recent activity
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scroll pr-2">
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => navigate(`/tasks/${task._id}`)}
                  className={`group cursor-pointer rounded-3xl p-5 transition-all duration-300 border
                    ${
                      dark
                        ? "bg-white/5 hover:bg-white/10 border-white/10"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                    }`}
                >
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3
                        className={`text-lg font-semibold transition truncate
                          ${
                            dark
                              ? "text-white group-hover:text-cyan-400"
                              : "text-gray-900 group-hover:text-cyan-600"
                          }`}
                      >
                        {task.title}
                      </h3>

                      <p
                        className={`text-sm mt-3 line-clamp-2
                          ${dark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {task.description || "No description"}
                      </p>
                    </div>

                    {/* STATUS */}
                    <div
                      className={`px-3 py-1 rounded-full text-xs border whitespace-nowrap ${getBadge(
                        normalize(task.status),
                      )}`}
                    >
                      {getLabel(normalize(task.status))}
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between mt-5">
                    <div>
                      <p
                        className={`text-xs uppercase tracking-wider
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

                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition
                        ${
                          dark
                            ? "bg-white/10 group-hover:bg-cyan-500/20"
                            : "bg-gray-200 group-hover:bg-cyan-100"
                        }`}
                    >
                      <FiArrowRight />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RECENT PROJECTS */}
      <div
        className={`mt-4 rounded-3xl p-5 shadow-xl border transition-all duration-300
  ${
    dark
      ? "bg-gradient-to-br from-[#111827] to-[#0f172a] border-white/10"
      : "bg-white border-gray-200"
  }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2
              className={`text-2xl font-bold
        ${dark ? "text-white" : "text-gray-900"}`}
            >
              Recent Projects
            </h2>

            <p
              className={`text-sm mt-1
        ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Latest created projects
            </p>
          </div>

          <Button onClick={() => navigate("/projects")} variant="secondary">
            View Projects
          </Button>
        </div>

        {/* EMPTY */}
        {recentProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-4
        ${dark ? "bg-white/5" : "bg-gray-100"}`}
            >
              <FiFolder
                className={`text-4xl
          ${dark ? "text-white/80" : "text-gray-500"}`}
              />
            </div>

            <h3
              className={`text-lg font-semibold
        ${dark ? "text-white" : "text-gray-900"}`}
            >
              No Projects Found
            </h3>

            <p
              className={`mt-2 text-sm
        ${dark ? "text-gray-400" : "text-gray-500"}`}
            >
              Create projects to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {recentProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className={`group cursor-pointer rounded-3xl p-5 transition-all duration-300 hover:scale-[1.02] border
            ${
              dark
                ? "bg-white/5 hover:bg-white/10 border-white/10"
                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
            }`}
              >
                {/* TITLE */}
                <h3
                  className={`text-xl font-bold transition truncate
              ${
                dark
                  ? "text-white group-hover:text-cyan-400"
                  : "text-gray-900 group-hover:text-cyan-600"
              }`}
                >
                  {project.title}
                </h3>

                {/* DESCRIPTION */}
                <p
                  className={`text-sm mt-4 line-clamp-3
                  ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {project.description || "No description"}
                </p>

                {/* FOOTER */}
                <div className="flex items-center justify-between">
                  <p
                    className={`flex items-center gap-1 text-xs
                ${dark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    <FiCalendar className="text-sm" />

                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : "No Date"}
                  </p>

                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition
                ${
                  dark
                    ? "bg-white/10 group-hover:bg-cyan-500/20"
                    : "bg-gray-200 group-hover:bg-cyan-100"
                }`}
                  >
                    <FiArrowRight />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
