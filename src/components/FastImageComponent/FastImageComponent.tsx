import React from 'react';

/* MODULES */
import FastImage from 'react-native-fast-image';
import {ImageStyle} from 'react-native';
import COLORS from '../../config/COLORS';

interface Props {
  width?: number;
  height?: number;
  uri: string | any;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
  borderRadius?: number;
  style: ImageStyle;
}

const FastImageComponent: React.FunctionComponent<Props> = ({
  width,
  height,
  borderRadius,
  uri,
  resizeMode,
  style,
}) => {
  const source = typeof uri === 'string' ? {uri} : uri;

  return (
    <FastImage
      style={[
        {
          borderRadius,
          height,
          width,
        },
        {
          backgroundColor: COLORS.white
        },
        style,
      ]}
      source={source}
      borderRadius={borderRadius || 0}
      blurRadius={1}
      cacheControl="immutable"
      resizeMode={resizeMode || FastImage.resizeMode.cover}
    />
  );
};

export default React.memo(FastImageComponent);
