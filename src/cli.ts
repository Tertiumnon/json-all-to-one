#!/usr/bin/env node

import { parseArgs } from 'node:util';
import { concatenate } from './lib.ts';

const USAGE = 'Usage: json-all-to-one -s <dir-with-json-files> -o <file-to-write> [-n <wrapper-name>] [-c <property>]\n';

const { values } = parseArgs({
  options: {
    source: { type: 'string', short: 's' },
    output: { type: 'string', short: 'o' },
    name: { type: 'string', short: 'n' },
    childrenOf: { type: 'string', short: 'c' },
  },
});

if (!values.source || !values.output) {
  process.stderr.write(USAGE);
  process.exit(1);
}

try {
  await concatenate(values.source, values.output, {
    name: values.name,
    childrenOf: values.childrenOf,
    onProgress: (count, total) => process.stdout.write(`(1/2) files: ${count} / ${total}\r`),
  });
  process.stdout.write('\n(2/2) done\n');
} catch (err) {
  process.stderr.write(`${(err as Error).message}\n`);
  process.exit(1);
}
