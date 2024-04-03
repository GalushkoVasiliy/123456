import React from 'react';
import {View, ViewProps} from 'react-native';

const HView = ({children, style, ...rest}: ViewProps) => {
  return (
    <View style={[{flexDirection: 'row', gap: 16}, style]} {...rest}>
      {children}
    </View>
  );
};

export default HView;
