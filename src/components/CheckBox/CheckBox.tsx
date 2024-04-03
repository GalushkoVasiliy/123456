import React, {ReactNode} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  ViewProps,
  Text,
  TextStyle,
} from 'react-native';
import COLORS from '../../config/COLORS';
import IconComponent from '../IconComponent';

interface Props {
  checked: boolean;
  leftLabel?: ReactNode;
  rightLabel?: ReactNode;
  onPress?: () => void;
  style?: ViewProps['style'];
  labelStyle?: TextStyle;
  type?: 'radio' | 'checkbox';
}

const size = 16;

const CheckBox = ({
  checked,
  leftLabel,
  rightLabel,
  onPress,
  style,
  labelStyle,
  type = 'radio',
}: Props) => {
  return (
    <Pressable onPress={onPress} style={[styles.controller, style]}>
      {!!leftLabel && (
        <Text style={[styles.label, labelStyle]}>{leftLabel}</Text>
      )}

      {type === 'radio' && (
        <View style={styles.radioContainer}>
          <View style={[styles.radio, checked && styles.checked]} />
        </View>
      )}

      {type === 'checkbox' && (
        <View style={[styles.checkboxContainer, checked && styles.checked]}>
          <IconComponent
            size={size * 0.75}
            color={COLORS.white}
            iconName="check"
          />
        </View>
      )}

      {!!rightLabel && (
        <Text style={[styles.label, labelStyle]}>{rightLabel}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  controller: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: COLORS.black,
  },
  radioContainer: {
    borderRadius: size / 2,
    height: size,
    width: size,
    borderColor: COLORS.black,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    height: size,
    width: size,
    borderColor: COLORS.black,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    height: size / 2,
    width: size / 2,
    borderRadius: size / 4,
  },
  checked: {
    backgroundColor: COLORS.black,
  },
});

export default CheckBox;
