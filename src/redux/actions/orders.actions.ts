// import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../../config/CONSTANTS';
import {
  ADD_ORDERS,
  CLEAR_CART,
  CLEAR_ORDERS,
  DELETE_COUPON,
  SELECT_ORDER,
} from '../const';
import Toast from 'react-native-toast-message';

const RYMAN_STORE_ID = 2;

export const get_orders = (customerId: string | number) => async dispatch => {
  try {
    const searchCriteria = `rest/V1/orders?\
searchCriteria[filterGroups][0][filters][0][field]=customer_id&\
searchCriteria[filterGroups][0][filters][0][value]=${customerId}&\
searchCriteria[filterGroups][0][filters][0][conditionType]=eq&\
\
searchCriteria[filterGroups][1][filters][1][field]=store_id&\
searchCriteria[filterGroups][1][filters][1][value]=${RYMAN_STORE_ID}&\
searchCriteria[filterGroups][1][filters][1][conditionType]=eq&\
\
searchCriteria[filterGroups][2][filters][2][field]=state&\
searchCriteria[filterGroups][2][filters][2][value]=closed,complete,holded,new,payment_review,processing&\
searchCriteria[filterGroups][2][filters][2][conditionType]=in&\
\
searchCriteria[sortOrders][0][field]=entity_id&\
searchCriteria[sortOrders][0][direction]=DESC`;

    const response = await fetch(`${API.url}${searchCriteria}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API.token}`,
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'get_orders',
        visibilityTime: 2000,
      });
    }

    dispatch({type: ADD_ORDERS, data: response.items});

    return response;
  } catch (e) {
    console.log(e);
  }
};

export const get_order = (orderId: string | number) => async dispatch => {
  try {
    const response = await fetch(`${API.url}rest/V1/orders/${orderId}`, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API.token}`,
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'get_order',
        visibilityTime: 2000,
      });
    }

    dispatch({type: CLEAR_CART});
    dispatch({type: DELETE_COUPON});

    return response;
  } catch (e) {
    console.log(e);
  }
};

export interface IChallengeResponse {
  outcome: 'challenged' | 'authenticated';
  jwt: string;
  url: string;
  md: string;
}

export const worldpay_challenge = (orderId: string | number) => async () => {
  try {
    const response = await fetch(
      `${API.url}rest/V1/worldpay-access-credit-card/${orderId}/challenge`,
      {
        method: 'get',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${API.token}`,
        },
      },
    ).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'worldpay_challenge',
        visibilityTime: 2000,
      });
    }

    return response as IChallengeResponse;
  } catch (e) {
    console.log(e);
  }
};

export const worldpay_is_verified = (orderId: string | number) => async () => {
  try {
    const response = await fetch(
      `${API.url}rest/V1/worldpay-access-credit-card/${orderId}/is-verified`,
      {
        method: 'get',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${API.token}`,
        },
      },
    ).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'worldpay_is_verified',
        visibilityTime: 2000,
      });
    }

    return response;
  } catch (e) {
    console.log(e);
  }
};

export const worldpay_restore_cart = (orderId: string | number) => async () => {
  try {
    const response = await fetch(
      `${API.url}rest/V1/worldpay-access-credit-card/quote/restore/${orderId}`,
      {
        method: 'post',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${API.token}`,
        },
      },
    ).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'worldpay_restore_cart',
        visibilityTime: 2000,
      });
    }

    return response;
  } catch (e) {
    console.log(e);
  }
};

export const select_order = (data: any) => async dispatch => {
  try {
    dispatch({type: SELECT_ORDER, data});
    return true;
  } catch (e) {
    console.error(e);
  }
};

export const clear_orders = () => (dispatch: (type: any) => void) => {
  dispatch({type: CLEAR_ORDERS});
};
