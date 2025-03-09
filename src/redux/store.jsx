import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./ThemeSlice"; // Import theme slice

const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
});

export default store;
