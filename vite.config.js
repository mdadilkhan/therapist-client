import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
     federation({
      name: "corporate_counsellor",
      filename: "corporateCounsellor.js",
      exposes: {
        "./corporate_counsellor": "./src/app.jsx",
        "./counsellorStore": "./src/store/store.jsx",
      },
      shared: ['react','react-router-dom','react-dom', 'react-redux', '@reduxjs/toolkit','dayjs'],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
