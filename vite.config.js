import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sonsie: ["Sonsie One", "cursive"],
      },
    },
  },
  plugins: [tailwindcss()],
});
