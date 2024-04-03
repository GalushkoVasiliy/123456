import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {UIComponentProps} from './types';

const styles = StyleSheet.create({
  logo: {
    borderRadius: 5,
    flex: 1,
    resizeMode: 'center',
  },
});

interface CardBrandImageProps extends UIComponentProps {
  logo: string;
}

const CardBrandImage = (props: CardBrandImageProps) => {
  return (
    <Image
      testID={props.testID}
      style={styles.logo}
      source={{
        uri: props.logo,
      }}
    />
  );
};

export default CardBrandImage;
