/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';

const GreetingCard = () => {
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
      }}
    />
  );
};

export default React.memo(GreetingCard);
