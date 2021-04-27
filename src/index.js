import React from 'react';
import AssetRegistry from 'react-native/Libraries/Image/AssetRegistry';
import { VectorImageCompat } from './VectorImageCompat';
import getResourceName from './getResourceName';

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
