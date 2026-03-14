import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuração clássica: Tailwind via PostCSS (postcss.config.cjs)
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["untracked-corinna-reliable.ngrok-free.dev"]
  }
});
