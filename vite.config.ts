import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({
      staticImport: true,
      rollupTypes: true,

    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'ZustandSlice',
      formats: ['es', 'umd'],
      fileName: (format) => `zustand-slice.${format}.js`
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: ['zustand'],
      output: {
        exports: "named",
        globals: {
          zustand: 'zustand'
        }
      }
    }
  }
});
