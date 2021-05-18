const fs = require('fs-extra');
const path = require('path');
const convertSvgToPdf = require('./convertSvgToPdf');
const { outputStream } = require('./streams');

async function generateIosAsset(source, resourceName, output) {
  const { light, dark, width, height } = source;
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
  const size = [width, height];

  await outputStream(
    convertSvgToPdf(light, size),
    path.join(xcassetPath, 'light.pdf')
  );
  if (dark) {
    await outputStream(
      convertSvgToPdf(dark, size),
      path.join(xcassetPath, 'dark.pdf')
    );
  }
}

module.exports = generateIosAsset;
