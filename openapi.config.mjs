import { execFileSync } from 'node:child_process';
import path from 'node:path';

const DEFAULT_OPENAPI_URL = 'http://localhost:5207/swagger/v1/swagger.json';
const INPUT = process.env.OPENAPI_URL || DEFAULT_OPENAPI_URL;
const OUTPUT = path.resolve('src/generated/api-types.ts');

const run = async () => {
  execFileSync(
    'npx',
    ['openapi-typescript', INPUT, '-o', OUTPUT],
    { stdio: 'inherit' }
  );

  // Keep output simple and explicit for CI logs.
  process.stdout.write(`Generated types: ${OUTPUT}\n`);
};

run().catch((error) => {
  process.stderr.write(`OpenAPI type generation failed: ${error.message}\n`);
  process.exit(1);
});
