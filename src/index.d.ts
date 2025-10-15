import * as React from 'react';
import { ImageProps, ImageRequireSource } from 'react-native';

export interface VectorImageProps extends ImageProps {
  /**
   * The image source, must be a local .svg asset.
   */
  source: ImageRequireSource;
}

export function resolveVectorAssetSource(source: ImageRequireSource): { uri: string; width: number; height: number } | null;

declare const VectorImage: React.FunctionComponent<VectorImageProps> & {
  resolveAssetSource: typeof resolveVectorAssetSource;
};

export default VectorImage;
