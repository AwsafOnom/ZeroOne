import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "ZeroOne",
        short_name: "ZeroOne",
        start_url: "/",
        display: "standalone",
      },
    }),
  ],
});
