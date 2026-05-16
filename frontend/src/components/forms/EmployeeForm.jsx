import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { employeeSchema } from "../../utils/employeeSchema";

import { useState, useEffect } from "react";

import Input from "../ui/Input";
import Button from "../ui/Button";

import { FiUser, FiMail, FiBriefcase, FiUpload } from "react-icons/fi";

// ✅ REDUX
import { useSelector } from "react-redux";

// ✅ REACT QUERY
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
} from "../../hooks/useEmployees";

export default function EmployeeForm({ onClose, editData }) {
  // ==========================
  // THEME
  // ==========================

  const mode = useSelector((state) => state.theme.mode);

  const dark = mode === "dark";

  // ==========================
  // GET EMPLOYEES
  // ==========================

  const { data: employees = [] } = useEmployees();

  // ==========================
  // CREATE
  // ==========================

  const createMutation = useCreateEmployee();

  // ==========================
  // UPDATE
  // ==========================

  const updateMutation = useUpdateEmployee();

  const [preview, setPreview] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(employeeSchema),
  });

  // ==========================
  // EDIT DATA
  // ==========================

  useEffect(() => {
    if (editData) {
      setValue("name", editData.name);

      setValue("position", editData.position);

      setValue("email", editData.email);

      setPreview(
        editData.image ? `http://localhost:5000${editData.image}` : null,
      );
    }
  }, [editData, setValue]);

  // ==========================
  // IMAGE CHANGE
  // ==========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);

      setPreview(URL.createObjectURL(file));
    }
  };

  // ==========================
  // SUBMIT
  // ==========================

  const onSubmit = async (data) => {
    // IMAGE REQUIRED
    if (!preview && !editData) {
      alert("Profile image required");

      return;
    }

    // EMAIL EXISTS
    const exists = employees.find(
      (emp) => emp.email === data.email && emp._id !== editData?._id,
    );

    if (exists) {
      alert("Email already exists");

      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", data.name);

      formData.append("position", data.position);

      formData.append("email", data.email);

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

      setPreview(null);

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
          {editData ? "Edit Employee" : "Add Employee"}
        </h2>

        <p
          className={`text-sm mt-1
          ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Manage employee details
        </p>
      </div>

      {/* PROFILE */}
      <div className="flex flex-col items-center mb-8">
        <label className="relative group cursor-pointer">
          {/* AVATAR */}
          <div
            className={`w-28 h-28 rounded-full overflow-hidden border-2 flex items-center justify-center shadow-xl transition-all duration-300
            ${
              dark
                ? "border-gray-700 bg-gradient-to-br from-[#1e293b] to-[#0f172a]"
                : "border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200"
            }`}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser
                className={`text-4xl
                ${dark ? "text-gray-500" : "text-gray-400"}`}
              />
            )}
          </div>

          {/* HOVER */}
          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <FiUpload className="text-white text-xl" />
          </div>

          {/* INPUT */}
          <input type="file" className="hidden" onChange={handleImageChange} />
        </label>

        <p
          className={`text-xs mt-3
          ${dark ? "text-gray-400" : "text-gray-500"}`}
        >
          Click to upload profile image
        </p>

        {!preview && (
          <p className="text-xs text-red-400 mt-1">Profile image required</p>
        )}
      </div>

      {/* FORM */}
      <div
        className={`border rounded-3xl p-6 space-y-1 shadow-xl transition-all duration-300
        ${dark ? "bg-[#0f172a] border-gray-800" : "bg-white border-gray-200"}`}
      >
        <Input
          label="Full Name"
          icon={<FiUser />}
          {...register("name")}
          error={errors.name?.message}
        />

        <Input
          label="Position"
          icon={<FiBriefcase />}
          {...register("position")}
          error={errors.position?.message}
        />

        <Input
          label="Email Address"
          type="email"
          icon={<FiMail />}
          {...register("email")}
          error={errors.email?.message}
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center mt-8">
        <p
          className={`text-xs
          ${dark ? "text-gray-500" : "text-gray-400"}`}
        >
          All fields are required
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
            {editData ? "Update Employee" : "Create Employee"}
          </Button>
        </div>
      </div>
    </form>
  );
}
