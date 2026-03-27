import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask } from "../features/tasks/taskSlice";
import { STATUSES } from "../utils/helpers";
import TaskForm from "../components/forms/TaskForm";
import Drawer from "../components/ui/Drawer";
import Button from "../components/ui/Button";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaClock } from "react-icons/fa";

export default function TaskBoard() {
  const tasks = useSelector((state) => state.tasks.list);
  const projects = useSelector((state) => state.projects.list);
  const employees = useSelector((state) => state.employees.list);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterProject, setFilterProject] = useState("");

  const handleEdit = (task) => {
    setEditData(task);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete task?")) {
      dispatch(deleteTask(id));
    }
  };

  // STATUS LABEL
  const getStatusLabel = (key) => {
    return STATUSES.find((s) => s.key === key)?.label || key;
  };

  // STATUS BADGE
  const getStatusColor = (key) => {
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

  // 🔥 STATUS BORDER (FIXED)
  const getStatusBorder = (key) => {
    switch (key) {
      case "completed":
        return "border-green-500";
      case "inprogress":
        return "border-yellow-500";
      case "needtest":
        return "border-purple-500";
      case "reopen":
        return "border-red-500";
      default:
        return "border-gray-600";
    }
  };

  // FILTER
  const filteredTasks = filterProject
    ? tasks.filter((t) => t.projectId === filterProject)
    : tasks;

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-gray-200">

      {/* HEADER */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Task Board
          </h1>
          <p className="text-sm text-gray-400">
            Manage and track tasks visually
          </p>
        </div>

        {/* FILTER */}
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="bg-[#1e293b] border border-gray-700 px-3 py-2 rounded-lg text-sm focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* BOARD */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="flex gap-6 h-full overflow-x-auto custom-scroll scroll-smooth">

          {STATUSES.map((status) => {
            const columnTasks = filteredTasks.filter(
              (t) =>
                t.status?.toLowerCase().replace(/\s+/g, "") ===
                status.key
            );

            return (
              <div
                key={status.key}
                className={`w-[320px] shrink-0 flex flex-col bg-[#1e293b] rounded-xl border-l-4 ${getStatusBorder(
                  status.key
                )}`}
              >
                {/* COLUMN HEADER */}
                <div className="flex justify-between rounded-2xl items-center p-4 sticky top-0 bg-[#1e293b] z-10">
                  <h2 className={`text-sm font-semibold rounded-2xl px-3 py-1 ${getStatusColor(status.key)}`}>
                    {status.label}
                  </h2>

                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>

                {/* TASK LIST */}
                <div className="p-4 space-y-2 overflow-y-auto flex-1 custom-scroll scroll-smooth">

                  {columnTasks.map((task) => {
                    const project = projects.find(
                      (p) => p.id === task.projectId
                    );

                    const assignedEmployees = employees.filter(
                      (emp) =>
                        task.employeeIds?.includes(emp.id)
                    );

                    return (
                      <div
                        key={task.id}
                        className={`bg-[#0f172a] p-4 rounded-xl border-t-4 ${getStatusBorder(task.status)} `}
                      >
                        {/* TOP */}
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-semibold group-hover:text-blue-400 transition">
                              {task.title}
                            </h3>
                            <p className="text-xs text-gray-400">
                              {project?.title}
                            </p>
                          </div>

                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {getStatusLabel(task.status)}
                          </span>
                        </div>

                        {/* DESC */}
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                          {task.description}
                        </p>

                        {/* AVATAR + ETA */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex -space-x-2">
                            {assignedEmployees.map((emp) => (
                              <img
                                key={emp.id}
                                src={emp.image}
                                className="w-8 h-8 rounded-full border-2 border-[#0f172a]"
                              />
                            ))}
                          </div>

                          <span className="flex gap-2 items-center text-xs text-gray-400">
                            <FaClock /> {task.eta}
                          </span>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-2 mt-3 justify-between items-center">
                          <Button
                            onClick={() => handleEdit(task)}
                            variant="secondary"
                          >
                            <FiEdit size={14} />
                          </Button>

                          <Button
                            onClick={() =>
                              handleDelete(task.id)
                            }
                            variant="danger"
                          >
                            <FiTrash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}

                  {columnTasks.length === 0 && (
                    <div className="text-center text-xs text-gray-500 py-10">
                      No tasks
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DRAWER */}
      <Drawer isOpen={open} onClose={() => setOpen(false)}>
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