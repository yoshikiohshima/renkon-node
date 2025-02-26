import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
          entry: resolve(__dirname, 'index.js'),
          formats: ["es"],
          name: 'renkon-node',
          fileName: 'renkon-node',
        },
        minify: false
    }
})
