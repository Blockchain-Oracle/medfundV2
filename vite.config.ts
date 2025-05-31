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
  },
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'process', 'stream', 'crypto', 'util', 'events'],
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
      external: [
        /^postgres(\/.*)?$/,
        /^pg(\/.*)?$/,
        /^perf_hooks(\/.*)?$/,
        /^net(\/.*)?$/,
        /^tls(\/.*)?$/,
        /^fs(\/.*)?$/
      ],
      output: {
        // Make sure the externalized modules don't break the build
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('postgres') || 
                id.includes('pg') || 
                id.includes('perf_hooks') ||
                id.includes('net') ||
                id.includes('tls') ||
                id.includes('fs')) {
              return 'vendor-server-only';
            }
          }
        }
      }
    }
  }
}));
