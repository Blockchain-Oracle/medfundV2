import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'happy-viper-factual.ngrok-free.app',
      // Add any other domains you might use with ngrok
    ],
  },
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process', 'stream', 'crypto'],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: ['postgres'],
    },
  },
}));
