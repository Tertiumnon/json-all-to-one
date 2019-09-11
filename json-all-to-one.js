/* eslint-disable no-console */
const fs = require('fs');
const arg = require('arg');
const logger = require('logger').createLogger();

const args = arg({
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
});

args['--name'] = args['--name'] || 'data';

let files = [];
const newData = {
  [args['--name']]: [],
};

const getFilenames = new Promise((resolve, reject) => fs.readdir(args['--source'],
  { withFileTypes: true }, (err, results) => {
    console.time('json files merging');
    logger.debug(results);
    if (err) reject(err);
    resolve(files = results.filter(r => !r.isDirectory()).map(r => r.name));
  }));

const prettifyData = data => JSON.stringify(data, null, 4);

const writeOutputFile = () => new Promise((resolve, reject) => fs.writeFile(args['--output'], prettifyData(newData), { flag: 'w' }, (err) => {
  if (err) reject(err);
  resolve(true);
}));

const addData = (data) => {
  if (Array.isArray(data)) {
    newData[args['--name']] = newData[args['--name']].concat(data);
  } else {
    newData[args['--name']].push(data);
  }
};

const readFile = file => new Promise((resolve, reject) => fs.readFile(`${args['--source']}/${file}`, (err, data) => {
  if (err) reject(err);
  try {
    const parsedData = JSON.parse(data);
    const fileData = args['--childrenOf'] ? parsedData[args['--childrenOf']] : parsedData;
    resolve(addData(fileData));
  } catch (parseErr) {
    console.log(parseErr);
  }
}));

const readSourceFiles = () => new Promise((resolve, reject) => {
  const proms = files.map(readFile);
  const promsRes = Promise.all(proms);
  promsRes
    .then((res) => {
      resolve(res);
    })
    .catch((err) => {
      reject(err);
    });
});

getFilenames
  .then(() => readSourceFiles())
  .then(() => writeOutputFile())
  .then(() => console.timeEnd('json files merging'))
  .catch((err) => {
    throw err;
  });
