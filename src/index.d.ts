import * as React from 'react';
import { ImageProps, ImageRequireSource } from 'react-native';

export interface VectorImageProps extends ImageProps {
  /**
   * The image source, must be a local .svg asset.
   */
  source: ImageRequireSource;
}

declare const VectorImage: React.FunctionComponent<VectorImageProps>;

export default VectorImage;
