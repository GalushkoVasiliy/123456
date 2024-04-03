import React from 'react';
import {View, ViewProps} from 'react-native';

const VView = ({children, style, ...rest}: ViewProps) => {
  return (
    <View style={style} {...rest}>
      {children}
    </View>
  );
};

export default VView;
