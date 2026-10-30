import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  // Relative asset URLs so the build works from any sub-path, such as a GitHub Pages project site.
  base: "./",
  plugins: [react()],
});
