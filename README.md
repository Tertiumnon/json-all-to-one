# JSON-all-to-one

It is a script for a few JSON files concatenation to one.

For example you have a directory with JSON files:

```text
dir/
  file-1.json
  file-2.json
```

You want to concatenate all of them to one file.

Let's do it!

## Install

```bash
npm i -g json-all-to-one
```

## Params

```text
// Types
'--source': String, // path to source filename
'--output': String, // output filename
'--name': String, // wrapper name
'--childrenOf': String, // get children of

// Aliases
'-s': '--source',
'-o': '--output',
'-n': '--name',
'-c': '--childrenOf',
```

## Use

### Example 1

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

### Example 2

```bash
json-all-to-one -s 'some-dir' -o 'all-in-one.json' -n 'xxx'
```

You will receive a file:

```json
{
  "xxx": [
    { "object1" },
    { "object2" },
    { "etc" }
  ]
}
```

### Example 3

```bash
json-all-to-one -s 'some-dir' -o 'all-in-one.json' -c 'old-data'
```

If you want to get objects inside parent "old-data" (some-dir/file-1)

```json
{
  "old-data": [
    { "object1" },
    { "object2" },
    { "etc" }
  ]
}
```
