import React, {useEffect, useMemo, useRef, useState} from 'react';
import {LogBox, Platform, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView, FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import COLORS from '../../config/COLORS';
import {ReducerType} from '../../redux/reducers/reducers';
import IconComponent from '../IconComponent';
import styles from './styles';
import StoreForm from './components/StoreForm';
import DeliverForm from './components/DeliverForm';
import {
  DeliveryOptions,
  set_delivery_option,
} from '../../redux/actions/checkout.actions';
import KeyboardAvoid from '../KeyboardAvoid';

interface Props {
  set_delivery_option: (deliveryOption: DeliveryOptions) => void;
  cart: ReducerType['cart'];
  giftInformation?: {
    gift_products?: string[];
    is_gift_product_already_added?: boolean;
  };
}

const Checkout = (props: Props) => {
  const scrollRef = useRef<FlatList>(null);
  const isGiftAdded = useMemo(() => {
    return !!props.cart.cart?.extension_attributes.gift_information
      ?.is_gift_product_already_added;
  }, [
    props.cart.cart?.extension_attributes.gift_information
      ?.is_gift_product_already_added,
  ]);

  const [selectedMethod, setSelectedMethod] = useState<DeliveryOptions>(
    isGiftAdded ? DeliveryOptions.deliver : DeliveryOptions.store,
  );

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  useEffect(() => {
    props.set_delivery_option(selectedMethod);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMethod]);

  const onSelectDeliveryMethod = (method: DeliveryOptions) => {
    setSelectedMethod(method);
  };

  const onScrollTop = () => {
    scrollRef.current?.scrollToOffset({
      offset: 250,
      animated: true,
    });
  };

  const onScrollBottom = () => {
    scrollRef.current?.scrollToEnd({
      animated: true,
    });
  };

  return (
    <KeyboardAvoid keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 120}>
      <FlatList
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        keyboardShouldPersistTaps={'handled'}
        data={[]}
        renderItem={null}
        ListFooterComponent={
          <View style={styles.container}>
            <Text style={styles.title}>Select Your Delivery Method</Text>
            <View style={styles.deliveryContainer}>
              <TouchableOpacity
                style={[
                  styles.deliveryBtn,
                  selectedMethod === DeliveryOptions.store &&
                    styles.deliveryBtnSelected,
                ]}
                disabled={isGiftAdded}
                onPress={() => onSelectDeliveryMethod(DeliveryOptions.store)}>
                <IconComponent
                  size={30}
                  color={
                    selectedMethod === DeliveryOptions.store
                      ? COLORS.black
                      : COLORS.gray
                  }
                  iconName={'shopping-bag'}
                />
                <Text
                  style={[
                    styles.deliveryLabel,
                    selectedMethod === DeliveryOptions.store &&
                      styles.deliveryLabelSelected,
                  ]}>
                  Click & Collect from a store
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.deliveryBtn,
                  selectedMethod === DeliveryOptions.deliver &&
                    styles.deliveryBtnSelected,
                ]}
                onPress={() => onSelectDeliveryMethod(DeliveryOptions.deliver)}>
                <IconComponent
                  size={30}
                  color={
                    selectedMethod === DeliveryOptions.deliver
                      ? COLORS.black
                      : COLORS.gray
                  }
                  iconName={'truck'}
                />
                <Text
                  style={[
                    styles.deliveryLabel,
                    selectedMethod === DeliveryOptions.deliver &&
                      styles.deliveryLabelSelected,
                  ]}>
                  Deliver to a Specified Address
                </Text>
              </TouchableOpacity>
            </View>

            {selectedMethod === DeliveryOptions.store && (
              <StoreForm
                deliveryMethod={selectedMethod}
                onScrollTop={onScrollTop}
                onScrollBottom={onScrollBottom}
              />
            )}

            {selectedMethod === DeliveryOptions.deliver && (
              <DeliverForm
                deliveryMethod={selectedMethod}
                onScrollBottom={onScrollBottom}
                isGiftAdded={isGiftAdded}
              />
            )}
          </View>
        }
      />
    </KeyboardAvoid>
  );
};

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    set_delivery_option: (deliveryOption: DeliveryOptions) =>
      dispatch(set_delivery_option(deliveryOption)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    cart: state.cart,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
