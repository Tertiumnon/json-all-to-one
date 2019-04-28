const fs = require('fs');
const { pd } = require('pretty-data');

const dir = process.argv[2];
const targetFile = process.argv[3];

let files = [];
let count = 0;

const readDir = new Promise((resolve, reject) => fs.readdir(dir, (err, filenames) => {
  if (err) reject(err);
  resolve(filenames);
}));

const startWriting = () => new Promise((resolve, reject) => fs.writeFile(targetFile, '{\n"data":\n[', { flag: 'w' }, (err) => {
  if (err) reject(err);
  resolve(true);
}));

const writeFile = data => new Promise((resolve, reject) => fs.writeFile(targetFile, `\n${data},`, { flag: 'a+' }, (err) => {
  if (err) reject(err);
  count += 1;
  process.stdout.write(`(1/2) files: ${count} / ${files.length}\r`);
  resolve(true);
}));

const readAndWriteFile = file => new Promise((resolve, reject) => fs.readFile(`${dir}/${file}`, (err, data) => {
  if (err) reject(err);
  resolve(writeFile(data));
}));

const writing = () => new Promise((resolve, reject) => {
  const proms = files.map(readAndWriteFile);
  const promsRes = Promise.all(proms);
  promsRes.then((res) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

const endWriting = () => new Promise((resolve, reject) => {
  fs.writeFile(targetFile, '\n]\n}', { flag: 'a' }, (err) => {
    if (err) reject(err);
    resolve(true);
  });
});

const readTargetFile = () => new Promise((resolve, reject) => {
  fs.readFile(targetFile, 'utf8', (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});

const prettifyTargetFile = data => new Promise((resolve, reject) => {
  fs.writeFile(targetFile, pd.json(data.replace('},\n]', '}\n]')), (err) => {
    if (err) reject(err);
    resolve(true);
  });
});

readDir
  .then((res) => {
    files = res;
    return startWriting(res);
  })
  .then(() => writing())
  .then(() => endWriting())
  .then(() => readTargetFile())
  .then(data => prettifyTargetFile(data))
  .then(() => process.stdout.write('\n(2/2) done'))
  .catch((err) => {
    throw err;
  });
