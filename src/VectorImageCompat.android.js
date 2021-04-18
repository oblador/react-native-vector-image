import React from 'react';
import VectorDrawable from '@klarna/react-native-vector-drawable';

export function VectorImageCompat({ source, ...props }) {
  return <VectorDrawable resourceName={source.uri} {...props} />;
}
