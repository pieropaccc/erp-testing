import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000', // tu front dentro del docker compose
    headless: true,
  },
});