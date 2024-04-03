import React, {useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import commonStyles from './common-styles';
import {UIComponentProps} from './types';
import COLORS from '../../../../../config/COLORS';

const styles = StyleSheet.create({
  expiry: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 10,
    height: 50,
  },
});

interface ExpiryDateFieldProps extends UIComponentProps {
  isEditable: boolean;
  isValid: boolean;

  onChange(text: string): void;
}

const ExpiryDateField = (props: ExpiryDateFieldProps) => {
  const [expiryValue, setExpiry] = useState<string>('');

  return (
    <TextInput
      nativeID="expiryDateInput"
      testID={props.testID}
      style={[
        styles.expiry,
        !props.isEditable
          ? commonStyles.greyedOut
          : props.isValid
          ? commonStyles.valid
          : commonStyles.invalid,
      ]}
      keyboardType="numeric"
      onChangeText={text => {
        setExpiry(text);
        props.onChange(text);
      }}
      editable={props.isEditable}
      value={expiryValue}
      placeholder="MM/YY"
      placeholderTextColor={COLORS.gray}
    />
  );
};

export default ExpiryDateField;
