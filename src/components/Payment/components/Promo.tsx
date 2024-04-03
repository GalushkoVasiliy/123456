import React, {useEffect, useRef, useState} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import COLORS from '../../../config/COLORS';
import Button from '../../button';
import {connect} from 'react-redux';
import {ReducerType} from '../../../redux/reducers/reducers';
import {
  add_coupon,
  delete_coupon,
  get_coupon,
} from '../../../redux/actions/checkout.actions';

type CouponType = ReducerType['checkout']['coupon'];

interface Props {
  coupon: CouponType;
  addCoupon: (code: string) => Promise<string>;
  getCoupon: () => Promise<string | string[]>;
  deleteCoupon: () => Promise<void>;
}

const Promo = ({coupon, addCoupon, deleteCoupon, getCoupon}: Props) => {
  const inputRef = useRef<TextInput>(null);
  const [promoCode, setPromoCode] = useState<CouponType>('');

  useEffect(() => {
    getCoupon().then(code => {
      if (typeof code === 'string') {
        setPromoCode(code);
      } else {
        setPromoCode('');
      }
    });
  }, [getCoupon]);

  const onAddCoupon = () => {
    addCoupon(encodeURIComponent(promoCode));
  };

  const onDeleteCoupon = () => {
    deleteCoupon().then(() => {
      setPromoCode('');
      inputRef.current?.focus();
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        autoCapitalize="none"
        style={[styles.input, !!coupon && styles.coupon]}
        value={promoCode}
        editable={!coupon}
        onChangeText={text => setPromoCode(text)}
      />
      <Button
        style={styles.btn}
        label={!coupon ? 'Apply' : 'Cancel'}
        onPress={!coupon ? onAddCoupon : onDeleteCoupon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 50,
    borderColor: COLORS.gray,
    color: COLORS.black,
  },
  coupon: {
    backgroundColor: '#eeeeee',
  },
  btn: {
    width: 100,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    addCoupon: (code: string) => dispatch(add_coupon(code)),
    getCoupon: () => dispatch(get_coupon()),
    deleteCoupon: () => dispatch(delete_coupon()),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    coupon: state.checkout.coupon,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Promo));
