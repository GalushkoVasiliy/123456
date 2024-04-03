/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Switch,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import COLORS from '../../config/COLORS';
import {
  get_cart,
  get_cart_total,
  remove_item_from_cart,
  RemoveType,
} from '../../redux/actions/cart.actions';
import {ReducerType} from '../../redux/reducers/reducers';
import {CLEAR_CART} from '../../redux/const';
import {API} from '../../config/CONSTANTS';
import FastImageComponent from '../FastImageComponent/FastImageComponent';
import {get_products_by_sku} from '../../redux/actions/products.actions';
import {
  get_reward_balance,
  use_reward_points,
  remove_reward_points,
} from '../../redux/actions/rewards.actions';
import {DROPDOWN_PAGES, DropDownContext} from '../../utils/dropdown-context';
import CustomButton from '../button';
import {navigate} from '../../navigation/RootNavigator';
import {get_profile} from '../../redux/actions/auth.actions';
import {CustomerToken} from '../../redux/reducers/authReducer';
import {Item} from '../../redux/reducers/cartReducer';
import LoaderIcon from '../../assets/icons/loader';
import CustomSwitch from '../CustomSwitch';

interface CartProps {
  get_cart: () => Promise<any>;
  get_cart_total: () => Promise<any>;
  get_products_by_sku: (value: string[]) => any;
  get_reward_balance: (id: string | number) => void;
  use_reward: (usingRewardPoints: boolean) => Promise<any>;
  remove_item: (item_id: RemoveType) => Promise<any>;
  clear_cart: () => void;
  onContinue?: () => void;
  get_profile: (token: any) => Promise<any>;
  cart: ReducerType['cart'];
  auth: ReducerType['auth'];
  rewards: ReducerType['rewards'];
}

const Cart = (props: CartProps) => {
  const [shippingInfo, setShippingInfo] = useState({});

  const [productImages, setProductImages] = useState<Record<string, any>>({});
  const {toOpen, toClose} = useContext(DropDownContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [disableBtn, setDisableBtn] = useState<(string | number)[]>([]);

  useEffect(() => {
    props.get_cart().then(() => {
      props.get_cart_total();
    });
  }, [props.cart.cartId]);

  useEffect(() => {
    async function reloadProfile() {
      if (props.auth.token) {
        const profile = await props.get_profile(props.auth.token);

        // Customer not logged in, take to home
        if (!profile) {
          navigate('Home');
        }
      }
    }
    reloadProfile();
  }, [props.auth.token]);

  // useEffect(() => {
  //   props.clear_cart();
  // }, []);

  useEffect(() => {
    const skus = props.cart.cart?.items?.map(({sku}) => sku);

    if (skus && skus.length) {
      props.get_products_by_sku(skus).then((items: any[]) => {
        const obj: Record<string, any> = {};
        items.forEach((item: any) => {
          obj[item.sku] = item.media_gallery_entries[0].file;
        });
        setProductImages(obj);
      });
    }
  }, [props.cart.cart]);

  useEffect(() => {
    if (props.auth.token && props.auth.profile?.id) {
      props.get_reward_balance('RR-' + props.auth.profile.id);
    }
  }, [props.auth.token, props.auth.profile?.id]);

  const usingRewardPoints = useMemo(() => {
    return props.cart.total?.extension_attributes?.reward_points_balance > 0;
  }, [props.cart.total]);

  const onChangeRymanPoints = () => {
    setIsLoading(true);
    props.use_reward(usingRewardPoints).finally(() => {
      setIsLoading(false);
    });
  };

  const getShippingData = (): any => {
    if (props.cart && props.cart?.total && props.cart.total?.total_segments) {
      const shipping = props.cart.total?.total_segments.find(
        ({code}: any) => code === 'shipping',
      );
      if (shipping && shipping.title != 'Delivery & Handling') {
        return {
          name: shipping.title.replace(/^.*\(.*-\s(.*)\)$/, '$1'),
          value: shipping.value > 0 ? '£' + shipping.value : 'FREE',
        };
      }
    }
  };

  const getProductImageUrl = (item: Item) => {
    if (item.dnb_image_url) {
      return item.dnb_image_url;
    } else {
      return `${API.imageMock}${productImages[item.sku]}`;
    }
  };

  const onContinueShipping = () => {
    if (toClose && !props.onContinue) {
      toClose();
    }

    if (props.onContinue) {
      props.onContinue();
    }
  };

  const onRemove = (id: number | string) => {
    setDisableBtn(prev => [...prev, id]);
    props.remove_item(id).finally(() => {
      const _disableBtn = [...disableBtn];
      const deleteIndex = _disableBtn.findIndex(item => item === id);
      _disableBtn.splice(deleteIndex, 1);
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        numColumns={1}
        data={props.cart.total?.items}
        renderItem={({item}) => {
          return (
            <View style={styles.product}>
              <FastImageComponent
                height={100}
                width={100}
                resizeMode="contain"
                style={styles.image}
                uri={getProductImageUrl(item)}
              />
              <View style={styles.productDesc}>
                <Text style={styles.name}>{item.name}</Text>

                <View style={styles.priceDesc}>
                  {/*<Text style={styles.price}>*/}
                  {/*  Unit Price: £{item.price?.toFixed(2)}*/}
                  {/*</Text>*/}
                  <Text style={styles.price}>
                    Price: £{item.price_incl_tax?.toFixed(2)}
                  </Text>
                  <Text style={styles.price}>Quantity: {item.qty}</Text>
                  <Button
                    onPress={() => onRemove(item.item_id)}
                    title="Remove"
                    disabled={disableBtn.includes(item.item_id)}
                  />
                </View>
              </View>
            </View>
          );
        }}
      />

      {props.cart.cart?.items && props.cart.cart?.items?.length > 0 ? (
        <View style={{gap: 6, marginTop: 10}}>
          {props.auth.token && (
            <View style={styles.rewardBlock}>
              <View>
                <Text style={styles.total}>Use Ryman Reward Points</Text>
                <Text style={{color: COLORS.gray}}>
                  (You have {props.rewards.balance} Points worth{' '}
                  {(props.rewards.balance / 100).toFixed(2)})
                </Text>
              </View>

              {isLoading ? (
                <LoaderIcon size={14} style={{marginRight: 4}} />
              ) : (
                <CustomSwitch
                  style={{
                    marginRight: Platform.OS === 'ios' ? -12 : -4,
                  }}
                  value={usingRewardPoints}
                  onChange={onChangeRymanPoints}
                />
              )}
            </View>
          )}
          {/*<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>*/}
          {/*  <Text style={styles.total}>Subtotal:</Text>*/}
          {/*  <Text style={styles.total}>*/}
          {/*    £{props.cart.total?.base_subtotal.toFixed(2)}*/}
          {/*  </Text>*/}
          {/*</View>*/}
          {props.cart.total?.base_discount_amount !== 0 && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.total}>Discount:</Text>
              <Text style={styles.total}>
                £{(props.cart.total?.base_discount_amount || 0)?.toFixed(2)}
              </Text>
            </View>
          )}
          {/*<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>*/}
          {/*  <Text style={styles.total}>VAT:</Text>*/}
          {/*  <Text style={styles.total}>*/}
          {/*    £{props.cart.total?.base_tax_amount.toFixed(2)}*/}
          {/*  </Text>*/}
          {/*</View>*/}
          {getShippingData() && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
              <Text style={[styles.total, {flex: 1, flexWrap: 'wrap'}]}>
                {getShippingData().name}:
              </Text>
              <Text style={styles.total}>{getShippingData().value}</Text>
            </View>
          )}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.total}>Total:</Text>
            <Text style={styles.total}>
              £
              {props.cart.total && props.cart.total?.grand_total
                ? props.cart.total?.grand_total.toFixed(2)
                : ''}
            </Text>
          </View>
          {!getShippingData() && (
            <Text style={styles.total} numberOfLines={1}>
              Delivery Will Be Calculated During Checkout
            </Text>
          )}

          <CustomButton
            style={{marginTop: 12}}
            onPress={() => {
              toOpen({page: DROPDOWN_PAGES.checkout});
            }}
            label="Checkout"
          />
        </View>
      ) : (
        <View>
          <Text style={{marginBottom: 10}}>Your Shopping Basket is Empty</Text>

          <CustomButton
            onPress={onContinueShipping}
            label="Continue shopping"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: COLORS.white,
  },
  image: {},
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 10,
  },
  total: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 150,
    gap: 15,
    borderTopWidth: 0.5,
    borderColor: COLORS.gray,
  },
  productDesc: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 15,
  },
  priceDesc: {
    gap: 2,
  },
  name: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '700',
    color: COLORS.black,
  },
  price: {
    fontSize: 14,
    color: COLORS.black,
  },
  checkoutBtn: {
    backgroundColor: COLORS.black,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  checkoutLabel: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 20,
  },
  rewardBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  pointsBtn: {
    marginTop: 5,
    backgroundColor: COLORS.black,
    paddingVertical: 15,
    borderRadius: 4,
    alignItems: 'center',
    width: '100%',
  },
  accordHeader: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordTitle: {
    color: COLORS.black,
    fontSize: 16,
  },
  accordContent: {
    backgroundColor: COLORS.white,
    height: 100,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    get_cart: () => dispatch(get_cart()),
    get_cart_total: () => dispatch(get_cart_total()),
    clear_cart: () => dispatch({type: CLEAR_CART}),
    remove_item: (itemId: RemoveType) =>
      dispatch(remove_item_from_cart(itemId, true)),
    get_products_by_sku: (sku: string[]) => dispatch(get_products_by_sku(sku)),
    get_reward_balance: (id: string | number) =>
      dispatch(get_reward_balance(id)),
    use_reward: (usingRewardPoints: boolean) =>
      usingRewardPoints
        ? dispatch(remove_reward_points())
        : dispatch(use_reward_points()),
    get_profile: (token: CustomerToken) => dispatch(get_profile(token)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    auth: state.auth,
    cart: state.cart,
    products: state.products,
    rewards: state.rewards,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
