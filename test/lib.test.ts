import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { concatenate } from '../src/lib.ts';

let dir: string;
let targetFile: string;

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'json-all-to-one-'));
  targetFile = join(dir, 'out.json');
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

const writeSourceFile = (name: string, content: string) => {
  writeFileSync(join(dir, name), content);
};

describe('concatenate', () => {
  test('merges multiple JSON files into { data: [...] }', async () => {
    writeSourceFile('file-1.json', '{"a":1}');
    writeSourceFile('file-2.json', '{"b":2}');

    await concatenate(dir, targetFile);

    const result = JSON.parse(readFileSync(targetFile, 'utf8'));
    expect(result.data).toHaveLength(2);
    expect(result.data).toContainEqual({ a: 1 });
    expect(result.data).toContainEqual({ b: 2 });
  });

  test('handles source files with trailing newlines', async () => {
    writeSourceFile('file-1.json', '{"a":1}\n');
    writeSourceFile('file-2.json', '{"b":2}\n');

    await concatenate(dir, targetFile);

    const raw = readFileSync(targetFile, 'utf8');
    expect(() => JSON.parse(raw)).not.toThrow();
  });

  test('preserves nested structures', async () => {
    writeSourceFile('file-1.json', '{"c":{"nested":true,"list":[1,2,3]}}');

    await concatenate(dir, targetFile);

    const result = JSON.parse(readFileSync(targetFile, 'utf8'));
    expect(result.data[0]).toEqual({ c: { nested: true, list: [1, 2, 3] } });
  });

  test('writes pretty-printed, parseable JSON', async () => {
    writeSourceFile('file-1.json', '{"a":1}');

    const output = await concatenate(dir, targetFile);

    expect(output).toContain('\n');
    expect(() => JSON.parse(output)).not.toThrow();
    expect(readFileSync(targetFile, 'utf8')).toBe(output);
  });

  test('produces an empty data array for an empty directory', async () => {
    await concatenate(dir, targetFile);

    const result = JSON.parse(readFileSync(targetFile, 'utf8'));
    expect(result).toEqual({ data: [] });
  });

  test('rejects when the source directory does not exist', async () => {
    const missingDir = join(dir, 'does-not-exist');

    await expect(concatenate(missingDir, targetFile)).rejects.toThrow();
  });

  test('rejects when a source file is not valid JSON', async () => {
    writeSourceFile('file-1.json', 'not json');

    await expect(concatenate(dir, targetFile)).rejects.toThrow();
  });

  test('reports progress via onProgress', async () => {
    writeSourceFile('file-1.json', '{"a":1}');
    writeSourceFile('file-2.json', '{"b":2}');

    const calls: Array<[number, number]> = [];
    await concatenate(dir, targetFile, {
      onProgress: (count, total) => calls.push([count, total]),
    });

    expect(calls).toHaveLength(2);
    expect(calls[calls.length - 1]).toEqual([2, 2]);
  });
});
