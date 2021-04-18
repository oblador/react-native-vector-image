const fs = require('fs-extra');
const path = require('path');
const convertSvgToPdf = require('./convertSvgToPdf');
const resolveAssetSources = require('./resolveAssetSources');

async function generateIosAsset(asset, resourceName, output) {
  const { light, dark } = resolveAssetSources(asset);
  const xcassetPath = path.join(output, `${resourceName}.imageset`);

  const xcasset = {
    images: [
      {
        filename: 'light.pdf',
        idiom: 'universal',
      },
      dark && {
        appearances: [
          {
            appearance: 'luminosity',
            value: 'dark',
          },
        ],
        filename: 'dark.pdf',
        idiom: 'universal',
      },
    ].filter(Boolean),
    info: {
      author: 'xcode',
      version: 1,
    },
    properties: {
      'preserves-vector-representation': true,
    },
  };

  fs.outputJsonSync(path.join(xcassetPath, 'Contents.json'), xcasset, {
    spaces: 2,
  });
  const size = [asset.width, asset.height];
  await convertSvgToPdf(light, path.join(xcassetPath, 'light.pdf'), size);
  if (dark) {
    await convertSvgToPdf(dark, path.join(xcassetPath, 'dark.pdf'), size);
  }
}

module.exports = generateIosAsset;
