import { useSelector } from "react-redux";
import { STATUSES } from "../utils/helpers";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiTrendingUp,
} from "react-icons/fi";
import DashboardCard from "../components/ui/DashboardCard"

export default function Dashboard() {
  const employees = useSelector((s) => s.employees.list);
  const projects = useSelector((s) => s.projects.list);
  const tasks = useSelector((s) => s.tasks.list);

  const navigate = useNavigate();

  const normalize = (v) => v?.toLowerCase().replace(/\s+/g, "");

  const totalTasks = tasks.length;
  const inProgress = tasks.filter(
    (t) => normalize(t.status) === "inprogress"
  ).length;

  const statusCounts = {};
  STATUSES.forEach((s) => {
    statusCounts[s.key] = tasks.filter(
      (t) => normalize(t.status) === s.key
    ).length;
  });

  const recentTasks = [...tasks].slice(-10).reverse();

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

  const getBadge = (key) => {
    switch (key) {
      case "completed":
        return "border-green-500 text-green-400 bg-green-500/10";
      case "inprogress":
        return "border-yellow-500 text-yellow-400 bg-yellow-500/10";
      case "needtest":
        return "bg-purple-500/20 text-purple-400 border-purple-500";
      case "reopen":
        return "border-red-500 text-red-400 bg-red-500/10";
      default:
        return "border-gray-600 text-gray-300 bg-gray-500/10";
    }
  };

  const getLabel = (key) =>
    STATUSES.find((s) => s.key === key)?.label;

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen text-white">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400">
          Track your projects, team, and tasks in one place.
        </p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <DashboardCard title="Employees" value={employees.length} icon={<FiUsers />} color="bg-blue-500" onClick={() => navigate("/employees")} />
        <DashboardCard title="Projects" value={projects.length} icon={<FiFolder />} color="bg-yellow-500" onClick={() => navigate("/projects")} />
        <DashboardCard title="Tasks" value={totalTasks} icon={<FiCheckSquare />} color="bg-green-500" onClick={() => navigate("/tasks")} />
        <DashboardCard title="In Progress" value={inProgress} icon={<FiTrendingUp />} color="bg-purple-500" onClick={() => navigate("/taskboard")} />
      </div>

      {/* EMPTY STATE */}
      {tasks.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          No tasks available. Start by creating tasks.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* STATUS */}
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="font-semibold mb-5 text-lg">
              Task Status Overview
            </h2>

            {STATUSES.map((s) => {
              const count = statusCounts[s.key];
              const percent =
                totalTasks === 0
                  ? 0
                  : Math.round((count / totalTasks) * 100);

              return (
                <div key={s.key} className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{s.label}</span>
                    <span>{percent}%</span>
                  </div>

                  <div className="h-2 bg-gray-700 rounded">
                    <div
                      className={`h-2 rounded ${getColor(s.key)}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* RECENT TASKS */}
          <div className="bg-[#1e293b] p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col h-[350px] overflow-hidden">

            <h2 className="font-semibold mb-5 text-lg">
              Recent Tasks
            </h2>

            {/* Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center mb-3 p-3 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-gray-400">
                      {task.eta || "No ETA"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getBadge(
                      normalize(task.status)
                    )}`}
                  >
                    {getLabel(normalize(task.status))}
                  </span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate("/taskboard")}
              variant="secondary"
            >
              View Board
            </Button>
          </div>

        </div>
      )}
    </div>
  );
}
