const fs = require('fs-extra');
const execa = require('execa');
const tempy = require('tempy');
const path = require('path');

async function convertSvgToVd(sourcePath, targetPath) {
  const svg2vdBin = path.join(
    path.dirname(path.dirname(__dirname)),
    'bin',
    'svg2vd-0.1.jar'
  );
  // svg2vd doesn't support output path, so we will have to emulate it
  const outputDir = tempy.directory({ prefix: 'vd_' });
  const outputPath = path.join(
    outputDir,
    `${path.basename(sourcePath, '.svg')}.xml`
  );
  const prc = execa('java', ['-jar', svg2vdBin, sourcePath, outputDir]);
  prc.stdout.pipe(process.stdout);
  await prc;
  await fs.move(outputPath, targetPath);
  await fs.remove(outputDir);
}

module.exports = convertSvgToVd;
