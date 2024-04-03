import {StyleSheet, Text, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import COLORS from '../../../config/COLORS';

interface Props {
  onPress: () => void;
  label: string;
  count: string | number;
  activeOpacity?: number;
  style?: ViewStyle;
}

const FilterItem = ({onPress, label, count, activeOpacity, style}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity}
      style={[styles.container, style]}
      onPress={onPress}>
      <Text style={styles.label}>
        {label}
        {'  '}
        <Text style={styles.count}>{count}</Text>
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    color: COLORS.grayDark,
    fontSize: 16,
    gap: 8,
  },
  count: {
    color: COLORS.black,
    fontWeight: '700',
    fontSize: 14,
  },
});

export default FilterItem;
