import react from '@vitejs/plugin-react';
import swc from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  clearScreen: false,
  plugins: [
    command === 'serve'
      ? swc({ devTarget: 'esnext' })
      : react({
          babel: {
            plugins: [['babel-plugin-react-compiler']],
          },
        }),
    {
      apply: 'serve',
      ...checker({
        biome: {
          command: 'lint',
        },
        typescript: true,
        overlay: {
          initialIsOpen: false,
        },
      }),
    },
    {
      name: 'clear-console',
      apply: 'serve',
      config: () => console.clear(),
      watchChange: (path) => (path.includes('src') ? console.clear() : undefined),
    },
    {
      apply: () => command === 'build' && process.env.ANALYZE === 'true',
      ...visualizer({
        brotliSize: true,
        gzipSize: true,
        open: true,
      }),
    },
  ],
  build: {
    // Debug memo components
    // minify: false,
    target: 'esnext',
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks: {
          react: [
            'react',
            'react-dom',
            'react-dom/client',
            '@preact/signals-react',
            'react/compiler-runtime',
            'scheduler',
            'swr',
            'wouter',
          ],
        },
      },
    },
  },
  server: {
    open: true,
    port: 3000,
  },
  preview: {
    port: 3000,
  },
}));
