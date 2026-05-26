import { existsSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const toolRoot = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(toolRoot, '../..');

const normalizeAppName = (value) =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

export default function configurePlop(plop) {
  plop.setHelper('appName', (value) => normalizeAppName(value));
  plop.setActionType('delete', (answers, config, plopApi) => {
    const filePath = plopApi.renderString(config.path, answers);

    if (!existsSync(filePath)) return `Skipped delete; ${filePath} does not exist.`;

    rmSync(filePath, { force: true });
    return `Deleted ${filePath}.`;
  });

  plop.setGenerator('cli-app', {
    description: 'Provision a TypeScript CLI app under apps/* wired to libs/shared.',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'CLI app name',
        validate: (value) => {
          const appName = normalizeAppName(value);
          if (!appName) return 'Provide a CLI app name.';
          if (existsSync(resolve(repoRoot, 'apps', appName))) return `apps/${appName} already exists.`;
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: resolve(repoRoot, 'apps/{{appName name}}/package.json'),
        templateFile: 'templates/cli-app/package.json.hbs',
      },
      {
        type: 'add',
        path: resolve(repoRoot, 'apps/{{appName name}}/.env'),
        templateFile: 'templates/cli-app/.env.hbs',
      },
      {
        type: 'add',
        path: resolve(repoRoot, 'apps/{{appName name}}/.env.sample.ts'),
        templateFile: 'templates/cli-app/.env.sample.ts.hbs',
      },
      {
        type: 'add',
        path: resolve(repoRoot, 'apps/{{appName name}}/tsconfig.json'),
        templateFile: 'templates/cli-app/tsconfig.json.hbs',
      },
      {
        type: 'add',
        path: resolve(repoRoot, 'apps/{{appName name}}/jest.config.mjs'),
        templateFile: 'templates/cli-app/jest.config.mjs.hbs',
      },
      {
        type: 'add',
        path: resolve(repoRoot, 'apps/{{appName name}}/esbuild.config.ts'),
        templateFile: 'templates/cli-app/esbuild.config.ts.hbs',
      },
      {
        type: 'add',
        path: resolve(repoRoot, 'apps/{{appName name}}/src/index.ts'),
        templateFile: 'templates/cli-app/src/index.ts.hbs',
      },
      {
        type: 'add',
        path: resolve(repoRoot, 'apps/{{appName name}}/src/env-vars.ts'),
        templateFile: 'templates/cli-app/src/env-vars.ts.hbs',
      },
      {
        type: 'add',
        path: resolve(repoRoot, 'apps/{{appName name}}/tests/unit/index.test.ts'),
        templateFile: 'templates/cli-app/tests/unit/index.test.ts.hbs',
      },
      {
        type: 'delete',
        path: resolve(repoRoot, 'apps/.gitkeep'),
      },
    ],
  });
}
