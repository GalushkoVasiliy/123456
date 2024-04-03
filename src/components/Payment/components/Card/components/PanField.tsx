import React, {useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import commonStyles from './common-styles';
import {UIComponentProps} from './types';
import COLORS from '../../../../../config/COLORS';

const styles = StyleSheet.create({
  pan: {
    flex: 8,
    marginRight: 5,
    borderWidth: 1,
    borderColor: COLORS.gray,
    padding: 10,
    height: 50,
  },
});

interface PanFieldProps extends UIComponentProps {
  isEditable: boolean;
  isValid: boolean;
  onChange(text: string): void;
}

const PanField = (props: PanFieldProps) => {
  const [panValue, setPan] = useState<string>('');

  return (
    <TextInput
      nativeID="panInput"
      testID={props.testID}
      style={[
        styles.pan,
        !props.isEditable
          ? commonStyles.greyedOut
          : props.isValid
          ? commonStyles.valid
          : commonStyles.invalid,
      ]}
      keyboardType="numeric"
      onChangeText={text => {
        setPan(text);
        props.onChange(text);
      }}
      editable={props.isEditable}
      value={panValue}
      placeholder="Card Number"
      placeholderTextColor={COLORS.gray}
    />
  );
};

export default PanField;
