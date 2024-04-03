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

const PageTitle = (props: Props) => {
  const {style, isTitle, textKey, ...restProps} = props;

  return (
    <Text
      allowFontScaling={false}
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

export default React.memo(PageTitle);

const styles = StyleSheet.create({
  text: {
    color: COLORS.black,
  },
  title: {
    backgroundColor: COLORS.white,
    fontWeight: '700',
    fontSize: 24,
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
});
