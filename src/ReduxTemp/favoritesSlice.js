import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem("favorites");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: loadFromLocalStorage(),
  },
  reducers: {
    addFavorite: (state, action) => {
      const exists = state.favorites.find(
        (repo) => repo.id === action.payload.id,
      );
      if (!exists) {
        state.favorites.push(action.payload);
        localStorage.setItem("favorites", JSON.stringify(state.favorites));
      }
    },

    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (repo) => repo.id !== action.payload,
      );
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    },

    clearFavorites: (state) => {
      state.favorites = [];
      localStorage.setItem("favorites", JSON.stringify([]));
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
