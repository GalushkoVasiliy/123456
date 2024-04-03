// import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../../config/CONSTANTS';
import {GET_CMS_BLOCK} from '../const';
import Toast from 'react-native-toast-message';

export const get_cms_block = (blockId: string | number) => async dispatch => {
  try {
    const response = await fetch(`${API.url}rest/V1/cmsBlock/${blockId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API.token}`,
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({visibilityTime: 2000, type: 'error', text1: response.message});
    }

    dispatch({type: GET_CMS_BLOCK, data: response.content});

    return response.content;
  } catch (e) {
    console.error(e);
  }
};
