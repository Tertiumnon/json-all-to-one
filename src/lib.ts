import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface ConcatenateOptions {
  onProgress?: (count: number, total: number) => void;
}

export const concatenate = async (
  dir: string,
  targetFile: string,
  { onProgress }: ConcatenateOptions = {},
): Promise<string> => {
  const files = await readdir(dir);

  let count = 0;
  const items = await Promise.all(files.map(async (file) => {
    const raw = await readFile(join(dir, file), 'utf8');
    count += 1;
    onProgress?.(count, files.length);
    return JSON.parse(raw);
  }));

  const output = JSON.stringify({ data: items }, null, 2);
  await writeFile(targetFile, output);
  return output;
};
