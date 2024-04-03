// import AsyncStorage from '@react-native-async-storage/async-storage';
import {API, SELECTED_STAGE} from '../../config/CONSTANTS';
import {GET_STORES, CLEAR_STORES} from '../const';
import Toast from 'react-native-toast-message';

export const get_stores = () => async (dispatch: any) => {
  try {
    const response = await fetch(
      `${API.url}rest/V1/dnb/click-and-collect/get-collection-points`,
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
        text2: 'get_stores',
        visibilityTime: 2000,
      });
    }

    dispatch({type: GET_STORES, data: response});

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const clear_stores = () => (dispatch: (type: any) => void) => {
  dispatch({type: CLEAR_STORES});
};
