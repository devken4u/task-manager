import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config";

const backendUrl = process.env.BACKEND_BASE_URL;
console.log(backendUrl);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
});
