import React, {useContext, useState} from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Keyboard,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {connect} from 'react-redux';
import COLORS from '../../config/COLORS';
import Header from '../../components/Header';
import {
  get_cart,
  get_cart_total,
  get_masked_cart,
} from '../../redux/actions/cart.actions';
import {API} from '../../config/CONSTANTS';
import {ReducerType} from '../../redux/reducers/reducers';
import {useNavigation} from '@react-navigation/native';
import {MODAL_NAMES, ModalContext} from '../../utils/modal-context';
import LottieView from 'lottie-react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface CustomizationProductProps {
  products: ReducerType['products'];
  cart: ReducerType['cart'];
  auth: ReducerType['auth'];
  get_cart: () => any;
  get_masked_cart: () => any;
  get_cart_total: () => any;
}

const CustomizationProduct = (props: CustomizationProductProps) => {
  const {goBack} = useNavigation();
  const {onOpen} = useContext(ModalContext);

  const _onMessage = (event: WebViewMessageEvent) => {
    const message = JSON.parse(event.nativeEvent.data);
    // Product has been added to thebasket, hide loading spinner, reload basket and show success message
    if (message.action === 'added_cart') {
      if (message.success) {
        props.get_cart();
        props.get_cart_total();
        onOpen(MODAL_NAMES.success_add_product, {
          productName: props.products.singleProduct?.name as string,
        });
        goBack();
      }
    }
  };

  const jsCode = `
     const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
     if (!iOS) {
       const meta = document.createElement('meta');
       let initialScale = 1;
       if(screen.width <= 800) {
         initialScale = ((screen.width / window.innerWidth) + 0.1).toFixed(2);
       }
       const content = 'width=device-width, initial-scale=' + initialScale ;
       meta.setAttribute('name', 'viewport');
       meta.setAttribute('content', content);
       document.getElementsByTagName('head')[0].appendChild(meta);
     }
    window.addEventListener("message", function (event) {
      window.ReactNativeWebView.postMessage(JSON.stringify(event.data));
    });
    // Workaround to intercept the add to basket fetch call
    const origFetch = window.fetch;
    window.fetch = (...args) => (async(args) => {
        var result = await origFetch(...args);
        const data = await result.clone().json();
        // If produt was added to basket, intercept it
        if (args.toString().indexOf("/w2p/cart/add") > -1) {
          window.ReactNativeWebView.postMessage(JSON.stringify({"action": "added_cart", "success": data.data.success}));
        }
        return result;
    })(args);
  `;

  const uri = `${API.url}/w2p/quickedit/index/product/${props.products.singleProduct?.id}/?quote_id=${props.cart.cart?.id}`;

  const renderLoader = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.white,
        }}>
        <LottieView
          source={require('./screen.json')}
          style={{width: 400, height: 400}}
          autoPlay
          loop
        />
      </View>
    );
  };

  const [focus, setFocus] = useState(false);
  const [top, setTop] = useState(0);

  const handleFocus = () => {
    setFocus(true);
  };

  const handleUnFocus = () => {
    setFocus(false);
    setTop(0);
  };

  const onTouch = (e: GestureResponderEvent) => {
    if (!Keyboard.isVisible()) {
      setTop(e.nativeEvent.locationY);
    }
  };

  if (props.auth.token || props.cart.cartId) {
    return (
      <View style={styles.container}>
        <Header />
        <KeyboardAwareScrollView
          style={{flex: 1}}
          resetScrollToCoords={{x: 0, y: 0}}
          contentContainerStyle={{flex: 1}}
          onTouchStart={onTouch}
          onKeyboardDidShow={handleFocus}
          onKeyboardDidHide={handleUnFocus}>
          <WebView
            source={{
              uri: uri,
              headers: {
                referer: uri,
              },
            }}
            renderLoading={renderLoader}
            scrollEnabled
            startInLoadingState
            javaScriptEnabledAndroid
            injectedJavaScript={jsCode}
            onMessage={_onMessage}
            cacheEnabled={false}
            incognito
            scalesPageToFit={false}
            style={{
              flex: 1,
              minHeight: Dimensions.get('screen').height - 80,
              height: '110%',
              top:
                Platform.OS === 'android' && focus
                  ? -(top - Dimensions.get('screen').height / 3)
                  : 0,
            }}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
  },
  webview: {
    flex: 1,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => void) => {
  return {
    get_cart: () => dispatch(get_cart()),
    get_masked_cart: () => dispatch(get_masked_cart()),
    get_cart_total: () => dispatch(get_cart_total()),
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
)(React.memo(CustomizationProduct));
