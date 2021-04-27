const fs = require('fs-extra');
const path = require('path');
const generateIosAsset = require('./generateIosAsset');
const generateAndroidAsset = require('./generateAndroidAsset');
const getAssets = require('./getAssets');
const getResourceName = require('../getResourceName');

async function removeGeneratedAssets(directory) {
  const exists = await fs.exists(directory);
  if (!exists) {
    return;
  }
  const contents = await fs.readdir(directory);
  await Promise.all(
    contents
      .filter((name) =>
        /._(svg|codegen)_[a-z0-9]{6}\.(imageset|xml)$/.test(name)
      )
      .map((name) => fs.remove(path.join(directory, name)))
  );
}

async function generateAssets({
  iosOutput,
  androidOutput,
  config,
  entryFile,
  resetCache,
}) {
  const assets = await getAssets({ config, entryFile, resetCache });

  if (iosOutput) {
    await removeGeneratedAssets(iosOutput);
  }
  if (androidOutput) {
    await removeGeneratedAssets(path.join(androidOutput, 'drawable'));
    await removeGeneratedAssets(path.join(androidOutput, 'drawable-night'));
  }

  await Promise.all(
    assets
      .filter((asset) => asset.type === 'svg')
      .map(async (asset) => {
        const resourceName = getResourceName(asset);

        const [scale] = asset.scales;
        if (scale !== 1) {
          throw new Error(
            `Unexpected scale for ${
              asset.name
            }, expected 1 got ${JSON.stringify(scale)}`
          );
        }

        if (iosOutput) {
          await generateIosAsset(asset, resourceName, iosOutput);
        }
        if (androidOutput) {
          await generateAndroidAsset(asset, resourceName, androidOutput);
        }
      })
  );
}

module.exports = generateAssets;
