import React, {ReactNode} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../config/COLORS';
import LoaderIcon from '../assets/icons/loader';

interface Props extends TouchableOpacityProps {
  label: ReactNode;
  color?: 'black' | 'blue' | 'red' | 'grey' | 'green';
  labelStyle?: TextStyle;
  isLoading?: boolean;
}

const CustomButton = ({
  onPress,
  disabled,
  label,
  style,
  labelStyle,
  color = 'black',
  isLoading,
}: Props) => {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        color === 'black' && styles.btnBlack,
        color === 'blue' && styles.btnBlue,
        color === 'red' && styles.btnRed,
        color === 'grey' && styles.btnGrey,
        color === 'green' && styles.btnGreen,
        disabled && styles.btnDisabled,
        style,
      ]}
      disabled={isLoading || disabled}
      onPress={onPress}>
      {isLoading ? (
        <LoaderIcon color={COLORS.white} />
      ) : (
        <Text
          style={[
            styles.btnLabel,
            color === 'red' && styles.btnLabelRed,
            color === 'grey' && styles.btnLabelGrey,
            labelStyle,
          ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 8,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnBlack: {
    backgroundColor: COLORS.black,
  },
  btnBlue: {
    backgroundColor: COLORS.lightBlue,
  },
  btnRed: {
    backgroundColor: 'transparent',
  },
  btnGrey: {
    backgroundColor: COLORS.alto,
  },
  btnGreen: {
    backgroundColor: COLORS.green,
  },
  btnLabel: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  btnLabelRed: {
    color: COLORS.red,
  },
  btnLabelGrey: {
    color: COLORS.black,
  },
});

export default CustomButton;
