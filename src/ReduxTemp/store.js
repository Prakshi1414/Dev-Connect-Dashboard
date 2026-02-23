import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import favoritesReducer from "../ReduxTemp/favoritesSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    favorites: favoritesReducer,
    theme: themeReducer,
  },
});
