import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "serve-dot-slidebuilder",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith("/.slidebuilder/")) return next();
          const filePath = path.join(__dirname, req.url.slice(1));
          if (fs.existsSync(filePath)) {
            res.statusCode = 200;
            if (req.method !== "HEAD") {
              res.setHeader("Content-Type", "text/plain; charset=utf-8");
              res.end(fs.readFileSync(filePath, "utf-8"));
            } else {
              res.end();
            }
          } else {
            res.statusCode = 404;
            res.end();
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
});
