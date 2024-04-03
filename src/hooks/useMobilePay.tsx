import {
  IosPaymentMethodDataInterface,
  AndroidPaymentMethodDataInterface,
  PaymentDetailsInit,
  PaymentMethodNameEnum,
  PaymentRequest,
  SupportedNetworkEnum,
  EnvironmentEnum,
} from '@rnw-community/react-native-payments';
import {API, SELECTED_STAGE} from '../config/CONSTANTS';
import {useSelector} from 'react-redux';
import {ReducerType} from '../redux/reducers/reducers';
import {useEffect, useState} from 'react';
import {AndroidAllowedAuthMethodsEnum} from '@rnw-community/react-native-payments/src/@standard/android/enum/android-allowed-auth-methods.enum';

const iosPaymentMethodData = (
  request: boolean,
): IosPaymentMethodDataInterface => ({
  data: {
    requestBilling: request,
    requestShipping: false,
    requestEmail: false,
    countryCode: 'GB',
    currencyCode: 'GBP',
    supportedNetworks: [
      SupportedNetworkEnum.Visa,
      SupportedNetworkEnum.Mastercard,
    ],
    // HINT: This should match your Apple Developer Merchant ID(in XCode Apple Pay Capabilities)
    merchantIdentifier: API.applePayId,
  },
  supportedMethods: PaymentMethodNameEnum.ApplePay,
});

const androidPaymentMethodData = (
  request: boolean,
): AndroidPaymentMethodDataInterface => ({
  supportedMethods: PaymentMethodNameEnum.AndroidPay,
  data: {
    supportedNetworks: [
      SupportedNetworkEnum.Visa,
      SupportedNetworkEnum.Mastercard,
    ],
    allowedAuthMethods: [AndroidAllowedAuthMethodsEnum.CRYPTOGRAM_3DS],
    environment:
      SELECTED_STAGE === 'production'
        ? EnvironmentEnum.PRODUCTION
        : EnvironmentEnum.TEST,
    countryCode: 'GB',
    currencyCode: 'GBP',
    requestBilling: request,
    requestEmail: false,
    requestShipping: false,
    gatewayConfig: {
      gateway: API.googlePayGateway,
      gatewayMerchantId: API.googlePayId,
    },
  },
});

export default function useMobilePay(isAddressRequest: boolean) {
  const cart = useSelector((state: ReducerType) => state.cart.cart);
  const cartTotal = useSelector(
    (state: ReducerType) => state.cart.total?.grand_total,
  );

  const [isWalletAvailable, setIsWalletAvailable] = useState(false);

  const paymentDetails: PaymentDetailsInit = {
    displayItems: cart?.items
      ? cart.items?.map((item: {name: any; price: any}) => ({
          label: item.name,
          amount: {currency: 'GBP', value: `${item.price}`},
        }))
      : [],
    total: {
      amount: {
        currency: 'GBP',
        value: `${cartTotal}`,
      },
      label: 'ryman.co.uk',
    },
  };

  const createPaymentRequest = (): PaymentRequest => {
    return new PaymentRequest(
      [
        iosPaymentMethodData(isAddressRequest),
        androidPaymentMethodData(isAddressRequest),
      ],
      paymentDetails,
    );
  };

  useEffect(() => {
    // only "free" should be available if grand total is 0
    if (cartTotal === 0) {
      setIsWalletAvailable(false);
      return;
    }

    createPaymentRequest()
      .canMakePayment()
      .then(result => setIsWalletAvailable(result));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    createPaymentRequest,
    isWalletAvailable,
  };
}
