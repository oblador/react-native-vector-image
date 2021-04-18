import React from 'react';
import AssetRegistry from 'react-native/Libraries/Image/AssetRegistry';
import { VectorImageCompat } from './VectorImageCompat';

function getResourceName(asset) {
  return `${asset.name.replace(
    /[^a-z0-9_]+/g,
    '_'
  )}_codegen_${asset.hash.substr(0, 6)}`;
}

export default function VectorImage({ source, style, ...props }) {
  const asset = AssetRegistry.getAssetByID(source);
  if (!asset) {
    console.warn(
      `No asset registered for source "${source}", you may have to generate assets and recompile`
    );
    return null;
  }
  const resourceName = getResourceName(asset);
  return (
    <VectorImageCompat
      source={{ uri: resourceName }}
      style={[{ width: asset.width, height: asset.height }, style]}
      {...props}
    />
  );
}
