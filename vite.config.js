import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig({
  clearScreen: false,
  plugins: [
    preact(),
    {
      apply: 'serve',
      ...checker({
        overlay: {
          initialIsOpen: false,
        },
        typescript: {
          tsconfigPath: './jsconfig.json',
        },
      }),
    },
    {
      name: 'clear-console',
      apply: 'serve',
      config: () => console.clear(),
      watchChange: (path) => (path.includes('src') ? console.clear() : undefined),
    },
  ],
});
