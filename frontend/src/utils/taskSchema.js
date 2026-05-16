import * as yup from "yup";

export const taskSchema = yup.object({
  title: yup.string().required("Task title required"),
  description: yup.string().required("Description required"),
  projectId: yup.string().required("Select project"),
  employeeIds: yup
    .array()
    .min(1, "Select at least one employee"),
  eta: yup.string().required("ETA required"),
});