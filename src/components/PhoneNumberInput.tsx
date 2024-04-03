import React, {forwardRef, ReactNode} from 'react';
import {StyleSheet, Text, TextInputProps, View} from 'react-native';
import COLORS from '../config/COLORS';
import PhoneInput from 'react-native-phone-input';

interface Props {
  label: ReactNode;
  labelRight?: ReactNode;
  isError?: boolean;
  error?: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  value: string;
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  returnKeyType?: TextInputProps['returnKeyType'];
}

const PhoneNumberInput = forwardRef<PhoneInput, Props>(
  (
    {
      label,
      error,
      isError,
      labelRight,
      onChange,
      onBlur,
      value,
      onSubmitEditing,
      returnKeyType,
    },
    ref,
  ) => {
    const onChangeText = (text: string) => {
      if (/^\+?\d*$/.test(text) && text.length <= 14) {
        onChange(text);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {labelRight}
        </View>

        <PhoneInput
          ref={ref}
          // onChangePhoneNumber={handleChange}
          allowZeroAfterCountryCode
          initialCountry="gb"
          countriesList={[
            {
              name: 'United Kingdom',
              iso2: 'gb',
              dialCode: '44',
              priority: 1,
              areaCodes: null,
            },
          ]}
          style={styles.input}
          textProps={{
            style: {color: COLORS.black, height: 50},
            onSubmitEditing,
            returnKeyType,
            onBlur,
            keyboardType: 'number-pad',
            onChangeText: onChangeText,
            ...(!!value && {value}),
          }}
        />

        {isError && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    height: 90,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: COLORS.gray,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 50,
    borderColor: COLORS.gray,
    color: COLORS.black,
  },
  inputError: {
    borderColor: COLORS.red,
  },
  error: {
    color: COLORS.red,
    fontSize: 14,
  },
});

export default PhoneNumberInput;
