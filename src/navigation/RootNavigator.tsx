/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../screens/Splash';
import SignIn from '../screens/AuthScreens/SignIn';
import SignUp from '../screens/AuthScreens/SignUp';
import ForgotPassword from '../screens/AuthScreens/ForgotPassword';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import GreetingCards from '../screens/GreetingCards';
import StoreFinder from '../screens/StoreFinder';
import Rewards from '../screens/Rewards';
import AddReceipt from '../screens/Rewards/AddReceipt';
import MyAccount from '../screens/AuthScreens/MyAccount';
import PersonalDetails from '../screens/AuthScreens/MyAccount/PersonalDetails';
import MyOrders from '../screens/AuthScreens/MyAccount/MyOrders';
import OrderDetails from '../screens/AuthScreens/MyAccount/OrderDetails';
import AddressBook from '../screens/AuthScreens/MyAccount/AddressBook';
import DeleteMyAccount from '../screens/AuthScreens/MyAccount/DeleteMyAccount';
import Products from '../screens/Products';
import CustomizationProduct from '../screens/CustomizationProduct/CustomizationProduct';
import SingleProduct from '../screens/SingleProduct/SingleProduct';
import IconComponent from '../components/IconComponent';
import {useDispatch, useSelector} from 'react-redux';
import {ReducerType} from '../redux/reducers/reducers';
import CartScreen from '../screens/CartScreen/CartScreen';
import Basket from '../assets/icons/Basket';
import HomeIcon from '../assets/icons/Home';
import COLORS from '../config/COLORS';
import {addEventListener} from '@react-native-community/netinfo';
import {MODAL_NAMES, ModalContext} from '../utils/modal-context';
import {AccessibilityInfo} from 'react-native';
import Toast from 'react-native-toast-message';
import {get_product_filter} from '../redux/actions/filters.actions';
import Gifts from '../screens/Gifts';

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const BrowseStack = createStackNavigator();
const RewardsStack = createStackNavigator();

const Tab = createBottomTabNavigator();

function AuthStackContainer(props: any) {
  return (
    <SafeAreaView
      mode="padding"
      edges={['top', 'bottom']}
      style={{
        flex: 1,
      }}>
      <AuthStack.Navigator
        initialRouteName={props.route.params.isAuth ? 'MyAccount' : 'SignIn'}>
        <AuthStack.Screen
          options={{headerShown: false}}
          name="SignUp"
          component={SignUp}
        />
        <AuthStack.Screen
          options={{headerShown: false}}
          name="ForgotPassword"
          component={ForgotPassword}
        />
        <AuthStack.Screen
          options={{headerShown: false}}
          name="SignIn"
          component={SignIn}
        />
        <AuthStack.Screen
          options={{headerShown: false}}
          name="MyAccount"
          component={MyAccount}
        />
        <AuthStack.Screen
          options={{headerShown: false}}
          name="PersonalDetails"
          component={PersonalDetails}
        />
        <AuthStack.Screen
          options={{headerShown: false}}
          name="MyOrders"
          component={MyOrders}
        />
        <AuthStack.Screen
          options={{headerShown: false}}
          name="OrderDetails"
          component={OrderDetails}
        />
        <AuthStack.Screen
          options={{headerShown: false}}
          name="AddressBook"
          component={AddressBook}
        />
        <AuthStack.Screen
          options={{headerShown: false}}
          name="DeleteMyAccount"
          component={DeleteMyAccount}
        />
      </AuthStack.Navigator>
    </SafeAreaView>
  );
}

function HomeStackContainer() {
  return (
    <HomeStack.Navigator initialRouteName="HomeScreen">
      <HomeStack.Screen
        options={{headerShown: false}}
        name="Splash"
        component={Splash}
      />
      <HomeStack.Screen
        options={{headerShown: false}}
        name="HomeScreen"
        component={Home}
      />
      <HomeStack.Screen
        options={{headerShown: false}}
        name="Rewards"
        component={Rewards}
      />
      <HomeStack.Screen
        options={{headerShown: false}}
        name="GreetingCards"
        component={GreetingCards}
      />
      <HomeStack.Screen
        options={{headerShown: false}}
        name="Products"
        component={Products}
      />
      <HomeStack.Screen
        options={{headerShown: false}}
        name="SingleProduct"
        component={SingleProduct}
      />
      <HomeStack.Screen
        options={{headerShown: false}}
        name="CustomizationProduct"
        component={CustomizationProduct}
      />
      <HomeStack.Screen
        options={{headerShown: false}}
        name="StoreFinder"
        component={StoreFinder}
      />
    </HomeStack.Navigator>
  );
}

function RewardsStackContainer() {
  return (
    <RewardsStack.Navigator>
      <RewardsStack.Screen
        options={{headerShown: false}}
        name="Rewards"
        component={Rewards}
      />
      <HomeStack.Screen
        options={{headerShown: false}}
        name="AddReceipt"
        component={AddReceipt}
      />
    </RewardsStack.Navigator>
  );
}

function BrowseStackContainer() {
  return (
    <BrowseStack.Navigator initialRouteName="GreetingCards">
      <BrowseStack.Screen
        options={{headerShown: false}}
        name="Splash"
        component={Splash}
      />
      <BrowseStack.Screen
        options={{headerShown: false}}
        name="GreetingCards"
        component={GreetingCards}
        initialParams={{backFalse: true}}
      />
      <BrowseStack.Screen
        options={{headerShown: false}}
        name="Products"
        component={Products}
      />
      <BrowseStack.Screen
        options={{headerShown: false}}
        name="SingleProduct"
        component={SingleProduct}
      />
      <BrowseStack.Screen
        options={{headerShown: false}}
        name="CustomizationProduct"
        component={CustomizationProduct}
      />
      <BrowseStack.Screen
        options={{headerShown: false}}
        name="Gifts"
        component={Gifts}
      />
    </BrowseStack.Navigator>
  );
}

enum TabName {
  home = 'Home',
  account = 'Account',
  browse = 'Browse',
  rewards = 'RymanRewards',
  basket = 'Basket',
}

function getIconForTabNavigation(routeName: TabName) {
  switch (routeName) {
    case TabName.account:
      return 'RYMAN_APP_ICONS_My_Account';
    case TabName.basket:
      return 'shopping-basket';
    case TabName.browse:
      return 'RYMAN_APP_ICONS_Browse';
    case TabName.home:
      return 'home';
    case TabName.rewards:
      return 'RYMAN_APP_ICONS_Rewards';
  }
}

export const navigationRef = createNavigationContainerRef();

export function navigate(name: never, options?: never) {
  if (navigationRef.isReady()) {
    if (options) {
      navigationRef.navigate(name, options);
    } else {
      navigationRef.navigate(name);
    }
  }
}

export function getCurrentRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
}

const RootNavigator: React.FunctionComponent = () => {
  const {onOpen} = useContext(ModalContext);
  const dispatch = useDispatch();
  const profile = useSelector((state: ReducerType) => state.auth.profile);
  const cart = useSelector(
    (state: {cart: {total: {items_qty: number}}}) => state.cart.total,
  );
  const [isShowed, setIsShowed] = useState(false);

  useEffect(() => {
    get_product_filter()(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  AccessibilityInfo.isReduceMotionEnabled().then(res => {
    if (res && !isShowed) {
      Toast.show({
        visibilityTime: 5000,
        type: 'warning',
        text1: 'Animation disabled',
        text2: 'Some features may not work properly',
      });
      setIsShowed(true);
    }
    if (!res) {
      setIsShowed(false);
    }
  });

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      if (!state.isConnected) {
        onOpen(MODAL_NAMES.network_error, {});
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarIcon: ({color}) => {
            if (route.name === 'Basket') {
              return <Basket fill={color} width={26} height={26} />;
            }

            if (route.name === 'Home') {
              return <HomeIcon fill={color} width={20} height={20} />;
            }

            return (
              <IconComponent
                size={20}
                color={color}
                iconName={getIconForTabNavigation(route.name as TabName)}
              />
            );
          },
          tabBarActiveTintColor: COLORS.red,
          tabBarInactiveTintColor: COLORS.gray,
          unmountOnBlur: true,
        })}>
        <Tab.Screen
          name={TabName.home}
          component={HomeStackContainer}
          listeners={{
            tabPress: () => {
              navigationRef.current?.navigate(TabName.home, {
                screen: 'HomeScreen',
                params: {timestamp: new Date().getTime()},
              });
            },
          }}
        />
        <Tab.Screen
          name={TabName.browse}
          component={BrowseStackContainer}
          listeners={{
            tabPress: () => {
              navigationRef.current?.navigate(TabName.browse);
            },
          }}
        />
        <Tab.Screen
          name={TabName.account}
          component={AuthStackContainer}
          initialParams={{isAuth: !!profile?.id}}
          listeners={{
            tabPress: () => {
              navigationRef.current?.navigate(TabName.account);
            },
          }}
        />
        <Tab.Screen
          name={TabName.rewards}
          component={RewardsStackContainer}
          listeners={{
            tabPress: () => {
              navigationRef.current?.navigate(TabName.rewards);
            },
          }}
        />
        <Tab.Screen
          options={{
            tabBarBadge: cart && cart?.items_qty ? cart?.items_qty : '0',
            tabBarBadgeStyle: {backgroundColor: COLORS.red},
          }}
          name={TabName.basket}
          component={CartScreen}
          listeners={{
            tabPress: () => {
              navigationRef.current?.navigate(TabName.basket);
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
