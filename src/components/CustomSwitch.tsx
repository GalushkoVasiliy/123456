import React from 'react';
import {Platform, Switch, SwitchProps} from 'react-native';
import COLORS from '../config/COLORS';

const CustomSwitch = ({style, ...props}: SwitchProps) => {
  return (
    <Switch
      style={[
        {
          ...(Platform.OS === 'ios' && {
            transform: [{scaleX: 0.6}, {scaleY: 0.6}],
          }),
        },
        style,
      ]}
      trackColor={{false: COLORS.gray, true: COLORS.green}}
      thumbColor={props.value ? COLORS.darkGreen : COLORS.grayDark}
      {...props}
    />
  );
};

export default CustomSwitch;
