import * as yup from "yup";

export const employeeSchema = yup.object({
  name: yup.string().required("Name is required"),
  position: yup.string().required("Position is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  // image: yup
  // .mixed()
  // .test("required", "Profile image required", (value) => {
  //   return value && value.length > 0;
  // }),
});