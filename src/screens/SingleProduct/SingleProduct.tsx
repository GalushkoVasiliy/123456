/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, useEffect, useContext, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import NumericInput from 'react-native-numeric-input';

import FastImageComponent from '../../components/FastImageComponent/FastImageComponent';
import COLORS from '../../config/COLORS';
import {API} from '../../config/CONSTANTS';
import IconComponent from '../../components/IconComponent';
import {
  add_to_cart,
  IAddToCart,
  create_cart,
} from '../../redux/actions/cart.actions';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {ReducerType} from '../../redux/reducers/reducers';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import Button from '../../components/button';
import {MODAL_NAMES, ModalContext} from '../../utils/modal-context';
import useHapticFeedback from '../../hooks/useHapticFeedback';
import {get_single_product_by_sku} from '../../redux/actions/products.actions';
import LoaderIcon from '../../assets/icons/loader';

const width = Dimensions.get('window').width;

interface SingleProductProps {
  products: ReducerType['products'];
  cart: ReducerType['cart'];
  auth: ReducerType['auth'];
  create_cart: () => void;
  add_to_cart: (data: IAddToCart) => Promise<any>;
  get_single_product_by_sku: (sku: string) => Promise<any>;
}

const SingleProduct = (props: SingleProductProps) => {
  const {navigate} = useNavigation();
  const isFocused = useIsFocused();
  const {onOpen} = useContext(ModalContext);
  const triggerHaptic = useHapticFeedback();

  const [count, setCount] = useState<number>(1);
  const [isDisable, setIsDisable] = useState(false);
  const imageCarousel = useRef<ICarouselInstance>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [singleProduct, setSingleProduct] = useState<any>(null);

  const isQuickEditProduct = useMemo(() => {
    const type = props.products.singleProduct?.custom_attributes.find(
      ({attribute_code}: any) => attribute_code === 'dnb_product_type',
    );
    return type?.value === 'quick_edit';
  }, [props.products.singleProduct?.custom_attributes]);

  const productDescription = useMemo(() => {
    const desc = props.products.singleProduct?.custom_attributes.find(
      ({attribute_code}: any) => attribute_code === 'short_description',
    );
    return desc?.value.replace(/<br \/>/g, '\r\n');
  }, [props.products.singleProduct?.custom_attributes]);

  useEffect(() => {
    if (props.products.singleProduct) {
      setIsLoading(true);
      props
        .get_single_product_by_sku(props.products.singleProduct.sku)
        .then(res => {
          setSingleProduct(res);
        })
        .finally(() => setIsLoading(false));
      // console.log(Object.keys(props.products.singleProduct));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAvailable = useMemo(() => {
    return !!singleProduct?.extension_attributes.stock_item.is_in_stock;
  }, [singleProduct]);

  const productCount = useMemo(() => {
    return (singleProduct?.extension_attributes.stock_item.qty as number) ?? 0;
  }, [singleProduct]);

  useEffect(() => {
    // When screen is focused button should be enabled, unless props.products.isAddToBasketInProgress is set
    if (isFocused) {
      setIsDisable(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!props.cart.cartId) {
      props.create_cart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cart.cartId]);

  if (!props.products.singleProduct) {
    return null;
  }

  const onAddToCart = async () => {
    setIsDisable(true);
    triggerHaptic();
    try {
      const res = await props
        .add_to_cart({
          sku: props.products.singleProduct?.sku as string,
          qty: count,
        })
        .finally(() => setIsDisable(false));

      if (res) {
        onOpen(MODAL_NAMES.success_add_product, {
          productName: res.name,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}>
        <Header />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LoaderIcon size={24} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      <ScrollView>
        <PageTitle isTitle textKey={props.products.singleProduct.name} />
        <View style={styles.content}>
          <View>
            <Carousel
              ref={imageCarousel}
              loop
              width={width - 30}
              height={width - 50}
              autoPlay={false}
              data={props.products.singleProduct.media_gallery_entries}
              scrollAnimationDuration={1000}
              renderItem={({item}: {item: {file: string}}) => (
                <View style={{backgroundColor: 'blue', flex: 1}}>
                  <FastImageComponent
                    style={styles.image}
                    uri={`${API.imageMock}${item.file}`}
                  />
                </View>
              )}
            />
            {props.products.singleProduct.media_gallery_entries.length > 1 && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    imageCarousel.current?.prev();
                  }}
                  style={[styles.arrowContainer, {left: 0}]}>
                  <IconComponent
                    size={20}
                    color={COLORS.white}
                    iconName={'chevron-left'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    imageCarousel.current?.next();
                  }}
                  style={[styles.arrowContainer, {right: 0}]}>
                  <IconComponent
                    size={20}
                    color={COLORS.white}
                    iconName={'chevron-right'}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>

          <Text style={styles.code}>
            Product code: {props.products.singleProduct.sku}
          </Text>

          <Text style={styles.price}>
            £{props.products.singleProduct.price}{' '}
            <Text style={{fontSize: 18}}>inc VAT</Text>
          </Text>

          {!isAvailable && (
            <Text style={styles.outStock}>Product out of stock</Text>
          )}

          {isAvailable && isQuickEditProduct && (
            <Button
              onPress={() => {
                setIsDisable(true);
                navigate('CustomizationProduct', {
                  productName: props.products.singleProduct?.name,
                });
              }}
              isLoading={isDisable}
              color="blue"
              label="Click Here to Personalise"
            />
          )}

          {isAvailable && !isQuickEditProduct && (
            <View style={styles.basketRow}>
              <NumericInput
                value={count}
                onChange={value => setCount(value)}
                totalWidth={140}
                totalHeight={50}
                iconSize={25}
                minValue={1}
                maxValue={productCount}
                type="plus-minus"
                // @ts-ignore
                iconStyle={{color: COLORS.black}}
              />
              <Button
                onPress={onAddToCart}
                style={{flex: 1}}
                isLoading={isDisable}
                label="Add to Basket"
              />
            </View>
          )}

          <Text style={styles.productDescription}>{productDescription}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
    marginBottom: 20,
  },
  code: {
    color: COLORS.gray,
    marginBottom: 20,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: COLORS.black,
  },
  outStock: {
    fontSize: 20,
    marginBottom: 20,
    color: COLORS.black,
  },
  arrowContainer: {
    position: 'absolute',
    width: 30,
    height: 40,
    backgroundColor: COLORS.codGray,
    zIndex: 1000,
    bottom: (width - 50) / 2 - 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  personalize: {
    backgroundColor: COLORS.lightBlue,
    width: '100%',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
  },
  basketRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  basket: {
    backgroundColor: COLORS.black,
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 12,
  },
  personalizeText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  productDescription: {
    paddingTop: 20,
    color: COLORS.black,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    create_cart: () => dispatch(create_cart()),
    add_to_cart: (data: IAddToCart) => dispatch(add_to_cart(data)),
    get_single_product_by_sku: (sku: string) =>
      dispatch(get_single_product_by_sku(sku)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    products: state.products,
    cart: state.cart,
    auth: state.auth,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(SingleProduct));
