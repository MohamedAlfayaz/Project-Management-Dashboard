import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import Drawer from "../components/ui/Drawer";
import EmployeeForm from "../components/forms/EmployeeForm";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";

import {
  FiEdit,
  FiTrash2,
  FiUserPlus,
  FiFolder,
  FiCheckSquare,
  FiSearch,
  FiMail,
} from "react-icons/fi";

import { useEmployees, useDeleteEmployee } from "../hooks/useEmployees";

import { useProjects } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";

export default function Employees() {
  const navigate = useNavigate();

  // ==========================
  // THEME
  // ==========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // ==========================
  // API
  // ==========================

  const { data: employees = [], isLoading, error } = useEmployees();

  const { data: projects = [] } = useProjects();

  const { data: tasks = [] } = useTasks();

  const deleteMutation = useDeleteEmployee();

  // ==========================
  // STATES
  // ==========================

  const [open, setOpen] = useState(false);

  const [editData, setEditData] = useState(null);

  const [search, setSearch] = useState("");

  // ==========================
  // EDIT
  // ==========================

  const handleEdit = (emp) => {
    setEditData(emp);

    setOpen(true);
  };

  // ==========================
  // DELETE
  // ==========================

  const handleDelete = async (id) => {
    if (window.confirm("Delete employee?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error(error);

        alert(error?.response?.data?.message || "Delete failed");
      }
    }
  };

  // ==========================
  // FILTER
  // ==========================

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      `${emp.name} ${emp.email} ${emp.position}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [employees, search]);

  // ==========================
  // INITIALS
  // ==========================

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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
    return <div className="p-6 text-red-400">Failed to load employees</div>;
  }

  return (
    <div
      className={`p-6 min-h-screen transition-all duration-300
      ${dark ? "bg-[#0f172a] text-gray-200" : "bg-gray-100 text-gray-800"}`}
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
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* LEFT */}
          <div className="flex flex-col gap-4">
            {/* TITLE */}
            <div>
              <h2
                className={`text-3xl sm:text-4xl font-black tracking-tight
          ${dark ? "text-white" : "text-gray-900"}`}
              >
                Employee Management
              </h2>

              <p
                className={`mt-2 text-sm sm:text-base
          ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Manage your employees, assign responsibilities and monitor team
                activity.
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
                  Total Employees
                </p>

                <h3
                  className={`text-2xl font-bold mt-1
            ${dark ? "text-white" : "text-gray-900"}`}
                >
                  {employees.length}
                </h3>
              </div>

              {/* ACTIVE */}
              <div
                className={`w-40 text-center rounded-2xl px-4 py-3 border transition-all
          ${
            dark
              ? "bg-green-500/10 border-green-500/20"
              : "bg-green-50 border-green-200"
          }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide
            ${dark ? "text-green-300" : "text-green-600"}`}
                >
                  Active
                </p>

                <h3
                  className={`text-2xl font-bold mt-1
            ${dark ? "text-green-400" : "text-green-700"}`}
                >
                  {employees.length}
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
                placeholder="Search employee..."
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
              <FiUserPlus className="text-lg" />
              Add Employee
            </Button>
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {filteredEmployees.length === 0 ? (
        <div
          className={`text-center mt-20
          ${dark ? "text-gray-500" : "text-gray-400"}`}
        >
          No employees found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => {
            const projectCount = projects.filter((p) =>
              p.employees?.some(
                (employeeId) => String(employeeId) === String(emp._id),
              ),
            ).length;

            const employeeTasks = tasks.filter((task) => {
              if (!Array.isArray(task.employeeIds)) {
                return false;
              }

              return task.employeeIds.some(
                (employee) =>
                  String(employee._id || employee) === String(emp._id),
              );
            });

            const taskCount = employeeTasks.length;

            const completedTasks = employeeTasks.filter(
              (task) => task.status?.toLowerCase() === "completed",
            ).length;

            const progress =
              taskCount > 0
                ? Math.round((completedTasks / taskCount) * 100)
                : 0;

            return (
              <div
                key={emp._id}
                onClick={() => navigate(`/employees/${emp._id}`)}
                className={`cursor-pointer border p-5 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300
                  ${
                    dark
                      ? "bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-gray-800"
                      : "bg-white border-gray-200"
                  }`}
              >
                {/* TOP */}
                <div className="flex items-center gap-4 mb-4">
                  {emp.image ? (
                    <img
                      src={`http://localhost:5000${emp.image}`}
                      alt={emp.name}
                      className={`w-14 h-14 rounded-full object-cover border-2
                        ${dark ? "border-gray-700" : "border-gray-300"}`}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {getInitials(emp.name)}
                    </div>
                  )}

                  <div>
                    <h3
                      className={`font-semibold  text-md sm:text-lg
                        ${dark ? "text-white" : "text-gray-900"}`}
                    >
                      {emp.name}
                    </h3>

                    <p
                      className={`text-sm
                        ${dark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {emp.position}
                    </p>
                  </div>
                </div>

                {/* EMAIL */}
                <p
                  className={`flex items-center gap-2 text-sm mb-4 truncate
                    ${dark ? "text-gray-500" : "text-gray-500"}`}
                >
                  <FiMail />

                  {emp.email}
                </p>

                {/* STATS */}
                <div className="flex items-center justify-between gap-4 mt-5">
                  {/* STATS */}
                  <div className="flex items-center gap-2 min-w-0">
                    {/* PROJECT */}
                    <span className="flex items-center gap-1.5 bg-blue-500/15 text-blue-400 border border-blue-500/20 px-3 py-1.5 text-xs font-medium rounded-full">
                      <FiFolder className="text-sm shrink-0" />
                      <span>{projectCount}</span>
                    </span>

                    {/* TASK */}
                    <span className="flex items-center gap-1.5 bg-green-500/15 text-green-400 border border-green-500/20 px-3 py-1.5 text-xs font-medium rounded-full">
                      <FiCheckSquare className="text-sm shrink-0" />
                      <span>
                        {completedTasks}/{taskCount}
                      </span>
                    </span>
                  </div>

                  {/* ACTIONS */}
                  <div
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* EDIT */}
                    <Button
                      onClick={() => handleEdit(emp)}
                      variant="secondary" 
                    >
                      <FiEdit />
                    </Button>

                    {/* DELETE */}
                    <Button
                      onClick={() => handleDelete(emp._id)}
                      variant="danger"
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="mt-3">
                  <div
                    className={`flex justify-between text-xs mb-1
                      ${dark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <span>Task Progress</span>

                    <span>{progress}%</span>
                  </div>

                  <div
                    className={`h-2 rounded-full overflow-hidden
                      ${dark ? "bg-gray-700" : "bg-gray-200"}`}
                  >
                    <div
                      className="h-2 bg-green-400 transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
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
        <EmployeeForm
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
