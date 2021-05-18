const fs = require('fs-extra');
const path = require('path');
const { PassThrough } = require('stream');
const execa = require('execa');
const tempy = require('tempy');
const chroma = require('chroma-js');
const { TransformationError, InputError } = require('./errors');

const svg2VdErrorPattern = /^Command failed.*: java -jar/;
const illegalStateMarker =
  'Exception in thread "main" java.lang.IllegalStateException: ';
const illegalElementMarker = 'ERROR @ line';

const transformCliError = (error) => {
  if ('message' in error && svg2VdErrorPattern.test(error.message)) {
    const stack = error.message.split('\n').slice(1);
    const [message] = stack;
    if (message.startsWith(illegalStateMarker)) {
      return new InputError(message.substr(illegalStateMarker.length).trim());
    }
    if (message.startsWith(illegalElementMarker)) {
      return new TransformationError(
        stack
          .map((m) => m.trim().replace(/^ERROR @ /, ''))
          .filter(Boolean)
          .join('; ')
      );
    }
  }

  return error;
};

function convertSvgToVd(svgSource) {
  const svg2vdBin = path.join(
    path.dirname(path.dirname(__dirname)),
    'bin',
    'svg2vd-0.1.jar'
  );

  // svg2vd doesn't support output path, so we will have to emulate it
  const outputDir = tempy.directory({ prefix: 'vd_' });
  const sourcePath = path.join(outputDir, 'image.svg');
  const outputPath = path.join(outputDir, 'image.xml');

  fs.writeFileSync(
    sourcePath,
    svgSource.replace(
      /rgba\([0-9]+,\s*[0-9]+,\s*[0-9]+,\s*(1|[0-9]*\.[0-9]+)\)/g,
      (match) => chroma(match).hex()
    )
  );

  const stream = new PassThrough();
  execa('java', ['-jar', svg2vdBin, sourcePath, outputDir])
    .then(() => {
      const readStream = fs.createReadStream(outputPath);
      readStream.on('open', () => {
        readStream.pipe(stream);
      });
      readStream.on('close', () => {
        fs.removeSync(outputDir);
      });
    })
    .catch((error) => {
      try {
        fs.removeSync(outputDir);
      } finally {
        stream.emit('error', transformCliError(error));
        stream.resume();
        stream.end();
      }
      return null;
    });
  return stream;
}

module.exports = convertSvgToVd;
