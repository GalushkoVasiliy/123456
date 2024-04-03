import React, {useContext, useMemo, useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

import COLORS from '../../../../config/COLORS';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';

import IconComponent from '../../../../components/IconComponent';
import FastImageComponent from '../../../../components/FastImageComponent/FastImageComponent';
import {HOME_GIFTS_CATEGORY_ID} from '../../../../config/CONSTANTS';
import CustomButton from '../../../../components/button';
import {add_to_cart, IAddToCart} from '../../../../redux/actions/cart.actions';
import {connect} from 'react-redux';
import {navigate} from '../../../../navigation/RootNavigator';
import CloseIcon from '../../../../assets/icons/Close';
import {DropDownContext} from '../../../dropdown-context';
import {decode} from 'html-entities';
import {MODAL_NAMES, ModalContext} from '../../index';

const width = Dimensions.get('window').width;

export interface IGiftCarouselModal {
  gifts: string[];
  handleEstimate: () => void;
}

interface Props extends IGiftCarouselModal {
  isOpen: boolean;
  onClose: () => void;
  add_to_cart: (data: IAddToCart) => Promise<any>;
}

const GiftCarouselModal = ({
  isOpen,
  onClose,
  gifts,
  handleEstimate,
  ...props
}: Props) => {
  const imageCarousel = useRef<ICarouselInstance>(null);
  const {onOpen} = useContext(ModalContext);
  const {toClose} = useContext(DropDownContext);
  const [isAddLoading, setIsAddLoading] = useState(false);

  const parsedGiftCards = useMemo(() => {
    return gifts.map(gift => JSON.parse(gift));
  }, [gifts]);

  const handleAddToCart = (sku: string) => {
    setIsAddLoading(true);
    props
      .add_to_cart({sku, qty: 1})
      .then(res => {
        onClose();
        setTimeout(() => {
          if (res) {
            handleEstimate();
            onOpen(MODAL_NAMES.success_add_product, {
              productName: res.name,
            });
          }
        }, 0);
      })
      .finally(() => {
        setIsAddLoading(false);
      });
  };

  const onNavigate = () => {
    onClose();
    if (toClose) {
      toClose();
    }
    navigate('Browse', {
      screen: 'Gifts',
      params: {
        categoryId: HOME_GIFTS_CATEGORY_ID,
      },
    });
  };

  const handleClose = () => {
    onClose();
    if (toClose) {
      toClose();
    }
  };

  const renderItem = ({item}: any) => (
    <View style={styles.card}>
      <View style={{flex: 1}}>
        <FastImageComponent style={styles.image} uri={item.image.url} />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {decode(item.name)}
      </Text>
      <Text style={styles.price}>£{item.price?.toFixed(2)}</Text>
      <CustomButton
        label="Add to Basket"
        style={{width: '100%', marginTop: 15}}
        isLoading={isAddLoading}
        onPress={() => handleAddToCart(item.sku)}
      />
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            hitSlop={5}>
            <CloseIcon width={20} height={20} />
          </TouchableOpacity>
          <View style={styles.header}>
            <Text style={styles.title}>
              Gifts to Compliment your Custom Card Purchase
            </Text>
          </View>
          <View>
            <Carousel
              ref={imageCarousel}
              loop
              width={width - 30}
              height={width - 70}
              autoPlay={false}
              data={parsedGiftCards}
              scrollAnimationDuration={1000}
              renderItem={renderItem}
            />
            {parsedGiftCards.length > 1 && (
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

          <CustomButton
            color="green"
            style={{paddingHorizontal: 15, width: '100%', marginTop: 15}}
            label="Tap here to see the full list of Gifts you can buy with your card"
            onPress={onNavigate}
          />

          <CustomButton
            style={{paddingHorizontal: 15, width: '100%', marginTop: 15}}
            label="Go to Basket"
            onPress={handleClose}
          />
        </View>
      </View>
    </Modal>
  );
};

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    add_to_cart: (data: IAddToCart) => dispatch(add_to_cart(data)),
  };
};

export default connect(
  undefined,
  mapDispatchToProps,
)(React.memo(GiftCarouselModal));

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    backgroundColor: COLORS.white,
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    width: width - 30,
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.black,
  },
  closeButton: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.black,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
    // marginHorizontal: 30,
  },
  button: {
    marginTop: 15,
    backgroundColor: 'black',
    padding: 10,
  },
  btnLabel: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
  },
  price: {
    alignSelf: 'flex-start',
    fontWeight: '700',
    color: COLORS.black,
  },
  name: {
    alignSelf: 'flex-start',
    fontSize: 12,
    marginTop: 15,
    marginBottom: 5,
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
  image: {
    width: 180,
    height: 160,
  },
});
