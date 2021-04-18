const fs = require('fs');

function resolveAssetSources(asset) {
  const [light] = asset.files;
  const dark = light.replace(/\.svg$/, '.dark.svg');
  if (fs.existsSync(dark)) {
    return { light, dark };
  }
  return { light };
}

module.exports = resolveAssetSources;
