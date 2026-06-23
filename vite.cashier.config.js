import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "index-cashier.html",
    },
    outDir: "dist-cashier",
    emptyOutDir: true,
  },
});
