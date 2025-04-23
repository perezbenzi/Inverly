import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { SERVER_CONFIG } from "./src/constants";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: SERVER_CONFIG.HOST,
    port: SERVER_CONFIG.PORT,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
