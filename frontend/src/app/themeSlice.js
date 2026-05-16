import { createSlice } from "@reduxjs/toolkit";

// ==========================
// LOAD FROM LOCAL STORAGE
// ==========================

const savedTheme =
  localStorage.getItem("theme");

// ==========================
// INITIAL STATE
// ==========================

const initialState = {
  mode:
    savedTheme || "dark",
};

// ==========================
// SLICE
// ==========================

const themeSlice =
  createSlice({
    name: "theme",

    initialState,

    reducers: {

      toggleTheme: (
        state
      ) => {

        state.mode =
          state.mode ===
          "dark"
            ? "light"
            : "dark";

        // ✅ SAVE TO LOCAL STORAGE
        localStorage.setItem(
          "theme",
          state.mode
        );
      },

      // OPTIONAL
      setTheme: (
        state,
        action
      ) => {

        state.mode =
          action.payload;

        localStorage.setItem(
          "theme",
          action.payload
        );
      },
    },
  });

// ==========================
// EXPORTS
// ==========================

export const {
  toggleTheme,
  setTheme,
} = themeSlice.actions;

export default themeSlice.reducer;