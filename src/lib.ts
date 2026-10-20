import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface ConcatenateOptions {
  /** Key that wraps the merged items in the output file. */
  name?: string;
  /** Take this property of each file instead of the whole file. */
  childrenOf?: string;
  onProgress?: (count: number, total: number) => void;
}

export const concatenate = async (
  dir: string,
  targetFile: string,
  { name = 'data', childrenOf, onProgress }: ConcatenateOptions = {},
): Promise<string> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = entries.filter((entry) => !entry.isDirectory()).map((entry) => entry.name);

  let count = 0;
  const items = await Promise.all(files.map(async (file) => {
    const parsed = JSON.parse(await readFile(join(dir, file), 'utf8'));
    count += 1;
    onProgress?.(count, files.length);
    if (!childrenOf) return parsed;
    if (!(childrenOf in parsed)) throw new Error(`${file} has no "${childrenOf}" property - check --childrenOf`);
    return parsed[childrenOf];
  }));

  // A file holding a list adds its items, not the list itself, so lists split across files merge into one.
  const output = JSON.stringify({ [name]: items.flat(1) }, null, 2);
  await writeFile(targetFile, output);
  return output;
};
