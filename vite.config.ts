import react from '@vitejs/plugin-react';
import swc from '@vitejs/plugin-react-swc';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import cssModules from './plugins/typed-css-modules-plugin';

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
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint --cache src',
        },
        biome: {
          command: 'lint',
        },
        typescript: true,
        stylelint: {
          lintCommand: 'stylelint --cache ./src/**/*.css',
        },
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
    {
      apply: 'serve',
      ...cssModules(),
    },
  ],
  build: {
    // Debug memo components
    // minify: false,
    cssMinify: 'lightningcss',
    target: 'esnext',
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client', 'react/compiler-runtime', 'scheduler', 'swr', 'wouter'],
        },
      },
    },
  },
  css: {
    transformer: 'lightningcss',
  },
  server: {
    open: true,
    port: 3000,
  },
  preview: {
    port: 3000,
  },
}));
