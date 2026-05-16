import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: { list: [] },
  reducers: {
    addTask: (state, action) => {
      state.list.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.list.findIndex(
        (t) => t.id === action.payload.id
      );
      state.list[index] = action.payload;
    },
    deleteTask: (state, action) => {
      state.list = state.list.filter(
        (t) => t.id !== action.payload
      );
    },
    updateTaskStatus: (state, action) => {
      const task = state.list.find(
        (t) => t.id === action.payload.id
      );
      if (task) {
        task.status = action.payload.status;
      }
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = taskSlice.actions;

export default taskSlice.reducer;