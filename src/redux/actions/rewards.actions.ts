// import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../../config/CONSTANTS';
import {GET_REWARD_BALANCE} from '../const';
import Toast from 'react-native-toast-message';
import {get_cart_total} from '../../redux/actions/cart.actions';
import {getValidCustomerToken} from '../../utils/getValidCustomerToken';
import {CustomerToken} from '../reducers/authReducer';

export const get_reward_balance =
  (customerId: string | number) => async dispatch => {
    try {
      const response = await fetch(
        `${API.url}rest/V1/membership/balance/store/2/card/${customerId}/branchcode/2/`,
        {
          method: 'GET',
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
          text2: 'get_reward_balance',
          visibilityTime: 2000,
        });
      }

      dispatch({type: GET_REWARD_BALANCE, data: response.points});

      return response;
    } catch (e) {
      console.error(e);
    }
  };

export interface IReceipt {
  posNum: string;
  transId: string;
  totalAmount: string;
}

export const add_receipt =
  (token: CustomerToken | null, body: IReceipt) => async dispatch => {
    try {
      const validToken = await dispatch(getValidCustomerToken(token));
      const response = await fetch(
        `${API.url}rest/V1/membership/me/orderFind/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${validToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            findRequestData: {
              trans_id: body.transId,
              total_amount: body.totalAmount,
              pos_num: body.posNum,
            },
          }),
        },
      ).then(r => r.json());

      return response;
    } catch (e) {
      console.log(e);
    }
  };

export const use_reward_points = () => async (dispatch, getState) => {
  try {
    const validToken = await dispatch(
      getValidCustomerToken(getState().auth.token),
    );

    const response = await fetch(`${API.url}rest/V1/reward/mine/use-reward/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${validToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'remove_item_from_cart',
        visibilityTime: 2000,
      });
    }

    await dispatch(get_cart_total());

    return response;
  } catch (e) {
    console.log(e);
  }
};

export const remove_reward_points = () => async (dispatch, getState) => {
  try {
    const validToken = await dispatch(
      getValidCustomerToken(getState().auth.token),
    );

    const response = await fetch(
      `${API.url}rest/V1/reward/mine/remove-reward/`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${validToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      },
    ).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'remove_item_from_cart',
        visibilityTime: 2000,
      });
    }

    await dispatch(get_cart_total());

    return response;
  } catch (e) {
    console.log(e);
  }
};
