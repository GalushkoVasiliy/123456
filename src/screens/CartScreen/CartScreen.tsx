import React from 'react';
import {View} from 'react-native';
import Cart from '../../components/Cart/Cart';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import PageTitle from '../../components/PageTitle';

const CartScreen = () => {
  const {navigate} = useNavigation();

  const onContinue = () => {
    navigate('Home');
  };

  return (
    <View style={{flex: 1}}>
      <Header backFalse />
      <PageTitle isTitle textKey="Basket" />
      <Cart onContinue={onContinue} />
    </View>
  );
};

export default CartScreen;
