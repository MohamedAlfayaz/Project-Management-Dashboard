import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { STATUSES } from "../utils/helpers";
import Button from "../components/ui/Button";
import { FaClock, FaFolderOpen } from "react-icons/fa";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tasks = useSelector((state) => state.tasks.list);
  const projects = useSelector((state) => state.projects.list);
  const employees = useSelector((state) => state.employees.list);

  const task = tasks.find((t) => t.id === id);

  if (!task)
    return <p className="text-white">Task not found</p>;

  const project = projects.find(
    (p) => p.id === task.projectId
  );

  const assignedEmployees = employees.filter((emp) =>
    task.employeeIds?.includes(emp.id)
  );

  const getStatusLabel = (key) =>
    STATUSES.find((s) => s.key === key)?.label || key;

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
    <div className="min-h-screen lg:h-screen flex flex-col bg-[#0f172a] text-gray-200">

      {/* CONTENT WRAPPER */}
      <div className="p-6 flex-1 flex flex-col overflow-hidden">

        {/* BACK BUTTON */}
        <div className="w-fit">
          <Button onClick={() => navigate("/tasks")}>
            ← Back to task
          </Button>
        </div>

        {/* HEADER */}
        <div className={`bg-[#1e293b] p-6 mt-4 rounded-2xl border-l-4 ${statusColor} shrink-0`}>
          <h1 className="text-3xl font-bold text-white">
            {task.title}
          </h1>

          <p className="text-gray-400 mt-2">
            {task.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-300">
            <span className="flex gap-2 items-center"><FaClock /> {project?.title}</span>
            <span className="flex gap-2 items-center"><FaFolderOpen /> {task.eta}</span>

            <span
              className={`px-3 py-1 text-xs rounded-full border ${status === "completed"
                ? "border-green-500 text-green-400 bg-green-500/10"
                : status === "inprogress"
                  ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                  : status === "needtest"
                    ? "border-purple-500 bg-purple-500/20 text-purple-400"
                    : status === "reopen"
                      ? "border-red-500 text-red-400 bg-red-500/10"
                      : "border-gray-600 text-gray-300 bg-gray-500/10"
                }`}
            >
              {getStatusLabel(task.status)}
            </span>
          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6 flex-1 overflow-hidden">

          {/* EMPLOYEES */}
          <div className="flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold mb-3 sticky top-0 bg-[#0f172a] z-10">
              Assigned Employees ({assignedEmployees.length})
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 custom-scroll space-y-3">
              {assignedEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 bg-[#1e293b] p-3 rounded-xl border border-gray-800"
                >
                  <img
                    src={emp.image}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-medium">{emp.name}</p>
                    <p className="text-xs text-gray-400">
                      {emp.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IMAGE */}
          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold mb-3 sticky top-0 bg-[#0f172a] z-10">
              Reference Image
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
              {task.image ? (
                <img
                  src={task.image}
                  className="w-full max-h-[320px] object-cover rounded-xl border border-gray-800"
                />
              ) : (
                <p className="text-gray-400">No image</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}