// import AsyncStorage from '@react-native-async-storage/async-storage';
import {API, SELECTED_STAGE} from '../../config/CONSTANTS';
import {
  ADD_COUPON,
  CLEAR_CART,
  DELETE_COUPON,
  GET_COUPON,
  SEND_SHIPPING_INFORMATION,
  SET_COUPON_UPDATING,
} from '../const';
import Toast from 'react-native-toast-message';
import {get_cart_total} from './cart.actions';
import {getValidCustomerToken} from '../../utils/getValidCustomerToken';

export enum DeliveryOptions {
  deliver = 'toAddress',
  store = 'toCollectionPoint',
}

export const set_delivery_option =
  (deliveryOption: DeliveryOptions) => async (dispatch, getState) => {
    const token = await dispatch(getValidCustomerToken(getState().auth.token));
    const cartId = getState().cart.cartId;

    const url = token
      ? `${API.url}rest/V1/carts/mine/click-and-collect/set-delivery-option`
      : `${API.url}rest/V1/guest-carts/${cartId}/click-and-collect/set-delivery-option`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && {Authorization: `Bearer ${token}`}),
        },
        body: JSON.stringify({deliveryOption}),
      }).then(r => r.json());

      if (typeof response === 'object' && 'message' in response) {
        return Toast.show({
          type: 'error',
          text1: response.message,
          text2: 'set_delivery_option',
          visibilityTime: 2000,
        });
      }

      return response;
    } catch (e) {
      console.error(e);
    }
  };

export const set_selection_point_id =
  (collectionPointId: number) => async (dispatch, getState) => {
    const token = await dispatch(getValidCustomerToken(getState().auth.token));
    const cartId = getState().cart.cartId;

    const url = token
      ? `${API.url}rest/V1/carts/mine/click-and-collect/set-collection-point-id`
      : `${API.url}rest/V1/guest-carts/${cartId}/click-and-collect/set-collection-point-id`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && {Authorization: `Bearer ${token}`}),
        },
        body: JSON.stringify({collectionPointId}),
      }).then(r => r.json());

      if (typeof response === 'object' && 'message' in response) {
        return Toast.show({
          type: 'error',
          text1: response.message,
          text2: 'set_selection_point_id',
          visibilityTime: 2000,
        });
      }

      return response;
    } catch (e) {
      console.error(e);
    }
  };

export interface EstimateShippingMethods {
  region?: string;
  region_id?: number;
  country_id: string;
  street: string[];
  postcode: string;
  city: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  customer_id: null;
}

export interface ShippingMethod {
  carrier_code: string;
  method_code: string;
  carrier_title: string;
  method_title: string;
  amount: number;
  base_amount: number;
  available: boolean;
  extension_attributes: {
    method_description: string;
  };
  error_message: string;
  price_excl_tax: number;
  price_incl_tax: number;
}

function wait(delay: number) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

const estimate = async (
  url: string,
  address: EstimateShippingMethods,
  token?: string,
) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
      },
      body: JSON.stringify({address}),
    }).then(r => r.json());

    return response;
  } catch (e) {
    return;
  }
};

export const estimate_shipping_methods =
  (address: EstimateShippingMethods) => async (dispatch, getState) => {
    let retryCount = 3;
    const token = await dispatch(getValidCustomerToken(getState().auth.token));
    const cartId = getState().cart.cartId;

    const url = token
      ? `${API.url}rest/V1/carts/mine/estimate-shipping-methods`
      : `${API.url}rest/V1/guest-carts/${cartId}/estimate-shipping-methods`;

    let response = await estimate(url, address, token);

    while (retryCount > 0) {
      if (
        !response ||
        (!!response && Array.isArray(response) && response.length === 0)
      ) {
        break;
      }

      retryCount -= 1;

      await wait(500).then(async () => {
        response = await estimate(url, address, token);
      });
    }

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'estimate_shipping_methods',
        visibilityTime: 2000,
      });
    }

    if (Array.isArray(response) && response.length === 0) {
      return Toast.show({
        type: 'error',
        text1: 'Shipping methods list empty, try again later',
        text2: 'estimate_shipping_methods',
        visibilityTime: 2000,
      });
    }

    return response;
  };

interface Address {
  region?: string;
  region_id?: number;
  region_code: string;
  country_id: string;
  street: string[];
  postcode: string;
  city: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
}

export interface SendShippingInformation {
  shipping_address: Address;
  billing_address?: Address;
  shipping_carrier_code: string;
  shipping_method_code: string;
}

export const send_shipping_information =
  (addressInformation: SendShippingInformation) =>
  async (dispatch, getState) => {
    const token = await dispatch(getValidCustomerToken(getState().auth.token));
    const cartId = getState().cart.cartId;
    const url = token
      ? `${API.url}rest/V1/carts/mine/shipping-information`
      : `${API.url}rest/V1/guest-carts/${cartId}/shipping-information`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && {Authorization: `Bearer ${token}`}),
        },
        body: JSON.stringify({addressInformation}),
      }).then(r => r.json());

      const isPostCodeError =
        JSON.stringify(response.parameters) ===
          JSON.stringify(['productmatrix', 'standard']) &&
        response.message === 'Carrier with such method not found: %1, %2';

      if (typeof response === 'object' && 'message' in response) {
        if (isPostCodeError) {
          return Toast.show({
            type: 'error',
            text1: 'Postcode has wrong format, check in your Address Book',
            visibilityTime: 2000,
          });
        } else {
          return Toast.show({
            type: 'error',
            text1: response.message,
            text2: 'send_shipping_information',
            visibilityTime: 2000,
          });
        }
      }

      dispatch({type: SEND_SHIPPING_INFORMATION, data: response});

      // Reload totals after setting send_shipping_information (delivery method chosen)
      // Force wait before proceeding to payment
      await dispatch(get_cart_total());

      return response;
    } catch (e) {
      throw e;
    }
  };

export interface IBillingAddress {
  countryId: string;
  region: string;
  street: string[];
  company: string;
  postcode: string;
  city: string;
  saveInAddressBook: number;
  firstname: string;
  lastname: string;
  telephone: string;
}

export const send_billing_address =
  (address: IBillingAddress) => async (dispatch, getState) => {
    const token = await dispatch(getValidCustomerToken(getState().auth.token));
    const cartId = getState().cart.cartId;

    const url = token
      ? `${API.url}rest/V1/carts/mine/billing-address`
      : `${API.url}rest/V1/guest-carts/${cartId}/billing-address`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && {Authorization: `Bearer ${token}`}),
        },
        body: JSON.stringify({cartId, address}),
      }).then(r => r.json());

      if (typeof response === 'object' && 'message' in response) {
        return Toast.show({
          type: 'error',
          text1: response.message,
          text2: 'send_billing_address',
          visibilityTime: 2000,
        });
      }

      return response;
    } catch (e) {
      throw e;
    }
  };

export interface IPaymentInformation {
  billingAddress: {
    countryId: string;
    region: string;
    street: string[];
    company?: string;
    postcode: string;
    city: string;
    firstname: string;
    lastname: string;
    telephone: string;
    saveInAddressBook: null;
  };
  paymentMethod: {
    method: string;
    additional_data?: any;
    extension_attributes?: {
      do_not_subscribe?: boolean;
      extra_envelope?: boolean;
    };
  };
  email: string;
}

export const send_payment_information =
  (values: IPaymentInformation) => async (dispatch, getState) => {
    const token = await dispatch(getValidCustomerToken(getState().auth.token));
    const cartId = getState().cart.cartId;
    const cart = getState().cart.cart;

    const url = token
      ? `${API.url}rest/V1/carts/mine/payment-information`
      : `${API.url}rest/V1/guest-carts/${cartId}/payment-information`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: '*/*',
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
          ...(token && {Authorization: `Bearer ${token}`}),
        },
        body: JSON.stringify({cartId: token ? cart.id : cartId, ...values}),
      }).then(r => r.json());

      if (typeof response === 'object' && 'message' in response) {
        return Toast.show({
          type: 'error',
          text1: response.message,
          text2: 'send_payment_information',
          visibilityTime: 2000,
        });
      }

      if (values.paymentMethod.method !== 'accessworldpay_creditcard') {
        dispatch({type: CLEAR_CART});
      }

      return response;
    } catch (e) {
      throw e;
    }
  };

export interface ITotalInformation {
  address: {
    country_id: string;
    region: string;
    postcode: string;
    city: string;
  };
  shipping_carrier_code: string;
  shipping_method_code: string;
}

export const send_total_information =
  (addressInformation: ITotalInformation) => async (dispatch, getState) => {
    const token = await dispatch(getValidCustomerToken(getState().auth.token));
    const cartId = getState().cart.cartId;

    const url = token
      ? `${API.url}rest/V1/carts/mine/totals-information`
      : `${API.url}rest/V1/guest-carts/${cartId}/totals-information`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && {Authorization: `Bearer ${token}`}),
        },
        body: JSON.stringify({addressInformation}),
      }).then(r => r.json());

      if (typeof response === 'object' && 'message' in response) {
        return Toast.show({
          type: 'error',
          text1: response.message,
          text2: 'send_total_information',
          visibilityTime: 2000,
        });
      }

      return response;
    } catch (e) {
      throw e;
    }
  };

export const add_coupon = (code: string) => async (dispatch, getState) => {
  const token = await dispatch(getValidCustomerToken(getState().auth.token));
  const cartId = getState().cart.cartId;

  dispatch({type: SET_COUPON_UPDATING, data: true});

  const url = token
    ? `${API.url}rest/V1/carts/mine/coupons/${code}`
    : `${API.url}rest/V1/guest-carts/${cartId}/coupons/${code}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'add_coupon',
        visibilityTime: 2000,
      });
    }

    await dispatch(get_cart_total());
    dispatch({type: ADD_COUPON, data: code});
    dispatch({type: SET_COUPON_UPDATING, data: false});

    return response;
  } catch (e) {
    throw e;
  }
};

export const get_coupon = () => async (dispatch, getState) => {
  const token = await dispatch(getValidCustomerToken(getState().auth.token));
  const cartId = getState().cart.cartId;

  const url = token
    ? `${API.url}rest/V1/carts/mine/coupons`
    : `${API.url}rest/V1/guest-carts/${cartId}/coupons`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'get_coupon',
        visibilityTime: 2000,
      });
    }

    const code = typeof response === 'string' ? response : '';

    dispatch({type: GET_COUPON, data: code});

    return response;
  } catch (e) {
    throw e;
  }
};

export const delete_coupon = () => async (dispatch, getState) => {
  const token = await dispatch(getValidCustomerToken(getState().auth.token));
  const cartId = getState().cart.cartId;

  dispatch({type: SET_COUPON_UPDATING, data: true});

  const url = token
    ? `${API.url}rest/V1/carts/mine/coupons`
    : `${API.url}rest/V1/guest-carts/${cartId}/coupons`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'delete_coupon',
        visibilityTime: 2000,
      });
    }

    await dispatch(get_cart_total());
    dispatch({type: DELETE_COUPON});

    dispatch({type: SET_COUPON_UPDATING, data: false});

    return response;
  } catch (e) {
    throw e;
  }
};
