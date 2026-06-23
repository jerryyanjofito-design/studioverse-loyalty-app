import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: "index-customer.html",
    },
    outDir: "dist-customer",
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
  // For dev mode, use the customer HTML as main
  root: ".",
});
