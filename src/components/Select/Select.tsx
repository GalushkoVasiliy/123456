import React, {forwardRef} from 'react';
import SelectDropdown, {
  SelectDropdownProps,
} from 'react-native-select-dropdown';
import {StyleSheet} from 'react-native';
import COLORS from '../../config/COLORS';
import IconComponent from '../IconComponent';

const Select = forwardRef<SelectDropdown, SelectDropdownProps>((props, ref) => {
  return (
    <SelectDropdown
      ref={ref}
      buttonStyle={styles.btn}
      renderDropdownIcon={() => (
        <IconComponent size={12} color={COLORS.black} iconName={'caret-down'} />
      )}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderWidth: 1,
    // borderRadius: 4,
  },
});

export default Select;
