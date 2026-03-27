import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import Drawer from "../components/ui/Drawer";
import EmployeeForm from "../components/forms/EmployeeForm";
import { deleteEmployee } from "../features/employees/employeeSlice";
import {
  FiEdit,
  FiTrash2,
  FiUserPlus,
  FiFolder,
  FiCheckSquare,
  FiSearch,
  FiMail
} from "react-icons/fi";
import Button from "../components/ui/Button";

export default function Employees() {
  const projects = useSelector((state) => state.projects.list);
  const tasks = useSelector((state) => state.tasks.list);
  const employees = useSelector((state) => state.employees.list);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [search, setSearch] = useState("");

  const handleEdit = (emp) => {
    setEditData(emp);
    setOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete employee?")) {
      dispatch(deleteEmployee(id));
    }
  };

  // 🔍 SEARCH FILTER (optimized)
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) =>
      `${emp.name} ${emp.email} ${emp.position}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [employees, search]);

  // 👤 fallback initials
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="p-6 min-h-screen bg-[#0f172a] text-gray-200 ">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Employees</h2>
          <p className="text-gray-400 text-sm">
            Manage your team members
          </p>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          {/* SEARCH */}
          <div className="flex items-center px-3 py-2 rounded-lg bg-[#0f172a] border border-gray-700 w-full lg:w-72">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search employee..."
              className="bg-transparent outline-none text-sm w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* ADD */}
          <Button
            onClick={() => {
              setEditData(null);
              setOpen(true);
            }}
          >
            <FiUserPlus />
            Add Employees
          </Button>
        </div>
      </div>

      {/* EMPTY */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          No employees found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => {
            const projectCount = projects.filter((p) =>
              p.employees?.includes(emp.id)
            ).length;

            const taskCount = tasks.filter((t) =>
              t.employeeIds?.includes(emp.id)
            ).length;

            return (
              <div
                key={emp.id}
                className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-gray-800 p-5 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition duration-300"
              >
                {/* TOP */}
                <div className="flex items-center gap-4 mb-4">
                  {emp.image ? (
                    <img
                      src={emp.image}
                      alt={emp.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-700"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      {getInitials(emp.name)}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-white text-lg">
                      {emp.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {emp.position}
                    </p>
                  </div>
                </div>

                {/* EMAIL */}
                <p className="flex items-center gap-2 text-sm text-gray-500 mb-3 truncate">
                  <FiMail /> {emp.email}
                </p>

                {/* STATS */}
                <div className="flex justify-between gap-4 items-center">
                  <div className="flex gap-3">
                    <span className="flex gap-1 items-center bg-blue-500/20 text-blue-400 px-3 py-1 text-xs rounded-full">
                      <FiFolder /> {projectCount}
                    </span>

                    <span className="flex gap-1 items-center bg-green-500/20 text-green-400 px-3 py-1 text-xs rounded-full">
                      <FiCheckSquare /> {taskCount}
                    </span>
                  </div>
                  {/* ACTIONS */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleEdit(emp)}
                      variant="secondary"
                    >
                      <FiEdit />
                    </Button>

                    <Button
                      onClick={() => handleDelete(emp.id)}
                      variant="danger"
                    >
                      <FiTrash2 />
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