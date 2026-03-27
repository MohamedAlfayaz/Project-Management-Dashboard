import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "projects",
  initialState: { list: [] },
  reducers: {
    addProject: (state, action) => {
      state.list.push(action.payload);
    },
    updateProject: (state, action) => {
      const index = state.list.findIndex(
        (p) => p.id === action.payload.id
      );
      state.list[index] = action.payload;
    },
    deleteProject: (state, action) => {
      state.list = state.list.filter(
        (p) => p.id !== action.payload
      );
    },
  },
});

export const { addProject, updateProject, deleteProject } =
  projectSlice.actions;
export default projectSlice.reducer;