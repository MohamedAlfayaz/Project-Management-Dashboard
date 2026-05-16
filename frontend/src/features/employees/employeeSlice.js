import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      const exists = state.list.find(
        (emp) => emp.email === action.payload.email
      );
      if (!exists) state.list.push(action.payload);
    },

    updateEmployee: (state, action) => {
      const index = state.list.findIndex(
        (emp) => emp.id === action.payload.id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    deleteEmployee: (state, action) => {
      state.list = state.list.filter(
        (emp) => emp.id !== action.payload
      );
    },
  },
});

export const { addEmployee, updateEmployee, deleteEmployee } =
  employeeSlice.actions;

export default employeeSlice.reducer;