import React, {ReactNode, forwardRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import COLORS from '../../config/COLORS';

interface InputComponentProps extends TextInputProps {
  label: ReactNode;
  labelRight?: ReactNode;
  isError?: boolean;
  error?: string;
  containerStyle?: ViewStyle;
}

const InputComponent = forwardRef<TextInput, InputComponentProps>(
  ({label, labelRight, isError, error, containerStyle, ...rest}, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {labelRight}
        </View>

        <TextInput
          style={[styles.input, isError && styles.inputError]}
          ref={ref}
          {...rest}
        />
        {isError && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    minHeight: 90,
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
    width: '100%',
    flexWrap: 'wrap',
  },
});

export default InputComponent;
