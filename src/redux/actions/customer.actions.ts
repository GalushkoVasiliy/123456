// import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {API} from '../../config/CONSTANTS';
import {DELETE_MY_ACCOUNT, GET_PROFILE} from '../const';
import {CustomerToken} from '../reducers/authReducer';
import {getValidCustomerToken} from '../../utils/getValidCustomerToken';

export interface ICustomer {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  website_id?: string;
}

export interface ICustomerAddress {
  id: string;
  addresses: Array<any>;
}

export const update_profile =
  (body: ICustomer) => async (dispatch, getState) => {
    try {
      const validToken = await dispatch(
        getValidCustomerToken(getState().auth.token),
      );

      const response = await fetch(`${API.url}rest/V1/customers/me`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${validToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({customer: body}),
      }).then(r => r.json());

      if (typeof response === 'object' && 'message' in response) {
        return Toast.show({
          type: 'error',
          text1: response.message,
          text2: 'update_profile',
          visibilityTime: 2000,
        });
      }

      dispatch({type: GET_PROFILE, data: response});

      return {data: response, updated: true};
    } catch (e) {
      console.log(e);
    }
  };

export const update_profile_addresses =
  (customerId: string | number, body: ICustomerAddress) =>
  async (dispatch, getState) => {
    const token = await dispatch(getValidCustomerToken(getState().auth.token));
    const url = token
      ? `${API.url}rest/V1/customers/me`
      : `${API.url}rest/V1/customers/${customerId}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token && {Authorization: `Bearer ${token}`}),
        },
        body: JSON.stringify({customer: body}),
      }).then(r => r.json());

      if (typeof response === 'object' && 'message' in response) {
        return Toast.show({
          type: 'error',
          text1: response.message,
          text2: 'update_profile_addresses',
          visibilityTime: 2000,
        });
      }

      dispatch({type: GET_PROFILE, data: response});

      return {data: response, updated: true};
    } catch (e) {
      console.log(e);
    }
  };

export interface IDeleteRequest {
  store_code: string;
  first_name: string;
  last_name: string;
  email_address: string;
  type: string;
  source: string;
  status: string;
}

export const myclub_delete = (body: IDeleteRequest) => async dispatch => {
  try {
    const response = await fetch(`${API.url}rest/V1/myclub_delete/request`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({request: body}),
    }).then(r => r.json());

    if (!isNaN(response)) {
      dispatch({type: DELETE_MY_ACCOUNT, data: true});
    }

    return response;
  } catch (e) {
    console.log(e);
  }
};
