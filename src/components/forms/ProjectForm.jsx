import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { projectSchema } from "../../utils/projectSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  addProject,
  updateProject,
} from "../../features/projects/projectSlice";
import { useEffect, useState } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";
import IconSelector from "../ui/IconSelector";
import MultiSelect from "../ui/MultiSelect";

import {
  FiFolder,
  FiFileText,
  FiUsers,
} from "react-icons/fi";

export default function ProjectForm({ onClose, editData }) {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.list);

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState("FaProjectDiagram");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(projectSchema),
  });

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

  const onSubmit = async (data) => {
    if (selectedEmployees.length === 0) {
      alert("Select at least one employee");
      return;
    }

    if (new Date(data.startDate) > new Date(data.endDate)) {
      alert("Start date must be before end date");
      return;
    }

    await new Promise((res) => setTimeout(res, 800));

    const payload = {
      id: editData ? editData.id : Date.now().toString(),
      ...data,
      employees: selectedEmployees,
      icon: selectedIcon,
    };

    editData
      ? dispatch(updateProject(payload))
      : dispatch(addProject(payload));

    reset();
    setSelectedEmployees([]);
    setSelectedIcon("FaProjectDiagram");
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 p-4 "
    >
      {/* HEADER */}
      <h2 className="text-2xl font-semibold">
        {editData ? "Edit Project" : "Add Project"}
      </h2>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* ROW 1 */}
        <Input
          label="Project Title"
          icon={<FiFolder />}
          {...register("title")}
          error={errors.title?.message}
        />

        <Input
          label="Description"
          icon={<FiFileText />}
          {...register("description")}
          error={errors.description?.message}
        />

        {/* ROW 2 (FULL WIDTH ICON) */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-300 mb-2 block">
            Project Icon
          </label>

          <IconSelector
            selectedIcon={selectedIcon}
            setSelectedIcon={setSelectedIcon}
          />
        </div>

        {/* ROW 3 */}
        <Input
          type="datetime-local"
          label="Start Date"
          labelClass="text-sm"
          {...register("startDate")}
          error={errors.startDate?.message}
        />

        <Input
          type="datetime-local"
          label="End Date"
          labelClass="text-sm"
          {...register("endDate")}
          error={errors.endDate?.message}
        />

      </div>

      {/* EMPLOYEES */}
      <div>
        <label className="text-sm text-gray-300 flex items-center gap-2 mb-2">
          <FiUsers /> Assign Employees
        </label>

        <MultiSelect
          options={employees}
          selected={selectedEmployees}
          setSelected={setSelectedEmployees}
        />

        {selectedEmployees.length === 0 && (
          <p className="text-red-400 text-xs mt-2">
            Select at least one employee
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col md:flex-row justify-end gap-3 pt-4 border-t border-gray-700">
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
          loading={isSubmitting}
          className="w-full md:w-auto"
        >
          {editData ? "Update Project" : "Save Project"}
        </Button>
      </div>
    </form>
  );
}