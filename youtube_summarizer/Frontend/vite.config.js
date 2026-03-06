import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy /summarize to FastAPI during dev to avoid CORS issues
      "/summarize": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});