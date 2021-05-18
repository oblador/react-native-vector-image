const fs = require('fs-extra');
const path = require('path');

const awaitStream = (stream) =>
  new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

const outputStream = async (stream, targetPath) => {
  fs.ensureDirSync(path.dirname(targetPath));
  const output = fs.createWriteStream(targetPath);
  stream.pipe(output);
  await Promise.all([stream, output].map(awaitStream));
};

const readStream = async (stream) => {
  const bufs = [];
  stream.on('data', (d) => bufs.push(d));
  await awaitStream(stream);
  return Buffer.concat(bufs);
};

module.exports = {
  outputStream,
  readStream,
};
