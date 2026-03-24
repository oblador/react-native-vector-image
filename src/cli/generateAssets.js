const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const generateIosAsset = require('./generateIosAsset');
const generateAndroidAsset = require('./generateAndroidAsset');
const getAssets = require('./getAssets');
const getResourceName = require('../getResourceName');
const resolveAssetSources = require('./resolveAssetSources');
const readSvgAsset = require('./readSvgAsset');
const { InputError, TransformationError } = require('./errors');

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
  bundleWithExpo,
  config,
  entryFile,
  resetCache,
  currentColor,
  currentColorDark,
}) {
  const assets = await getAssets(
    { config, entryFile, resetCache },
    bundleWithExpo
  );

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
        const { light, dark } = resolveAssetSources(asset);
        try {
          const [scale] = asset.scales;
          if (scale !== 1) {
            throw new InputError(
              `Unexpected scale, expected 1 got ${JSON.stringify(scale)}`
            );
          }

          const resourceName = getResourceName(asset);
          const source = {
            light: readSvgAsset(light, currentColor),
            dark: dark && readSvgAsset(dark, currentColorDark),
            width: asset.width,
            height: asset.height,
          };
          if (iosOutput) {
            await generateIosAsset(source, resourceName, iosOutput);
          }
          if (androidOutput) {
            await generateAndroidAsset(source, resourceName, androidOutput);
          }
        } catch (error) {
          if (
            error instanceof InputError ||
            error instanceof TransformationError
          ) {
            error.file = light;
          }
          throw error;
        }
      })
  );

  // Clear Metro's cache after generating native assets so the dev server
  // recomputes asset hashes to match the regenerated native resources.
  // Without this, a stale Metro cache can serve an old content hash after
  // SVG files change (e.g. after a rebase), causing "Could not find image"
  // warnings at runtime.
  const metroCacheDir = path.join(os.tmpdir(), 'metro-cache');
  await fs.remove(metroCacheDir);
}

module.exports = generateAssets;
