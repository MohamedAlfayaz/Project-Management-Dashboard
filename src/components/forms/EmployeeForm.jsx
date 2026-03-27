import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { employeeSchema } from "../../utils/employeeSchema";
import { useDispatch, useSelector } from "react-redux";
import {
  addEmployee,
  updateEmployee,
} from "../../features/employees/employeeSlice";
import { useState, useEffect } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiUpload,
} from "react-icons/fi";

export default function EmployeeForm({ onClose, editData }) {
  const dispatch = useDispatch();
  const employees = useSelector((state) => state.employees.list);

  const [preview, setPreview] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(employeeSchema),
  });

  useEffect(() => {
    if (editData) {
      setValue("name", editData.name);
      setValue("position", editData.position);
      setValue("email", editData.email);
      setPreview(editData.image);
    }
  }, [editData, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    const finalImage = preview || editData?.image;

    if (!finalImage) {
      alert("Profile image required");
      return;
    }

    const exists = employees.find(
      (emp) =>
        emp.email === data.email &&
        emp.id !== editData?.id
    );

    if (exists) {
      alert("Email already exists");
      return;
    }

    await new Promise((res) => setTimeout(res, 600));

    if (editData) {
      dispatch(
        updateEmployee({
          id: editData.id,
          ...data,
          image: finalImage,
        })
      );
    } else {
      dispatch(
        addEmployee({
          id: Date.now().toString(),
          ...data,
          image: finalImage,
        })
      );
    }

    reset();
    setPreview(null);
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
        {editData ? "Edit Employee" : "Add Employee"}
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        Manage employee details
      </p>
    </div>

    {/* PROFILE SECTION */}
    <div className="flex flex-col items-center mb-8">
      <label className="relative group cursor-pointer">

        {/* AVATAR */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gray-700 bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <FiUser className="text-4xl text-gray-500" />
          )}
        </div>

        {/* HOVER */}
        <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <FiUpload className="text-white text-xl" />
        </div>

        <input
          type="file"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>

      <p className="text-xs text-gray-400 mt-2">
        Click to upload profile image
      </p>

      {!preview && (
        <p className="text-xs text-red-400 mt-1">
          Profile image required
        </p>
      )}
    </div>

    {/* FORM CARD */}
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-5 space-y-5 shadow-inner">

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

      {/* LEFT SIDE (optional info) */}
      <p className="text-xs text-gray-500">
        All fields are required
      </p>

      {/* BUTTONS */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button type="submit" loading={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : editData
            ? "Update Employee"
            : "Create Employee"}
        </Button>
      </div>
    </div>
  </form>
);
}