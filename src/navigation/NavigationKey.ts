export type NavigationKeyType =
  | 'Splash'
  | 'SignUp'
  | 'ForgotPassword'
  | 'SignIn'
  | 'AuthStack'
  | 'HomeStack'
  | 'Home'
  | 'MyAccount'
  | 'PersonalDetails'
  | 'Rewards'
  | 'AddReceipt'
  | 'StoreFinder'
  | 'GreetingCards'
  | 'Products'
  | 'SingleProduct'
  | 'CustomizationProduct';

const NavigationKey: {[key in NavigationKeyType]: NavigationKeyType} = {
  Splash: 'Splash',
  SignUp: 'SignUp',
  ForgotPassword: 'ForgotPassword',
  SignIn: 'SignIn',
  AuthStack: 'AuthStack',
  HomeStack: 'HomeStack',
  Home: 'Home',
  MyAccount: 'MyAccount',
  PersonalDetails: 'PersonalDetails',
  Rewards: 'Rewards',
  AddReceipt: 'AddReceipt',
  StoreFinder: 'StoreFinder',
  GreetingCards: 'GreetingCards',
  Products: 'Products',
  SingleProduct: 'SingleProduct',
  CustomizationProduct: 'CustomizationProduct',
};

export default NavigationKey;
