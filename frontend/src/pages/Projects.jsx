import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import ProjectForm from "../components/forms/ProjectForm";
import Drawer from "../components/ui/Drawer";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";

import {
  FiEdit,
  FiTrash2,
  FiSearch,
  FiFolder,
  FiCheckSquare,
  FiUsers,
  FiPlus,
} from "react-icons/fi";

import * as FaIcons from "react-icons/fa";

// ✅ PROJECT API
import { useProjects, useDeleteProject } from "../hooks/useProjects";

// ✅ EMPLOYEE API
import { useEmployees } from "../hooks/useEmployees";

// ✅ TASK API
import { useTasks } from "../hooks/useTasks";

export default function Projects() {
  // ==========================
  // THEME
  // ==========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // ==========================
  // PROJECT API
  // ==========================

  const { data: projects = [], isLoading, error } = useProjects();

  // ==========================
  // EMPLOYEE API
  // ==========================

  const { data: employees = [] } = useEmployees();

  // ==========================
  // TASK API
  // ==========================

  const { data: tasks = [] } = useTasks();

  // ==========================
  // DELETE MUTATION
  // ==========================

  const deleteMutation = useDeleteProject();

  const navigate = useNavigate();

  // ==========================
  // STATE
  // ==========================

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState(null);

  const [search, setSearch] = useState("");

  // ==========================
  // EDIT
  // ==========================

  const handleEdit = (project) => {
    setEditData(project);

    setOpen(true);
  };

  // ==========================
  // DELETE
  // ==========================

  const handleDelete = async (id) => {
    if (window.confirm("Delete project?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error(error);

        alert(error?.response?.data?.message || "Delete failed");
      }
    }
  };

  // ==========================
  // SEARCH
  // ==========================

  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      `${p.title} ${p.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [projects, search]);

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
        className={`p-6
        ${dark ? "text-red-400" : "text-red-500"}`}
      >
        Failed to load projects
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen transition-all duration-300
      ${dark ? "bg-[#020617] text-gray-200" : "bg-gray-100 text-gray-800"}`}
    >
      {/* HEADER */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-7 mb-6 transition-all duration-300
      ${
        dark
          ? `
            bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]
            border-slate-800
            shadow-2xl shadow-black/20
          `
          : `
            bg-white
            border-gray-200
            shadow-sm
          `
      }`}
      >
        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* LEFT */}
          <div className="flex flex-col gap-4">
            {/* TITLE */}
            <div>
              <h2
                className={`text-3xl sm:text-4xl font-black tracking-tight
          ${dark ? "text-white" : "text-gray-900"}`}
              >
                Project Management
              </h2>

              <p
                className={`mt-2 text-sm sm:text-base
          ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Track ongoing projects, deadlines and team progress efficiently.
              </p>
            </div>

            {/* STATS */}
            <div className="flex gap-2">
              {/* TOTAL */}
              <div
                className={`w-40 text-center rounded-2xl px-4 py-3 border transition-all
          ${
            dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
          }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide
            ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Total Projects
                </p>

                <h3
                  className={`text-2xl font-bold mt-1
            ${dark ? "text-white" : "text-gray-900"}`}
                >
                  {projects.length}
                </h3>
              </div>

              {/* ACTIVE */}
              <div
                className={`w-40 text-center rounded-2xl px-4 py-3 border transition-all
          ${
            dark
              ? "bg-cyan-500/10 border-cyan-500/20"
              : "bg-cyan-50 border-cyan-200"
          }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide
            ${dark ? "text-cyan-300" : "text-cyan-600"}`}
                >
                  Active
                </p>

                <h3
                  className={`text-2xl font-bold mt-1
            ${dark ? "text-cyan-400" : "text-cyan-700"}`}
                >
                  {projects.length}
                </h3>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            {/* SEARCH */}
            <div
              className={`flex items-center gap-3 px-4 h-14 rounded-2xl border w-full sm:w-[320px] transition-all duration-300
        ${
          dark
            ? `
              bg-[#0b1220]
              border-slate-700
              focus-within:border-cyan-500/50
              focus-within:ring-4
              focus-within:ring-cyan-500/10
            `
            : `
              bg-white
              border-gray-300
              focus-within:border-cyan-500
              focus-within:ring-4
              focus-within:ring-cyan-100
            `
        }`}
            >
              <FiSearch
                className={`text-lg shrink-0
          ${dark ? "text-gray-400" : "text-gray-500"}`}
              />

              <input
                type="text"
                placeholder="Search project..."
                className={`bg-transparent outline-none text-sm w-full
          ${
            dark
              ? "text-white placeholder:text-gray-500"
              : "text-gray-900 placeholder:text-gray-400"
          }`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* ADD BUTTON */}
            <Button
              onClick={() => {
                setEditData(null);
                setOpen(true);
              }}
              variant="header"
            >
              <FiPlus className="text-lg" />
              Add Project
            </Button>
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {filteredProjects.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center mt-24 text-center
          ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-5
            ${dark ? "bg-white/5" : "bg-white"}`}
          >
            <FiFolder className="text-5xl text-cyan-400" />
          </div>

          <h3 className="text-xl font-bold">No Projects Found</h3>

          <p className="mt-2 text-sm">Create a project to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            // ==========================
            // ICON
            // ==========================

            const IconComponent =
              FaIcons[project.icon] || FaIcons.FaProjectDiagram;

            // ==========================
            // MEMBERS
            // ==========================

            const assignedEmployees =
              employees?.filter((emp) =>
                project.employees?.some(
                  (id) => id.toString() === emp._id.toString(),
                ),
              ) || [];

            // ==========================
            // TASKS
            // ==========================

            const projectTasks = tasks.filter(
              (task) =>
                String(task.projectId?._id || task.projectId) ===
                String(project._id),
            );

            const totalTasks = projectTasks.length;

            const completedTasks = projectTasks.filter(
              (task) => task.status?.toLowerCase() === "completed",
            ).length;

            // ==========================
            // PROGRESS
            // ==========================

            const progress =
              totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;

            return (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className={`group relative overflow-hidden rounded-3xl border p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                  ${
                    dark
                      ? "bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-gray-800"
                      : "bg-white border-gray-200"
                  }`}
              >
                {/* GLOW */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition
                    ${dark ? "bg-white/5" : "bg-gray-100"}`}
                />

                <div className="relative z-10">
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-4">
                    {/* LEFT */}
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* ICON */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-2xl shadow-xl shrink-0">
                        <IconComponent />
                      </div>

                      {/* TITLE */}
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <h3
                          className={`font-bold text-lg leading-snug break-words line-clamp-2 transition
                        ${
                          dark
                            ? "text-white group-hover:text-cyan-400"
                            : "text-gray-900 group-hover:text-cyan-600"
                        }`}
                        >
                          {project.title}
                        </h3>

                        {/* MEMBERS */}
                        <div className="flex items-center gap-2 mt-2">
                          <FiUsers className="text-cyan-400 text-sm shrink-0" />

                          <p
                            className={`text-xs truncate
          ${dark ? "text-gray-400" : "text-gray-500"}`}
                          >
                            {assignedEmployees.length} Members
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div
                      className="flex items-center gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* EDIT */}
                      <Button
                        onClick={() => handleEdit(project)}
                        variant="secondary"
                        className="w-10 h-10 rounded-xl"
                      >
                        <FiEdit />
                      </Button>

                      {/* DELETE */}
                      <Button
                        onClick={() => handleDelete(project._id)}
                        variant="danger"
                        className="w-10 h-10 rounded-xl"
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p
                    className={`text-sm my-3 line-clamp-2 min-h-[40px]
                      ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {project.description || "No description"}
                  </p>

                  {/* TASK INFO */}
                  <div className="flex justify-between items-center gap-2">
                    {/* TOTAL */}
                    <div
                      className={`flex items-center justify-center gap-2 rounded-2xl px-2 py-2
                        ${dark ? "bg-white/5" : "bg-gray-100"}`}
                    >
                      <div className="flex items-center gap-2">
                        <FiCheckSquare className="text-cyan-400" />

                        <p
                          className={`text-xs
                            ${dark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          Total Tasks
                        </p>
                      </div>

                      <h4
                        className={`px-2 text-lg font-bold items-center
                          ${dark ? "text-white" : "text-gray-900"}`}
                      >
                        {totalTasks}
                      </h4>
                    </div>

                    {/* COMPLETED */}
                    <div
                      className={`flex items-center justify-center gap-2 rounded-2xl px-2 py-2
                        ${dark ? "bg-green-500/10" : "bg-green-100"}`}
                    >
                      <p className="text-xs text-green-400">Completed</p>

                      <h4 className="px-2 text-lg font-bold text-green-400">
                        {completedTasks}/{totalTasks}
                      </h4>
                    </div>
                  </div>

                  {/* PROGRESS */}
                  <div className="mt-5">
                    <div className="flex justify-between items-center mb-2">
                      <p
                        className={`text-xs uppercase tracking-wider
                          ${dark ? "text-gray-500" : "text-gray-500"}`}
                      >
                        Progress
                      </p>

                      <p className="text-sm font-semibold text-cyan-400">
                        {progress}%
                      </p>
                    </div>

                    <div
                      className={`h-3 rounded-full overflow-hidden
                        ${dark ? "bg-white/10" : "bg-gray-200"}`}
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
              </div>
            );
          })}
        </div>
      )}

      {/* DRAWER */}
      <Drawer
        isOpen={open}
        onClose={() => {
          setOpen(false);

          setEditData(null);
        }}
      >
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
