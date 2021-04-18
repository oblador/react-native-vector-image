const fs = require('fs');
const path = require('path');
const convertSvgToVd = require('./convertSvgToVd');
const resolveAssetSources = require('./resolveAssetSources');

async function generateAndroidAsset(asset, resourceName, outputDir) {
  const { light, dark } = resolveAssetSources(asset);

  await convertSvgToVd(
    light,
    path.join(outputDir, 'drawable', `${resourceName}.xml`)
  );
  if (dark) {
    await convertSvgToVd(
      dark,
      path.join(outputDir, 'drawable-night', `${resourceName}.xml`)
    );
  }
}

module.exports = generateAndroidAsset;
