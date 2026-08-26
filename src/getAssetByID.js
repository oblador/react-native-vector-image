function resolveGetAssetByID() {
  try {
    const { AssetRegistry } = require('react-native');
    if (AssetRegistry) {
      return AssetRegistry.getAssetByID;
    }
  } catch {}

  try {
    return require('@react-native/assets-registry/registry').getAssetByID;
  } catch {}

  return undefined;
}

const getAssetByIDImpl = resolveGetAssetByID();

function getAssetByID(assetId) {
  if (!getAssetByIDImpl) {
    throw new Error(
      'No asset registry found. Upgrade to React Native 0.87 or newer, or install @react-native/assets-registry.'
    );
  }
  return getAssetByIDImpl(assetId);
}

module.exports = getAssetByID;
