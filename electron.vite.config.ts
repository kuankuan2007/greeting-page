import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import autoImport from 'unplugin-auto-import/vite';
import Inspect from 'vite-plugin-inspect';
import { visualizer } from 'rollup-plugin-visualizer';
import postcssPresetEnv from 'postcss-preset-env';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: 'src/main/index.ts',
      },
    }
  },
  preload: {
    build: {
      lib: {
        entry: 'src/preload/index.ts',
      },
    }
  },
  renderer: {
    plugins: [
      vue(),
      Inspect(),
      autoImport({
        imports: ['vue', 'vue-router'],
        dts: 'src/types/auto-imports.d.ts',
      }),
      visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
        filename: './temp/test.html',
        open: true,
      }),
    ],
    css: {
      postcss: {
        plugins: [
          postcssPresetEnv(),
          autoprefixer({
            overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 31', 'ie >= 8'],
            grid: true,
          }),
          cssnano(),
        ],
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src/renderer', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
    },
  },
});
