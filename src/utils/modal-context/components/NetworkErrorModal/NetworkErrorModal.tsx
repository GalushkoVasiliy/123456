import React, {useEffect} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import COLORS from '../../../../config/COLORS';
import CustomButton from '../../../../components/button';
import useHapticFeedback from '../../../../hooks/useHapticFeedback';
import WifiIcon from '../../../../assets/icons/Wifi';
import {useNetInfoInstance} from '@react-native-community/netinfo';

export interface INetworkErrorModal {}

interface Props extends INetworkErrorModal {
  isOpen: boolean;
  onClose: () => void;
}

export const NetworkErrorModal = ({isOpen, onClose}: Props) => {
  const triggerHaptic = useHapticFeedback();
  const {
    refresh,
    netInfo: {isConnected},
  } = useNetInfoInstance();

  useEffect(() => {
    if (isConnected) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const onRefresh = () => {
    triggerHaptic();
    refresh();
  };

  return (
    <Modal transparent={true} visible={isOpen} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <WifiIcon width={50} height={50} fill={COLORS.white} />
          </View>

          <View style={styles.content}>
            <Text style={[styles.orderText, {marginBottom: 8}]}>
              Ooops, we can't reach our servers.
            </Text>
            <Text style={[styles.modalText, {marginBottom: 0}]}>
              Apologies for the inconvenience.
            </Text>
            <Text style={styles.modalText}>Please try again later.</Text>

            <CustomButton label="Retry" onPress={onRefresh} />
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
