import type { Config } from '@jest/types';
import path from 'path';

// Read every script from globals folder dynamically?

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testTimeout: 3000,
  roots: [
    path.resolve(process.cwd(), "./src")
  ],
  setupFiles: [
    path.resolve(process.cwd(), "./config/jest/globals/db-global.ts")
  ]
};

export default config;