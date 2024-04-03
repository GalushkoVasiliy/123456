import React, {useContext} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import COLORS from '../../../../config/COLORS';
import {getCurrentRoute, navigate} from '../../../../navigation/RootNavigator';
import CustomButton from '../../../../components/button';
import IconComponent from '../../../../components/IconComponent';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import {DropDownContext} from '../../../dropdown-context';
import {useRoute} from '@react-navigation/native';

export interface ISuccessAddProductModal {
  productName: string;
}

interface Props extends ISuccessAddProductModal {
  isOpen: boolean;
  onClose: () => void;
}

export const SuccessAddProductModal = ({
  isOpen,
  onClose,
  productName,
}: Props) => {
  const {toClose} = useContext(DropDownContext);
  const triggerHaptic = useHapticFeedback();
  const route = getCurrentRoute();

  const onContinue = () => {
    onClose();
    if (route?.name !== 'Basket') {
      navigate('Browse', {
        screen: 'GreetingCards',
      });
    }
  };

  const onGoBasket = () => {
    onClose();
    triggerHaptic();
    navigate('Basket');
    if (toClose) {
      toClose();
    }
  };

  return (
    <Modal transparent={true} visible={isOpen} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <IconComponent iconName="check" size={50} color={COLORS.white} />
          </View>

          <View style={styles.content}>
            <Text style={styles.modalText}>
              Your product <Text style={styles.orderText}>{productName}</Text>{' '}
              was added to your basket
            </Text>

            <CustomButton label="Continue shopping" onPress={onContinue} />
            <CustomButton label="Go to basket" onPress={onGoBasket} />
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
    // borderRadius: 20,
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
    // borderTopEndRadius: 20,
    // borderTopStartRadius: 20,
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
});
