import {API} from '../../config/CONSTANTS';
import {
  LOGIN,
  FORGOT_PASSWORD,
  GET_PROFILE,
  TOKEN_EXPIRY,
  LOGOUT,
} from '../const';
import {
  get_cart,
  get_cart_total,
  merge_guest_cart_to_user_cart,
} from './cart.actions';
import Toast from 'react-native-toast-message';
import * as Keychain from 'react-native-keychain';
import {getValidCustomerToken} from '../../utils/getValidCustomerToken';
import {CustomerToken} from '../reducers/authReducer';
import analytics from '@react-native-firebase/analytics';

export interface ILogin {
  username: string;
  password: string;
}

export const login = (body: ILogin) => async (dispatch, getState) => {
  const cartId = getState().cart.cartId;

  try {
    const response = await fetch(
      `${API.url}rest/V1/integration/customer/token`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    ).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'login',
        visibilityTime: 2000,
      });
    }

    // Store the credentials to be able to request a new token once this one expires
    await Keychain.setGenericPassword(body.username, body.password);

    const token = {
      token: response,
      expiry: new Date().getTime() + TOKEN_EXPIRY,
    };
    await dispatch({type: LOGIN, token: token});
    const profile = await dispatch(get_profile(token));

    if (cartId) {
      await dispatch(merge_guest_cart_to_user_cart(profile.id));
    }
    await dispatch(get_cart());
    await dispatch(get_cart_total());

    await analytics().logLogin({method: profile.id.toString()});

    return {token: response, profile};
  } catch (e) {
    console.error(e);
  }
};

export interface IRegister {
  customer: {
    email: string;
    firstname: string;
    lastname: string;
    website_id: string;
    addresses: [
      {
        defaultShipping: boolean;
        defaultBilling: boolean;
        firstname: string;
        lastname: string;
        region?: {
          regionCode: string;
          region: string;
          regionId: number;
        };
        company: string;
        postcode: string;
        street: string[];
        city: string;
        telephone: string;
        countryId: string;
      },
    ];
  };
  password: string;
}

export const register = (body: IRegister) => async dispatch => {
  try {
    const response = await fetch(`${API.url}rest/V1/customers`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'register',
        visibilityTime: 2000,
      });
      return false;
    }

    await dispatch(
      login({
        username: response.email,
        password: body.password,
      }),
    );

    await analytics().logSignUp({method: 'Google'});

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const forgot_password = (email: string) => async dispatch => {
  try {
    const response = await fetch(`${API.url}rest/V1/customers/password`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API.token}`,
      },
      body: JSON.stringify({email, template: 'email_reset'}),
    }).then(r => r.json());

    // If email provided doesn't exist, magento return an error msg: No such entity...
    // In such cases we return true to display the generic message to the user (If there is an account associated with...)
    if (
      typeof response === 'object' &&
      'message' in response &&
      response.message.startsWith('No such entity')
    ) {
      return true;
    }

    dispatch({type: FORGOT_PASSWORD, data: response});

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const get_profile = (token: CustomerToken) => async dispatch => {
  try {
    const validToken = await dispatch(getValidCustomerToken(token));
    const OBFUSCATED_EMAIL_START = 'myclub+';
    const OBFUSCATED_EMAIL_END = '@tprg.com';

    const response = await fetch(`${API.url}rest/V1/customers/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${validToken}`,
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'get_profile',
        visibilityTime: 2000,
      });
    }

    // Check if delete request completed
    if (
      response.email.indexOf(OBFUSCATED_EMAIL_START) == 0 &&
      response.email.indexOf(OBFUSCATED_EMAIL_END)
    ) {
      await dispatch({type: LOGOUT});
      Toast.show({
        type: 'error',
        text1:
          'We have completed your request to delete your Ryman Rewards account. You are now logged out.',
        text2: 'login',
        visibilityTime: 4000,
      });
      return false;
    }
    await dispatch({type: GET_PROFILE, data: response});

    return response;
  } catch (e) {
    console.error(e);
  }
};
