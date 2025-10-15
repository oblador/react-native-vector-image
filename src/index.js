import React from 'react';
import { Image } from 'react-native';
import { getAssetByID } from '@react-native/assets-registry/registry';
import getResourceName from './getResourceName';

export function resolveVectorAssetSource(source) {
  const asset = getAssetByID(source);
  if (!asset) {
    return null;
  }
  const resourceName = getResourceName(asset);
  return { uri: resourceName,width: asset.width, height: asset.height }
}

export default function VectorImage({ source, ...props }) {
  const asset = resolveVectorAssetSource(source);
  if (!asset) {
    console.warn(
      `No asset registered for source "${source}", you may have to generate assets and recompile`
    );
    return null;
  }

  return (
    <Image source={asset} {...props} />
  );
}

VectorImage.resolveAssetSource = resolveVectorAssetSource;
