import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { STATUSES } from "../utils/helpers";
import Button from "../components/ui/Button";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const projects = useSelector((state) => state.projects.list);
  const tasks = useSelector((state) => state.tasks.list);
  const employees = useSelector((state) => state.employees.list);

  const project = projects.find((p) => p.id === id);

  if (!project) return <p className="text-white">Project not found</p>;

  const projectTasks = tasks.filter((t) => t.projectId === id);

  const assignedEmployees = employees.filter((emp) =>
    project.employees.includes(emp.id)
  );

  const completedTasks = projectTasks.filter(
    (t) => t.status?.toLowerCase().trim() === "completed"
  ).length;

  const progress =
    projectTasks.length === 0
      ? 0
      : Math.round((completedTasks / projectTasks.length) * 100);

  const getStatusLabel = (key) => {
    return STATUSES.find((s) => s.key === key)?.label || key;
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-[#0f172a] text-gray-200">

      {/* CONTENT WRAPPER */}
      <div className="p-6 flex-1 flex flex-col overflow-hidden">

        {/* BACK */}
        <div className="w-fit">
          <Button onClick={() => navigate("/projects")}>
            ← Back to Projects
          </Button>
        </div>

        {/* HEADER */}
        <div className="bg-gradient-to-br my-5 from-[#1e293b] to-[#0f172a] p-6 rounded-2xl border border-gray-800 shrink-0">
          <h1 className="text-3xl font-bold text-white">
            {project.title}
          </h1>

          <p className="text-gray-400 mt-2 max-w-xl">
            {project.description}
          </p>

          {/* META */}
          <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-400">
            <span>📅 {project.startDate}</span>
            <span>⏰ {project.endDate}</span>
            <span>👥 {assignedEmployees.length} members</span>
            <span>📊 {progress}% complete</span>
          </div>

          {/* PROGRESS BAR */}
          <div className="mt-4">
            <div className="h-2 bg-gray-700 rounded-full">
              <div
                className="h-2 bg-green-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-6 flex-1 overflow-hidden">

          {/* TEAM */}
          <div className="lg:col-span-1 flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold mb-3 sticky top-0 bg-[#0f172a] z-10">
              Team ({assignedEmployees.length})
            </h2>

            <div className="flex-1 overflow-y-auto pr-2 custom-scroll space-y-3">
              {assignedEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 bg-[#1e293b] p-3 rounded-xl border border-gray-800"
                >
                  {emp.image ? (
                    <img
                      src={emp.image}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                      {getInitials(emp.name)}
                    </div>
                  )}

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

          {/* TASKS */}
          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold mb-3 sticky top-0 bg-[#0f172a] z-10">
              Tasks ({projectTasks.length})
            </h2>

            {projectTasks.length === 0 ? (
              <p className="text-gray-400">No tasks added</p>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 custom-scroll">
                <div className="grid sm:grid-cols-2 gap-4">
                  {projectTasks.map((task) => {
                    const taskEmployees = employees.filter((emp) =>
                      task.employeeIds?.includes(emp.id)
                    );

                    const status = task.status?.toLowerCase().trim();

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
                        key={task.id}
                        className={`bg-[#1e293b] p-4 rounded-xl border-l-4 ${statusColor} hover:shadow-lg transition`}
                      >
                        {/* TITLE */}
                        <p className="font-semibold text-white">
                          {task.title}
                        </p>

                        {/* DESC */}
                        <p className="text-sm text-gray-400 mt-1">
                          {task.description}
                        </p>

                        {/* EMPLOYEES */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {taskEmployees.map((emp) => (
                            <span
                              key={emp.id}
                              className="text-xs bg-gray-700 px-2 py-1 rounded-full"
                            >
                              {emp.name}
                            </span>
                          ))}
                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-gray-400">
                            ETA: {task.eta}
                          </span>

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