import React from 'react';
import {Linking, Modal, StyleSheet, Text, View} from 'react-native';
import COLORS from '../../../../config/COLORS';
import IconComponent from '../../../../components/IconComponent';
import CustomButton from '../../../../components/button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal = ({isOpen, onClose}: Props) => {
  const onContinue = () => {
    onClose();
    Linking.openURL('https://www.android.com/payapp/');
  };

  return (
    <Modal transparent={true} visible={isOpen} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <IconComponent iconName="warning" size={50} color={COLORS.white} />
          </View>

          <View style={styles.content}>
            <Text style={styles.modalText}>
              To use Google Pay you will need to add your credit card to the Google Wallet
            </Text>

            <CustomButton label="Open Google Wallet" onPress={onContinue} />
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
    height: 100,
    width: '100%',
    backgroundColor: COLORS.yellow,
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
