import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { projectSchema } from "../../utils/projectSchema";

import Input from "../ui/Input";
import Button from "../ui/Button";
import IconSelector from "../ui/IconSelector";
import MultiSelect from "../ui/MultiSelect";

import { FiFolder, FiFileText, FiUsers } from "react-icons/fi";

// ✅ EMPLOYEE API
import { useEmployees } from "../../hooks/useEmployees";

// ✅ PROJECT API
import { useCreateProject, useUpdateProject } from "../../hooks/useProjects";

export default function ProjectForm({ onClose, editData }) {
  // ==========================
  // THEME
  // ==========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // ==========================
  // EMPLOYEES API
  // ==========================

  const { data: employees = [], isLoading: employeesLoading } = useEmployees();

  // ==========================
  // LOCAL STATE
  // ==========================

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const [selectedIcon, setSelectedIcon] = useState("FaProjectDiagram");

  // ==========================
  // MUTATIONS
  // ==========================

  const createMutation = useCreateProject();

  const updateMutation = useUpdateProject();

  // ==========================
  // FORM
  // ==========================

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(projectSchema),
  });

  // ==========================
  // EDIT DATA
  // ==========================

  useEffect(() => {
    if (editData) {
      setValue("title", editData.title);

      setValue("description", editData.description);

      setValue("startDate", editData.startDate);

      setValue("endDate", editData.endDate);

      setSelectedEmployees(editData.employees || []);

      setSelectedIcon(editData.icon || "FaProjectDiagram");
    }
  }, [editData, setValue]);

  // ==========================
  // SUBMIT
  // ==========================

  const onSubmit = async (data) => {
    // EMPLOYEE VALIDATION
    if (selectedEmployees.length === 0) {
      alert("Select at least one employee");

      return;
    }

    // DATE VALIDATION
    if (new Date(data.startDate) > new Date(data.endDate)) {
      alert("Start date must be before end date");

      return;
    }

    const payload = {
      ...data,

      employees: selectedEmployees,

      icon: selectedIcon,
    };

    try {
      // UPDATE
      if (editData) {
        await updateMutation.mutateAsync({
          id: editData._id,

          data: payload,
        });
      } else {
        // CREATE
        await createMutation.mutateAsync(payload);
      }

      // RESET
      reset();

      setSelectedEmployees([]);

      setSelectedIcon("FaProjectDiagram");

      onClose();
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* HEADER */}
      <div>
        <h2
          className={`text-3xl font-bold
          ${dark ? "text-white" : "text-gray-900"}`}
        >
          {editData ? "Edit Project" : "Add Project"}
        </h2>

        <p
          className={`text-sm mt-1
          ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Manage project details
        </p>
      </div>

      {/* FORM CARD */}
      <div
        className={`rounded-3xl border p-6 shadow-xl transition-all duration-300
        ${dark ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-200"}`}
      >
        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* TITLE */}
          <Input
            label="Project Title"
            icon={<FiFolder />}
            {...register("title")}
            error={errors.title?.message}
          />

          {/* DESCRIPTION */}
          <Input
            label="Description"
            icon={<FiFileText />}
            {...register("description")}
            error={errors.description?.message}
          />

          {/* ICON */}
          <div className="md:col-span-2">
            <label
              className={`text-sm flex items-center gap-2 mb-3 font-medium
              ${dark ? "text-gray-300" : "text-gray-700"}`}
            >
              <FiFolder />
              Project Icon
            </label>

            <IconSelector
              selectedIcon={selectedIcon}
              setSelectedIcon={setSelectedIcon}
            />
          </div>

          {/* START DATE */}
          <Input
            type="datetime-local"
            label="Start Date"
            labelClass="text-sm"
            {...register("startDate")}
            error={errors.startDate?.message}
          />

          {/* END DATE */}
          <Input
            type="datetime-local"
            label="End Date"
            labelClass="text-sm"
            {...register("endDate")}
            error={errors.endDate?.message}
          />
        </div>
      </div>

      {/* EMPLOYEES */}
      <div
        className={`rounded-3xl border p-6 shadow-xl transition-all duration-300
        ${dark ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-200"}`}
      >
        <label
          className={`text-sm flex items-center gap-2 mb-4 font-medium
          ${dark ? "text-gray-300" : "text-gray-700"}`}
        >
          <FiUsers />
          Assign Employees
        </label>

        {employeesLoading ? (
          <p
            className={`text-sm
            ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Loading employees...
          </p>
        ) : (
          <MultiSelect
            options={employees}
            selected={selectedEmployees}
            setSelected={setSelectedEmployees}
          />
        )}

        {selectedEmployees.length === 0 && (
          <p className="text-red-400 text-xs mt-3">
            Select at least one employee
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div
        className={`flex flex-col md:flex-row justify-end gap-3 pt-5 border-t
        ${dark ? "border-gray-800" : "border-gray-200"}`}
      >
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="w-full md:w-auto"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          loading={
            isSubmitting || createMutation.isPending || updateMutation.isPending
          }
          className="w-full md:w-auto"
        >
          {editData ? "Update Project" : "Save Project"}
        </Button>
      </div>
    </form>
  );
}
