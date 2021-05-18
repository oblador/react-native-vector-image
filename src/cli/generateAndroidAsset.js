const path = require('path');
const convertSvgToVd = require('./convertSvgToVd');
const { outputStream } = require('./streams');

async function generateAndroidAsset(source, resourceName, outputDir) {
  const { light, dark } = source;

  await outputStream(
    convertSvgToVd(light),
    path.join(outputDir, 'drawable', `${resourceName}.xml`)
  );
  if (dark) {
    await outputStream(
      convertSvgToVd(dark),
      path.join(outputDir, 'drawable-night', `${resourceName}.xml`)
    );
  }
}

module.exports = generateAndroidAsset;
