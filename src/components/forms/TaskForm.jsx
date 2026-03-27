import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { taskSchema } from "../../utils/taskSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  updateTask,
} from "../../features/tasks/taskSlice";
import { useEffect, useState } from "react";
import Input from "../ui/Input";
import { STATUSES } from "../../utils/helpers";
import Button from "../ui/Button";
import MultiSelect from "../ui/MultiSelect";
import { FiUpload } from "react-icons/fi";

export default function TaskForm({ onClose, editData }) {
  const dispatch = useDispatch();

  const projects = useSelector((state) => state.projects.list);
  const employees = useSelector((state) => state.employees.list);

  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

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
      employeeIds: [], // ✅ FIX
    },
  });

  const selectedProjectId = watch("projectId");
  const selectedEmployees = watch("employeeIds") || [];

  // 🔥 FILTER EMPLOYEES
  useEffect(() => {
    if (!selectedProjectId) {
      setFilteredEmployees([]);
      setValue("employeeIds", []);
      return;
    }

    const project = projects.find((p) => p.id === selectedProjectId);

    if (project) {
      const allowed = employees.filter((emp) =>
        project.employees.includes(emp.id)
      );

      setFilteredEmployees(allowed);

      const validSelected = selectedEmployees.filter((id) =>
        allowed.some((emp) => emp.id === id)
      );

      setValue("employeeIds", validSelected);
    }
  }, [selectedProjectId, projects, employees]);

  // EDIT MODE
  useEffect(() => {
    if (editData) {
      setValue("title", editData.title);
      setValue("description", editData.description);
      setValue("projectId", editData.projectId);
      setValue("employeeIds", editData.employeeIds || []);
      setValue("eta", editData.eta);
      setValue("status", editData.status);
      setImagePreview(editData.image);
    }
  }, [editData, setValue]);

  const onSubmit = (data) => {
    const finalImage = imagePreview || editData?.image;

    if (!finalImage) {
      alert("Reference image required");
      return;
    }

    const payload = {
      id: editData ? editData.id : Date.now().toString(),
      ...data,
      employeeIds: Array.isArray(data.employeeIds)
        ? data.employeeIds
        : [],
      image: finalImage,
      status: data.status || "todo",
    };

    editData
      ? dispatch(updateTask(payload))
      : dispatch(addTask(payload));

    reset();
    setImagePreview(null);
    onClose();
  };

  return (
  <form
    onSubmit={handleSubmit(onSubmit)}
    className="text-gray-200"
  >
    {/* HEADER */}
    <div className="mb-6 text-center">
      <h2 className="text-2xl font-bold text-white">
        {editData ? "Edit Task" : "Create Task"}
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        Assign tasks, set timeline, and track progress
      </p>
    </div>

    {/* MAIN CARD */}
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5 space-y-6 shadow-inner">

      {/* BASIC INFO */}
      <div className="space-y-5">
        <h3 className="text-sm text-gray-400 uppercase tracking-wide">
          Task Info
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          {/* PROJECT SELECT */}
          <div className="relative">
            <select
              {...register("projectId")}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-3 pt-5 pb-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 peer"
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>

            <label className="absolute left-3 top-1.5 text-xs text-gray-400 transition-all
              peer-placeholder-shown:top-3.5 
              peer-placeholder-shown:text-sm 
              peer-placeholder-shown:text-gray-500
              peer-focus:top-1.5 
              peer-focus:text-xs 
              peer-focus:text-blue-400">
              Project
            </label>

            <p className="text-red-400 text-xs mt-1">
              {errors.projectId?.message}
            </p>
          </div>

          <Input
            label="Task Title"
            {...register("title")}
            error={errors.title?.message}
          />

          <Input
            label="Description"
            {...register("description")}
            error={errors.description?.message}
          />
        </div>
      </div>

      {/* EMPLOYEES */}
      <div>
        <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-3">
          Assign Team
        </h3>

        <MultiSelect
          options={filteredEmployees}
          selected={selectedEmployees}
          setSelected={(val) =>
            setValue(
              "employeeIds",
              Array.isArray(val) ? val : []
            )
          }
          placeholder={
            selectedProjectId
              ? "Select employees..."
              : "Select project first"
          }
        />

        <p className="text-red-400 text-xs mt-2">
          {errors.employeeIds?.message}
        </p>
      </div>

      {/* TIMELINE + STATUS */}
      <div className="space-y-5">
        <h3 className="text-sm text-gray-400 uppercase tracking-wide">
          Timeline & Status
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          <Input
            type="date"
            label="ETA"
            {...register("eta")}
            error={errors.eta?.message}
          />

          {/* STATUS SELECT */}
          <div className="relative">
            <select
              {...register("status")}
              className="w-full bg-[#0f172a] border border-gray-700 rounded-xl px-3 pt-5 pb-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 peer"
            >
              {STATUSES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>

            <label className="absolute left-3 top-1.5 text-xs text-gray-400 transition-all
              peer-focus:text-blue-400">
              Status
            </label>
          </div>
        </div>
      </div>

      {/* IMAGE */}
      <div>
        <h3 className="text-sm text-gray-400 uppercase tracking-wide mb-3">
          Reference Image
        </h3>

        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:bg-[#1e293b] transition">

          {imagePreview ? (
            <img
              src={imagePreview}
              className="w-28 h-28 object-cover rounded-lg shadow-md"
            />
          ) : (
            <>
              <FiUpload className="text-2xl text-gray-400 mb-2" />
              <span className="text-sm text-gray-400">
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
                setImagePreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>
      </div>
    </div>

    {/* ACTIONS */}
    <div className="flex justify-between items-center mt-6">
      <p className="text-xs text-gray-500">
        Fill all required fields
      </p>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" loading={isSubmitting}>
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