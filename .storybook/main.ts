import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      define: {
        'process.env': {},
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      },
      resolve: {
        alias: {
          'next/navigation': path.resolve(__dirname, './next-router-mock.ts'),
          'next/link': path.resolve(__dirname, './next-link-mock.tsx'),
        },
      },
    });
  },
};
export default config;