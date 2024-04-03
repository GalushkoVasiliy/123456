import React, {useRef, memo} from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../config/COLORS';
import IconComponent from './IconComponent';
import CloseIcon from '../assets/icons/Close';

interface Props extends TextInputProps {
  onClear?: () => void;
}

const SearchField = ({style, onClear, value, ...props}: Props) => {
  const inputRef = useRef<TextInput>(null);

  const onInputFocus = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable style={styles.inputContainer} onPress={onInputFocus}>
        <IconComponent iconName="search" color={COLORS.black} size={20} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={value}
          placeholderTextColor={COLORS.gray}
          placeholder="Search..."
          autoCapitalize="none"
          {...props}
        />
        {value && value.length > 0 && onClear && (
          <TouchableOpacity onPress={onClear}>
            <CloseIcon height={20} width={20} />
          </TouchableOpacity>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderColor: COLORS.gray,
    // borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 15,
    gap: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: COLORS.black,
  },
});

export default memo(SearchField);
