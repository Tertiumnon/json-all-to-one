#!/usr/bin/env node

import { concatenate } from './lib.ts';

const [dir, targetFile] = process.argv.slice(2);

if (!dir || !targetFile) {
  process.stderr.write('Usage: json-all-to-one <dir-with-json-files> <file-to-write>\n');
  process.exit(1);
}

try {
  await concatenate(dir, targetFile, {
    onProgress: (count, total) => process.stdout.write(`(1/2) files: ${count} / ${total}\r`),
  });
  process.stdout.write('\n(2/2) done\n');
} catch (err) {
  process.stderr.write(`${(err as Error).message}\n`);
  process.exit(1);
}
