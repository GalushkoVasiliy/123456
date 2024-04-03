import React from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import COLORS from '../config/COLORS';
import i18next from '../locales';

interface Props {
  children?: string;
  textKey: string;
  style?: TextStyle;
  isTitle?: boolean;
  numberOfLines?: number;
}

const BaseText = (props: Props) => {
  const {style, isTitle, textKey, ...restProps} = props;

  return (
    <Text
      allowFontScaling={false}
      numberOfLines={1}
      ellipsizeMode="tail"
      {...restProps}
      style={[
        styles.text,
        isTitle && styles.title,
        ...(Array.isArray(style) ? style : [style]),
      ]}>
      {i18next.t(textKey)}
    </Text>
  );
};

export default React.memo(BaseText);

const styles = StyleSheet.create({
  text: {
    color: COLORS.black,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
  },
});
