import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'jest';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const sharedSrc = join(repoRoot, 'libs/shared/src');

export default defineConfig({
  moduleNameMapper: {
    '^@shared$': join(sharedSrc, 'index.ts'),
    '^@shared/(.*)$': `${sharedSrc}/$1`,
  },
  cache: true,
  cacheDirectory: '.jest-cache',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'node10',
          ignoreDeprecations: '6.0',
          allowImportingTsExtensions: true,
          esModuleInterop: true,
          isolatedModules: true,
        },
      },
    ],
  },
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: [],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
});
