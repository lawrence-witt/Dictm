import type { Config } from '@jest/types';
import path from 'path';

const config: Config.InitialOptions = {
  verbose: true,
  preset: "ts-jest",
  testTimeout: 3000,
  roots: [
    path.resolve(process.cwd(), "./src/db")
  ],
  setupFiles: [
    path.resolve(process.cwd(), "./config/jest/globals/db-global.ts")
  ]
};

export default config;