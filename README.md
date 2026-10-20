# JSON All to One

Merge a directory of JSON files into one.

```text
dir/
  file-1.json
  file-2.json
```

## Use

```bash
json-all-to-one -s 'some-dir' -o 'all-in-one.json'
```

You will receive a file:

```json
{
  "data": [
    { "object1" },
    { "object2" },
    { "etc" }
  ]
}
```

A file that holds a list adds its items, and folders inside the source directory are skipped.

| Flag | Meaning |
| --- | --- |
| `-s`, `--source` | Directory with the JSON files (required) |
| `-o`, `--output` | File to write (required) |
| `-n`, `--name` | Key that wraps the items, `data` by default |
| `-c`, `--childrenOf` | Take this property of each file instead of the whole file |

```bash
json-all-to-one -s 'some-dir' -o 'all-in-one.json' -n 'xxx' -c 'old-data'
```

Zero runtime dependencies. Works under both Node.js and [Bun](https://bun.sh).

## Use as a library

```ts
import { concatenate } from 'json-all-to-one';

await concatenate('./dir-with-json-files', './out.json');
```

## Documentation

- [Install](docs/INSTALL.md)
- [Development](docs/DEVELOPMENT.md)

## Support

If this project is useful to you, you can support its development on [Ko-fi](https://ko-fi.com/tertiumnon).
