import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import TaskForm from "../components/forms/TaskForm";
import Drawer from "../components/ui/Drawer";
import { STATUSES } from "../utils/helpers";
import { deleteTask } from "../features/tasks/taskSlice";
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { FaClock } from "react-icons/fa"
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function Tasks() {
  const tasks = useSelector((state) => state.tasks.list);
  const projects = useSelector((state) => state.projects.list);
  const employees = useSelector((state) => state.employees.list);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterProject, setFilterProject] = useState("");
  const [search, setSearch] = useState("");

  const handleEdit = (task) => {
    setEditData(task);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete task?")) {
      dispatch(deleteTask(id));
    }
  };

  // 🔍 FILTER + SEARCH
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchProject = filterProject
        ? t.projectId === filterProject
        : true;

      const matchSearch = `${t.title} ${t.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchProject && matchSearch;
    });
  }, [tasks, filterProject, search]);

  // 📊 STATS
  const completed = tasks.filter(
    (t) => t.status?.toLowerCase() === "completed"
  ).length;

  const pending = tasks.length - completed;

  const getStatusLabel = (key) =>
    STATUSES.find((s) => s.key === key)?.label || key;

  return (
    <div className="p-6  bg-[#0f172a] min-h-screen text-gray-200">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-3">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Tasks
          </h2>

          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span>Total: {tasks.length}</span>
            <span>Completed: {completed}</span>
            <span>Pending: {pending}</span>
          </div>
        </div>
        <div>
          <Button
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
          >
            <FiPlus /> Add Task
          </Button>
        </div>
      </div>
      {/* FILTER BAR */}
      <div className="flex flex-col lg:flex-row gap-3 mb-6">
        {/* SEARCH */}
        <div className="flex items-center bg-[#0f172a] px-3 py-2 rounded-lg border border-gray-700 w-full lg:w-72">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent outline-none text-sm w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* PROJECT FILTER */}
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="bg-[#0f172a] border border-gray-700 rounded-lg px-3 py-2"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* EMPTY */}
      {filteredTasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No tasks found
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTasks.map((task) => {
            const project = projects.find(
              (p) => p.id === task.projectId
            );

            const assignedEmployees = employees.filter((emp) =>
              task.employeeIds?.includes(emp.id)
            );

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
                key={task.id}
                onClick={() => navigate(`/tasks/${task.id}`)}
                className={`cursor-pointer bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-l-4 ${statusColor} p-5 rounded-2xl hover:shadow-2xl transition`}
              >
                {/* TOP */}
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-white">
                      {task.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {project?.title}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-2.5 text-xs rounded-full border ${status === "completed"
                        ? "border-green-500 text-green-400 bg-green-500/10"
                        : status === "inprogress"
                          ? "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                          : status === "needtest"
                            ? "bg-purple-500/20 text-purple-400 border-purple-500"
                            : status === "reopen"
                              ? "border-red-500 text-red-400 bg-red-500/10"
                              : "border-gray-600 text-gray-300 bg-gray-500/10"
                      }`}
                  >
                    {getStatusLabel(task.status)}
                  </span>
                </div>

                {/* DESC */}
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                  {task.description}
                </p>

                {/* EMPLOYEES */}
                <div className="mt-4 space-y-2">
                  {assignedEmployees.slice(0, 3).map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={emp.image}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-300">
                        {emp.name}
                      </span>
                    </div>
                  ))}

                  {assignedEmployees.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{assignedEmployees.length - 3} more
                    </span>
                  )}
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center mt-4">
                  <span className="flex gap-2 items-center text-sm text-gray-400">
                    <FaClock /> {task.eta}
                  </span>

                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(task);
                      }}
                      variant="secondary"
                    >
                      <FiEdit size={14} />
                    </Button>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.id);
                      }}
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
      <Drawer isOpen={open} onClose={() => setOpen(false)}>
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