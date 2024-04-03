/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useRef, useMemo, useCallback, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';

import RootNavigator from './src/navigation/RootNavigator';
import COLORS from './src/config/COLORS';
import {
  DROPDOWN_PAGES,
  DropDownContext,
  DropdownValues,
} from './src/utils/dropdown-context';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/redux';
import Cart from './src/components/Cart/Cart';
import Checkout from './src/components/Checkout/Checkout';
import Store from './src/components/Store/Store';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {ModalProvider} from './src/utils/modal-context';
import analytics from '@react-native-firebase/analytics';

function App() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);

  const [storeFinder, setStoreFinder] = useState();

  const handleExpandPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const [content, setContent] = React.useState<DROPDOWN_PAGES | null>(null);

  const onChange = (asset: 0 | -1) => {
    if (asset === -1) {
      setContent(null);
    }
  };

  const analyticsEnable = async () => {
    await analytics().logAppOpen();
  };

  useEffect(() => {
    analyticsEnable();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        onPress={handleClosePress}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        style={[props.style]}
        {...props}>
        <View style={styles.backDrop} />
      </BottomSheetBackdrop>
    ),
    [handleClosePress],
  );

  const contextUpdate = useMemo(
    () => ({
      toOpen: (values: DropdownValues) => {
        handleExpandPress();
        setContent(values.page);
        setStoreFinder(values.content);
      },
      toClose: () => {
        handleClosePress();
      },
    }),
    [handleExpandPress, handleClosePress],
  );

  return (
    <DropDownContext.Provider value={contextUpdate}>
      <Provider store={store}>
        <ModalProvider>
          <GestureHandlerRootView style={styles.handler}>
            <PersistGate loading={null} persistor={persistor}>
              <SafeAreaView style={styles.container}>
                <StatusBar
                  backgroundColor={
                    Platform.OS === 'android' ? COLORS.red : 'transparent'
                  }
                />
                <RootNavigator />
                <BottomSheet
                  onChange={onChange}
                  enablePanDownToClose
                  ref={bottomSheetRef}
                  snapPoints={snapPoints}
                  backdropComponent={renderBackdrop}
                  handleIndicatorStyle={styles.handleIndicator}
                  handleStyle={styles.handle}
                  index={-1}
                  animateOnMount
                  backgroundStyle={{
                    backgroundColor: COLORS.white,
                  }}>
                  {content === DROPDOWN_PAGES.cart && <Cart />}
                  {content === DROPDOWN_PAGES.store && (
                    <Store storeFinder={storeFinder} />
                  )}
                  {content === DROPDOWN_PAGES.checkout && <Checkout />}
                </BottomSheet>

                <Toast
                  visibilityTime={2000}
                  position="bottom"
                  bottomOffset={80}
                  config={{
                    success: props => (
                      <BaseToast
                        {...props}
                        style={{
                          borderLeftWidth: 8,
                          borderLeftColor: COLORS.green,
                          borderRadius: 0,
                          width: Dimensions.get('screen').width - 30,
                        }}
                        text1Style={{
                          fontWeight: '400',
                        }}
                        text1NumberOfLines={3}
                      />
                    ),
                    error: props => (
                      <ErrorToast
                        {...props}
                        style={{
                          borderLeftWidth: 8,
                          borderLeftColor: COLORS.red,
                          borderRadius: 0,
                          width: Dimensions.get('screen').width - 30,
                        }}
                        text1Style={{
                          fontWeight: '400',
                        }}
                        text1NumberOfLines={3}
                      />
                    ),
                    warning: props => (
                      <BaseToast
                        {...props}
                        style={{
                          borderLeftWidth: 8,
                          borderLeftColor: COLORS.yellow,
                          borderRadius: 0,
                          width: Dimensions.get('screen').width - 30,
                        }}
                        text1Style={{
                          fontWeight: '400',
                        }}
                        text1NumberOfLines={3}
                      />
                    ),
                  }}
                />
              </SafeAreaView>
            </PersistGate>
          </GestureHandlerRootView>
        </ModalProvider>
      </Provider>
    </DropDownContext.Provider>
  );
}

const styles = StyleSheet.create({
  handler: {flex: 1},
  container: {flex: 1, backgroundColor: COLORS.red},
  button: {
    paddingHorizontal: 15,
    height: 80,
    width: '100%',
    justifyContent: 'center',
  },
  title: {
    color: COLORS.white,
    fontFamily: 'tajawal',
    fontSize: 20,
    fontWeight: '800',
  },
  sheetTitle: {color: COLORS.white, fontSize: 24, fontWeight: '800'},
  handleIndicator: {
    backgroundColor: COLORS.black,
  },
  handle: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  wrapper: {flex: 1},
  backDrop: {flex: 1, backgroundColor: COLORS.black},
});

export default App;
