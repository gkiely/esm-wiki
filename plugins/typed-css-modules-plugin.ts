import fs from 'node:fs';
import { DtsCreator } from 'typed-css-modules/lib/dts-creator.js';
import type { Plugin, UserConfig } from 'vite';

const creator = new DtsCreator({ camelCase: true });
const createDTSFile = async (path: string) => {
  try {
    const content = await creator.create(path, undefined, true);
    await content.writeFile();
  } catch {
    console.error('Failed to generate .d.ts file for', path);
  }
};

// Recursively get all file paths in a directory
const walk = (dir: string, ext: string, filelist: string[] = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const path = `${dir}/${file}`;
    if (fs.statSync(path).isDirectory()) {
      walk(path, ext, filelist);
    } else if (path.endsWith(ext)) {
      filelist.push(path);
    }
  });
  return filelist;
};

// Inspired by: https://github.com/jhwz/vite-plugin-typed-css-modules
function plugin(): Plugin {
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
      // Generate .d.ts files for all .module.css files on startup if they don't exist
      const files = walk('src', '.module.css');
      files.forEach((path) => {
        if (fs.existsSync(path + '.d.ts')) return;
        createDTSFile(path);
      });

      server.watcher.on('change', async (path) => {
        if (!path.endsWith('.module.css')) return;
        createDTSFile(path);
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
