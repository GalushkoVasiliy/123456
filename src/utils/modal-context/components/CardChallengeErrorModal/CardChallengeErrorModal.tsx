import React, {useEffect} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import COLORS from '../../../../config/COLORS';
import {navigate} from '../../../../navigation/RootNavigator';
import IconComponent from '../../../../components/IconComponent';
import CustomButton from '../../../../components/button';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';

export interface ICardChallengeErrorModal {}

interface Props extends ICardChallengeErrorModal {
  isOpen: boolean;
  onClose: () => void;
}

export const CardChallengeErrorModal = ({isOpen, onClose}: Props) => {
  const triggerHaptic = useHapticFeedback();

  useEffect(() => {
    triggerHaptic();
  }, []);

  const onContinue = () => {
    onClose();
    navigate('Browse', {
      screen: 'GreetingCards',
    });
  };

  return (
    <Modal transparent={true} visible={isOpen} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <IconComponent iconName="close" size={50} color={COLORS.white} />
          </View>

          <View style={styles.content}>
            <Text style={styles.modalText}>
              Unfortunately, we could not authenticate your transaction with the
              payment provider. Please try again later.
            </Text>

            <CustomButton label="Continue shopping" onPress={onContinue} />
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
    zIndex: 1000,
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
    zIndex: 1001,
  },
  header: {
    // borderTopEndRadius: 20,
    // borderTopStartRadius: 20,
    height: 100,
    width: '100%',
    backgroundColor: COLORS.red,
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
