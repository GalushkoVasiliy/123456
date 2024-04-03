import React, {useContext, useState} from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {API} from '../../../../config/CONSTANTS';
import {worldpay_is_verified} from '../../../../redux/actions/orders.actions';
import {connect} from 'react-redux';
import COLORS from '../../../../config/COLORS';
import LoaderIcon from '../../../../assets/icons/loader';
import CloseIcon from '../../../../assets/icons/Close';
import {DropDownContext} from '../../../dropdown-context';

export interface ICardChallengeModal {
  url: string;
  jwt: string;
  orderId: number;
  finishOrder: () => void;
  onShowErrorCardPay: () => void;
  onRestoreCart: (id: number) => void;
}

interface Props extends ICardChallengeModal {
  isOpen: boolean;
  onClose: () => void;
  worldpay_is_verified: (id: number) => Promise<boolean>;
}

const CardChallengeModal = ({
  isOpen,
  onClose,
  url,
  jwt,
  orderId,
  worldpay_is_verified,
  finishOrder,
  onShowErrorCardPay,
  onRestoreCart,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const {toClose} = useContext(DropDownContext);

  const onCloseDropdown = () => {
    if (toClose) {
      toClose();
    }
  };

  const _onMessage = (event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data);
    // Product has been added to thebasket, hide loading spinner, reload basket and show success message
    if (message.action === 'accessworldpay_creditcard_challenge_return') {
      setIsLoading(true);
      worldpay_is_verified(orderId)
        .then(isConfirm => {
          if (isConfirm) {
            onClose();
            onCloseDropdown();
            finishOrder();
          } else {
            onClose();
            onShowErrorCardPay();
            onRestoreCart(orderId);
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleClose = () => {
    onClose();
    onRestoreCart(orderId);
  };

  const INJECTEDJAVASCRIPT =
    "const meta = document.createElement('meta'); meta.setAttribute('content', 'initial-scale=1.0, maximum-scale=1.0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); ";

  const uri = `${API.url}/access-worldpay-credit-card/challenge/index?url=${url}&jwt=${jwt}`;

  return (
    <Modal visible={isOpen} onRequestClose={onClose}>
      <SafeAreaView style={styles.flex}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 15,
            paddingBottom: 8,
          }}>
          <TouchableOpacity onPress={handleClose}>
            <CloseIcon height={20} width={20} />
          </TouchableOpacity>
        </View>
        {!isLoading && (
          <WebView
            source={{
              uri,
            }}
            scrollEnabled
            startInLoadingState
            javaScriptEnabledAndroid
            injectedJavaScript={INJECTEDJAVASCRIPT}
            onMessage={_onMessage}
            cacheEnabled={false}
            incognito
            scalesPageToFit={false}
            style={styles.flex}
          />
        )}
        {isLoading && (
          <View style={styles.loaderContainer}>
            <LoaderIcon color={COLORS.black} />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    worldpay_is_verified: (orderId: number) =>
      dispatch(worldpay_is_verified(orderId)),
  };
};

export default connect(
  undefined,
  mapDispatchToProps,
)(React.memo(CardChallengeModal));
