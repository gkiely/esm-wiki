import fs from 'node:fs';
import { DtsCreator } from 'typed-css-modules/lib/dts-creator.js';
import type { Plugin, UserConfig } from 'vite';

// Inspired by: https://github.com/jhwz/vite-plugin-typed-css-modules
function plugin(): Plugin {
  const creator = new DtsCreator({ camelCase: true });
  return {
    name: 'typed-css-modules',
    config: () => {
      const config: UserConfig = {
        css: {
          modules: {
            localsConvention: 'camelCaseOnly',
          },
        },
      };
      return config;
    },
    configureServer: (server) => {
      server.watcher.on('change', async (path) => {
        if (!path.endsWith('.module.css')) return;
        try {
          const content = await creator.create(path, undefined, true);
          await content.writeFile();
        } catch {
          console.error('Failed to generate .d.ts file for', path);
        }
      });
      server.watcher.on('unlink', (path) => {
        if (!path.endsWith('.module.css')) return;
        try {
          fs.unlinkSync(path + '.d.ts');
        } catch {}
      });
    },
  };
}

export default plugin;
