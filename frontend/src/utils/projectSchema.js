import * as yup from "yup";

export const projectSchema = yup.object({
  title: yup.string().required("Title required"),
  description: yup.string().required("Description required"),
  startDate: yup.string().required("Start date required"),
  endDate: yup.string().required("End date required"),
});