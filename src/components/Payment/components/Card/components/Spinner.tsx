import React from 'react';
import {StyleSheet, ActivityIndicator, View} from 'react-native';
import {UIComponentProps} from './types';
import COLORS from '../../../../../config/COLORS';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

interface SpinnerProps extends UIComponentProps {
  show: boolean;
}

const Spinner = (props: SpinnerProps) => {
  return (
    <View style={[styles.container]} testID={props.testID}>
      <ActivityIndicator
        animating={props.show}
        size="large"
        color={COLORS.black}
      />
    </View>
  );
};

export default Spinner;
