import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';  // Make sure the import is correct

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
