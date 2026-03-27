import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProjectForm from "../components/forms/ProjectForm";
import Drawer from "../components/ui/Drawer";
import { deleteProject } from "../features/projects/projectSlice";
import Button from "../components/ui/Button";
import { FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import * as FaIcons from "react-icons/fa";

export default function Projects() {
  const projects = useSelector((state) => state.projects.list);
  const employees = useSelector((state) => state.employees.list);
  const tasks = useSelector((state) => state.tasks.list);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");

  const handleEdit = (project) => {
    setEditData(project);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete project?")) {
      dispatch(deleteProject(id));
    }
  };

  // 🔍 SEARCH
  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      `${p.title} ${p.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [projects, search]);

  return (
    <div className="p-6 min-h-screen  bg-[#0f172a] text-gray-200">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Projects</h2>
          <p className="text-sm text-gray-400">
            {projects.length} active projects
          </p>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          {/* SEARCH */}
          <div className="flex items-center px-3 py-2 rounded-lg  bg-[#0f172a] border border-gray-700 w-full lg:w-72">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search project..."
              className="bg-transparent outline-none text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
          >
            + Add Project
          </Button>
        </div>
      </div>

      {/* EMPTY */}
      {filteredProjects.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No projects found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const IconComponent =
              FaIcons[project.icon] || FaIcons.FaProjectDiagram;

            const assignedEmployees =
              employees?.filter((emp) =>
                project.employees?.includes(emp.id)
              ) || [];

            const projectTasks =
              tasks?.filter((t) => t.projectId === project.id) || [];

            const completedTasks = projectTasks.filter(
              (t) =>
                t.status?.toLowerCase().trim() === "completed"
            ).length;

            const totalTasks = projectTasks.length;

            const progress =
              totalTasks === 0
                ? 0
                : Math.round((completedTasks / totalTasks) * 100);

            return (
              <div
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-gray-800 p-5 rounded-2xl cursor-pointer 
                           hover:scale-[1.03] hover:shadow-2xl transition duration-300"
              >
                {/* TOP */}
                <div className="flex justify-between items-start">

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-xl">
                      <IconComponent />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {project.title}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {assignedEmployees.length} members
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div
                    className="flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      onClick={() => handleEdit(project)}
                      variant="secondary"
                    >
                      <FiEdit />
                    </Button>

                    <Button
                      onClick={() => handleDelete(project.id)}
                      variant="danger"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-400 mt-3 line-clamp-2">
                  {project.description}
                </p>

                {/* PROGRESS */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-green-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{completedTasks}/{totalTasks} tasks</span>
                    <span>{progress}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DRAWER */}
      <Drawer isOpen={open} onClose={() => setOpen(false)}>
        <ProjectForm
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