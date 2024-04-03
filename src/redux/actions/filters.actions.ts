// import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../../config/CONSTANTS';
import {GET_PRODUCT_FILTER} from '../const';
import Toast from 'react-native-toast-message';

export const get_product_filter = () => async dispatch => {
  try {
    const response = await fetch(
      `${API.url}rest/V1/products/attributes?searchCriteria[filter_groups][0][filters][0][field]=is_filterable&searchCriteria[filter_groups][0][filters][0][value]=0&searchCriteria[filter_groups][0][filters][0][condition_type]=gt&searchCriteria[filter_groups][1][filters][0][field]=is_filterable_in_search&searchCriteria[filter_groups][1][filters][0][value]=0&searchCriteria[filter_groups][1][filters][0][condition_type]=gt`,
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
        text2: 'get_product_filter',
        visibilityTime: 2000,
      });
    }

    dispatch({type: GET_PRODUCT_FILTER, data: response.items});

    return response.items;
  } catch (e) {
    console.error(e);
  }
};

export const get_filter_options = (name: string) => async dispatch => {
  try {
    const response = await fetch(
      `${API.url}rest/V1/products/attributes/${name}/options`,
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
        text2: 'get_filter_options',
        visibilityTime: 2000,
      });
    }

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const get_category_options =
  (categoryId: string | number) => async dispatch => {
    try {
      const response = await fetch(
        `${API.url}rest/V1/categories?rootCategoryId=${categoryId}`,
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
          text2: 'get_category_options',
          visibilityTime: 2000,
        });
      }

      return response;
    } catch (e) {
      console.error(e);
    }
  };
