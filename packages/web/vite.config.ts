import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: { alias: { './runtimeConfig': './runtimeConfig.browser' } },
  plugins: [
    react(),
    svgr(),
    nodePolyfills({
      globals: {
        Buffer: true,
        process: true,
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      injectRegister: 'auto',
      manifest: {
        name: 'React Sample App',
        short_name: 'Sample App',
        description:
          'React の Sample アプリケーション実装',
        start_url: '/',
        display: 'minimal-ui',
        theme_color: '#232F3E',
        background_color: '#FFFFFF',
        icons: [],
      },
    }),
  ],
});