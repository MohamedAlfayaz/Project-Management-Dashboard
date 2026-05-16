import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "../features/employees/employeeSlice";
import projectReducer from "../features/projects/projectSlice";
import taskReducer from "../features/tasks/taskSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    employees: employeeReducer,
    projects: projectReducer,
    tasks: taskReducer,
  },
});