import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { taskSchema } from "../../utils/taskSchema";

import Input from "../ui/Input";
import { STATUSES } from "../../utils/helpers";
import Button from "../ui/Button";
import MultiSelect from "../ui/MultiSelect";

import { FiUpload } from "react-icons/fi";

// ✅ TASK API
import { useCreateTask, useUpdateTask } from "../../hooks/useTasks";

// ✅ PROJECT API
import { useProjects } from "../../hooks/useProjects";

// ✅ EMPLOYEE API
import { useEmployees } from "../../hooks/useEmployees";

export default function TaskForm({ onClose, editData }) {
  // ==========================
  // THEME
  // ==========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // ==========================
  // API DATA
  // ==========================

  const { data: projects = [] } = useProjects();

  const { data: employees = [] } = useEmployees();

  // ==========================
  // TASK MUTATIONS
  // ==========================

  const createMutation = useCreateTask();

  const updateMutation = useUpdateTask();

  // ==========================
  // LOCAL STATE
  // ==========================

  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const [imagePreview, setImagePreview] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);

  // ==========================
  // FORM
  // ==========================

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(taskSchema),

    defaultValues: {
      title: "",
      description: "",
      projectId: "",
      employeeIds: [],
      eta: "",
      status: "todo",
    },
  });

  // ==========================
  // WATCH
  // ==========================

  const selectedProjectId = watch("projectId");

  const selectedEmployees = watch("employeeIds") || [];

  // ==========================
  // FILTER EMPLOYEES
  // ==========================

  useEffect(() => {
    if (!projects.length || !employees.length) {
      return;
    }

    if (!selectedProjectId) {
      setFilteredEmployees([]);

      return;
    }

    const project = projects.find(
      (p) => String(p._id) === String(selectedProjectId),
    );

    if (!project) {
      setFilteredEmployees([]);

      return;
    }

    const allowed = employees.filter((emp) =>
      project.employees?.some(
        (employee) => String(employee._id || employee) === String(emp._id),
      ),
    );

    setFilteredEmployees(allowed);
  }, [selectedProjectId, projects, employees]);

  // ==========================
  // EDIT / RESET
  // ==========================

  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title || "",

        description: editData.description || "",

        projectId: editData.projectId?._id || editData.projectId || "",

        employeeIds: Array.isArray(editData.employeeIds)
          ? editData.employeeIds.map((emp) => emp._id || emp)
          : [],

        eta: editData.eta
          ? new Date(editData.eta).toISOString().split("T")[0]
          : "",

        status: editData.status || "todo",
      });

      if (editData.image) {
        setImagePreview(`http://localhost:5000${editData.image}`);
      } else {
        setImagePreview(null);
      }
    } else {
      reset({
        title: "",
        description: "",
        projectId: "",
        employeeIds: [],
        eta: "",
        status: "todo",
      });

      setFilteredEmployees([]);

      setImagePreview(null);

      setSelectedFile(null);
    }
  }, [editData, reset]);

  // ==========================
  // SUBMIT
  // ==========================

  const onSubmit = async (data) => {
    try {
      // IMAGE REQUIRED
      if (!imagePreview && !editData) {
        alert("Reference image required");

        return;
      }

      const formData = new FormData();

      formData.append("title", data.title);

      formData.append("description", data.description);

      formData.append("projectId", data.projectId);

      formData.append("eta", data.eta);

      formData.append("status", data.status || "todo");

      selectedEmployees.forEach((id) => {
        formData.append("employeeIds", id);
      });

      // IMAGE
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      // UPDATE
      if (editData) {
        await updateMutation.mutateAsync({
          id: editData._id,

          data: formData,
        });
      } else {
        // CREATE
        await createMutation.mutateAsync(formData);
      }

      // RESET
      reset();

      setFilteredEmployees([]);

      setImagePreview(null);

      setSelectedFile(null);

      onClose();
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`transition-all duration-300
      ${dark ? "text-gray-200" : "text-gray-800"}`}
    >
      {/* HEADER */}
      <div className="mb-8">
        <h2
          className={`text-3xl font-bold
          ${dark ? "text-white" : "text-gray-900"}`}
        >
          {editData ? "Edit Task" : "Create Task"}
        </h2>

        <p
          className={`text-sm mt-1
          ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Assign tasks and track progress
        </p>
      </div>

      {/* MAIN CARD */}
      <div
        className={`border rounded-3xl p-6 space-y-6 shadow-xl transition-all duration-300
        ${dark ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-200"}`}
      >
        {/* TASK INFO */}
        <div className="space-y-5">
          <h3
            className={`text-sm uppercase tracking-wide
            ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Task Info
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* PROJECT */}
            <div className="relative">
              <select
                {...register("projectId")}
                className={`w-full border rounded-2xl px-3 pt-5 pb-2 text-sm outline-none transition-all duration-300
                ${
                  dark
                    ? "bg-[#0f172a] border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">Select Project</option>

                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>

              <label
                className={`absolute left-3 top-1.5 text-xs
                ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Project
              </label>

              <p className="text-red-400 text-xs mt-1">
                {errors.projectId?.message}
              </p>
            </div>

            {/* TITLE */}
            <Input
              label="Task Title"
              {...register("title")}
              error={errors.title?.message}
            />

            {/* DESCRIPTION */}
            <Input
              label="Description"
              {...register("description")}
              error={errors.description?.message}
            />
          </div>
        </div>

        {/* EMPLOYEES */}
        <div>
          <h3
            className={`text-sm uppercase tracking-wide mb-3
            ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Assign Team
          </h3>

          <MultiSelect
            options={filteredEmployees}
            selected={selectedEmployees}
            setSelected={(val) =>
              setValue("employeeIds", Array.isArray(val) ? val : [])
            }
            placeholder={
              selectedProjectId ? "Select employees..." : "Select project first"
            }
          />

          <p className="text-red-400 text-xs mt-2">
            {errors.employeeIds?.message}
          </p>
        </div>

        {/* TIMELINE */}
        <div className="space-y-5">
          <h3
            className={`text-sm uppercase tracking-wide
            ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Timeline & Status
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            {/* ETA */}
            <Input
              type="date"
              label="ETA"
              {...register("eta")}
              error={errors.eta?.message}
            />

            {/* STATUS */}
            <div className="relative">
              <select
                {...register("status")}
                className={`w-full border rounded-2xl px-3 pt-5 pb-2 text-sm outline-none transition-all duration-300
                ${
                  dark
                    ? "bg-[#0f172a] border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                {STATUSES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>

              <label
                className={`absolute left-3 top-1.5 text-xs
                ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                Status
              </label>
            </div>
          </div>
        </div>

        {/* IMAGE */}
        <div>
          <h3
            className={`text-sm uppercase tracking-wide mb-3
            ${dark ? "text-gray-400" : "text-gray-500"}`}
          >
            Reference Image
          </h3>

          <label
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-8 cursor-pointer transition-all duration-300
            ${
              dark
                ? "border-gray-700 hover:border-blue-500 hover:bg-[#1e293b]"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                className="w-28 h-28 object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <>
                <FiUpload
                  className={`text-3xl mb-3
                  ${dark ? "text-gray-400" : "text-gray-500"}`}
                />

                <span
                  className={`text-sm
                  ${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Click to upload image
                </span>
              </>
            )}

            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setSelectedFile(file);

                  setImagePreview(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* ACTIONS */}
      <div
        className={`flex justify-between items-center mt-8 pt-5 border-t
        ${dark ? "border-gray-800" : "border-gray-200"}`}
      >
        <p
          className={`text-xs
          ${dark ? "text-gray-500" : "text-gray-400"}`}
        >
          Fill all required fields
        </p>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            loading={
              isSubmitting ||
              createMutation.isPending ||
              updateMutation.isPending
            }
          >
            {isSubmitting
              ? "Saving..."
              : editData
                ? "Update Task"
                : "Create Task"}
          </Button>
        </div>
      </div>
    </form>
  );
}
