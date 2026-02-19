import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";


defineConfig.exports = {
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sonsie: ["Sonsie One", "cursive"],
      },
    },
  },
  plugins: [tailwindcss()],
};

