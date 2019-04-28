# JSON-all-to-one

It is a script for a few JSON files concatenation to one.

For example you have a directory with JSON files:

```text
dir/
  file-1.json
  file-2.json
```

You want to contatenate all of them to one file.

Let's do it!

## Install

```bash
npm i -g json-all-to-one
```

## Use

```bash
json-all-to-one <dir-with-json-files> <file-to-write>
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
