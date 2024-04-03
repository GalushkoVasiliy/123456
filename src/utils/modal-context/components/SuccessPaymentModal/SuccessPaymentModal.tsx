import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import COLORS from '../../../../config/COLORS';
import {navigate} from '../../../../navigation/RootNavigator';
import IconComponent from '../../../../components/IconComponent';
import CustomButton from '../../../../components/button';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import {STORE_GIFTS_CATEGORY_ID} from '../../../../config/CONSTANTS';
import Carousel, {ICarouselInstance} from 'react-native-reanimated-carousel';
import {useSelector} from 'react-redux';
import {ReducerType} from '../../../../redux/reducers/reducers';
import FastImageComponent from '../../../../components/FastImageComponent/FastImageComponent';

export interface ISuccessPaymentModal {
  orderNumber: number | null;
  isStoreMethod: boolean;
}

interface Props extends ISuccessPaymentModal {
  isOpen: boolean;
  onClose: () => void;
}

const screenSizes = Dimensions.get('screen');

export const SuccessPaymentModal = ({
  isOpen,
  onClose,
  orderNumber,
  isStoreMethod,
}: Props) => {
  const triggerHaptic = useHapticFeedback();
  const giftCards = useSelector((state: ReducerType) => state.cart.giftCards);
  const imageCarousel = useRef<ICarouselInstance>(null);
  const [isViewGifts, setIsViewGifts] = useState(false);

  const parsedGiftCards = useMemo(() => {
    return giftCards.map(gift => JSON.parse(gift));
  }, [giftCards]);

  useEffect(() => {
    triggerHaptic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onContinue = () => {
    onClose();
    triggerHaptic();
    navigate('Browse', {
      screen: 'GreetingCards',
    });
  };

  const onClick = () => {
    setIsViewGifts(true);
    // onClose();
    // triggerHaptic();
    // navigate('Browse', {
    //   screen: 'Gifts',
    //   params: {
    //     categoryId: STORE_GIFTS_CATEGORY_ID,
    //   },
    // });
  };

  return (
    <Modal transparent={true} visible={isOpen} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={[styles.modalView]}>
          {!isViewGifts && (
            <View style={[styles.header]}>
              <IconComponent iconName="check" size={50} color={COLORS.white} />
            </View>
          )}

          <View style={[styles.content]}>
            {!isViewGifts && (
              <>
                <Text style={styles.modalText}>
                  Your order # is{' '}
                  <Text style={styles.orderText}>{orderNumber}</Text>
                </Text>
                <Text style={styles.modalText}>
                  An order confirmation email will be sent to you shortly,
                  containing all the details of your order.
                </Text>
              </>
            )}

            {isViewGifts && (
              <View
                style={
                  {
                    // flex: 1,
                    // backgroundColor: 'red',
                  }
                }>
                <Carousel
                  ref={imageCarousel}
                  loop
                  width={(screenSizes.width / 5) * 4}
                  height={(screenSizes.width / 5) * 4 + 50}
                  autoPlay={true}
                  mode="parallax"
                  // modeConfig={{
                  //   parallaxScrollingScale: 0.7,
                  //   // parallaxScrollingOffset: 0,
                  //   parallaxAdjacentItemScale: 0.3,
                  // }}
                  data={parsedGiftCards}
                  scrollAnimationDuration={1000}
                  renderItem={({item}) => (
                    <View
                      style={{
                        flex: 1,
                        // width: screenSizes.width * 0.6,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 4,
                        backgroundColor: COLORS.white,
                        borderRadius: 4,
                        borderColor: COLORS.gray,
                        borderWidth: 1,
                        // borderLeftWidth: 1,
                      }}>
                      <FastImageComponent
                        resizeMode="contain"
                        style={styles.image}
                        uri={item.image.url}
                      />
                      <Text style={{paddingHorizontal: 15, fontSize: 20}}>
                        {item.name}
                      </Text>
                    </View>
                  )}
                />
              </View>
            )}

            {isStoreMethod && !isViewGifts && parsedGiftCards.length > 0 && (
              <CustomButton
                color="green"
                style={{paddingHorizontal: 10, height: 90}}
                label="Tap here to view the gifts you can buy when you visit our store to collect your card"
                onPress={onClick}
              />
            )}

            <CustomButton
              style={{marginHorizontal: isViewGifts ? 15 : 0}}
              label="Continue shopping"
              onPress={onContinue}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '80%',
    margin: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    height: 100,
    width: '100%',
    backgroundColor: COLORS.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 35,
    gap: 12,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    marginBottom: 20,
    color: COLORS.black,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 7,
    color: COLORS.grayDark,
    textAlign: 'center',
  },
  orderText: {
    color: COLORS.black,
    fontWeight: '700',
    textAlign: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    width: 30,
    height: 40,
    backgroundColor: COLORS.codGray,
    zIndex: 1000,
    bottom: screenSizes.height / 2 - 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '60%',
    marginBottom: 20,
  },
});
