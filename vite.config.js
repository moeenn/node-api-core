import { defineConfig } from "vite"
import path from "node:path"

export default defineConfig({
  test: {
    watch: false,
    exclude: ["node_modules"]
  },  
  resolve: {
    alias: {
      "#src": path.resolve(__dirname, "./src"),
    },
  },
})
