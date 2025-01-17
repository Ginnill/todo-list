import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/todo-list/', // Substitua pelo nome do repositório no GitHub
  plugins: [react()],
});
