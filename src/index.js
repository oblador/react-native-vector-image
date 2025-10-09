import React from 'react';
import { Image } from 'react-native';
import { getAssetByID } from '@react-native/assets-registry/registry';
import getResourceName from './getResourceName';

export default function VectorImage({ source, style, ...props }) {
  const asset = getAssetByID(source);
  if (!asset) {
    console.warn(
      `No asset registered for source "${source}", you may have to generate assets and recompile`
    );
    return null;
  }
  const resourceName = getResourceName(asset);
  return (
    <Image
      source={{ uri: resourceName }}
      style={[{ width: asset.width, height: asset.height }, style]}
      {...props}
    />
  );
}
