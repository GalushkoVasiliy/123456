// import AsyncStorage from '@react-native-async-storage/async-storage';
import {API, SELECTED_STAGE} from '../../config/CONSTANTS';
import {
  ADD_CATEGORIES,
  ADD_PRODUCTS,
  CLEAR_CATEGORIES,
  PRODUCT_FILTERS,
  SELECT_CATEGORY,
} from '../const';
import Toast from 'react-native-toast-message';
import {get_products_by_id, ISearchProducts} from './products.actions';

export const get_categories = (params: any) => async dispatch => {
  try {
    const response = await fetch(
      `${API.url}rest/V1/categories?searchCriteria[filter_groups][2][filters][0][field]=store_id&searchCriteria[filter_groups][2][filters][0][condition_type]=equal&searchCriteria[filter_groups][2][filters][0][value]=2`,
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
        text2: 'get_categories',
        visibilityTime: 2000,
      });
    }

    dispatch({type: ADD_CATEGORIES, data: response});

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const select_category = (category: any) => async dispatch => {
  try {
    dispatch({type: SELECT_CATEGORY, data: category});
    return true;
  } catch (e) {
    console.error(e);
  }
};

export const clear_categories = () => (dispatch: (type: any) => void) => {
  dispatch({type: CLEAR_CATEGORIES});
};

export const get_category_by_id = (id: string | number) => async () => {
  try {
    const response = await fetch(`${API.url}rest/V1/categories/${id}`, {
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
        text2: 'get_category_by_id',
        visibilityTime: 2000,
      });
    }

    return response;
  } catch (e) {
    console.error(e);
  }
};
