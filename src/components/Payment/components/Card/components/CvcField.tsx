import React, {useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';

import commonStyles from './common-styles';
import {UIComponentProps} from './types';
import COLORS from '../../../../../config/COLORS';

const styles = StyleSheet.create({
  cvc: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 10,
    height: 50,
  },
});

interface CvcFieldProps extends UIComponentProps {
  isEditable: boolean;
  isValid: boolean;
  onChange(text: string): void;
}

const CvcField = (props: CvcFieldProps) => {
  const [cvcValue, setCvc] = useState<string>('');

  return (
    <TextInput
      nativeID="cvcInput"
      testID={props.testID}
      style={[
        styles.cvc,
        props.isValid ? commonStyles.valid : commonStyles.invalid,
        !props.isEditable
          ? commonStyles.greyedOut
          : props.isValid
          ? commonStyles.valid
          : commonStyles.invalid,
      ]}
      keyboardType="numeric"
      onChangeText={text => {
        setCvc(text);
        props.onChange(text);
      }}
      editable={props.isEditable}
      value={cvcValue}
      placeholder="CVC"
      placeholderTextColor={COLORS.gray}
    />
  );
};

export default CvcField;
