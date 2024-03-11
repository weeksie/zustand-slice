import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [react()],
    test: {
        name: 'zustand-slice',
        globals: true,
        environment: 'jsdom',
        dir: 'test',
        reporters: 'basic',
    },
});
