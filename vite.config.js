import { defineConfig } from "vite";
import base44 from "@base44/vite-plugin";

export default defineConfig({
  plugins: [
    base44({
      legacySDKImports: false,
      hmrNotifier: true,
      navigationNotifier: true,
      visualEditAgent: true,
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
});