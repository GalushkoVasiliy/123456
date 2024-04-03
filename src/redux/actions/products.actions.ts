// import AsyncStorage from '@react-native-async-storage/async-storage';
import {API} from '../../config/CONSTANTS';
import {
  ADD_PRODUCTS,
  CLEAR_PRODUCTS,
  PRODUCT_FILTERS,
  SELECT_PRODUCT,
} from '../const';
import {
  getProductsFilter,
  ProductsFilterProps,
} from '../../utils/getProductsFilter';
import Toast from 'react-native-toast-message';
import {Product} from '../reducers/productsReducer';

export const get_products =
  (id: string, filters?: ProductsFilterProps['filterGroups']) =>
  async dispatch => {
    const params = getProductsFilter({
      filterGroups: [
        [
          {
            type: 'eq',
            field: 'category_id',
            value: id,
          },
        ],
        [
          {
            type: 'eq',
            field: 'status',
            value: 1,
          },
        ],
        [
          {
            type: 'in',
            field: 'visibility',
            value: '2,4',
          },
        ],
        [
          {
            type: 'eq',
            field: 'store_id',
            value: 2,
          },
        ],
        ...(filters ?? []),
      ],
    });

    try {
      const response = await fetch(`${API.url}rest/V1/products${params}`, {
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
          text2: 'get_products',
          visibilityTime: 2000,
        });
      }

      dispatch({type: ADD_PRODUCTS, data: response.items});

      return response.items;
    } catch (e) {
      console.error(e);
    }
  };

export interface ISearchProducts {
  categoryId: string;
  search: string;
  filters?: ProductsFilterProps['filterGroups'];
  page?: number;
  perPage?: number;
}

export const search_products =
  ({categoryId, search, filters, page, perPage}: ISearchProducts) =>
  async dispatch => {
    const params = getProductsFilter({
      requestName: 'quick_search_container',
      perPage: perPage,
      page: page,
      filterGroups: [
        [
          {
            type: 'eq',
            field: 'category_ids',
            value: categoryId,
          },
        ],
        [
          {
            type: 'eq',
            field: 'visibility',
            value: 4,
          },
        ],
        [
          {
            type: 'eq',
            field: 'status',
            value: 1,
          },
        ],
        [
          {
            type: 'eq',
            field: 'store_id',
            value: 2,
          },
        ],
        [
          {
            type: 'eq',
            field: 'is_available_for_app',
            value: 1,
          },
        ],
        ...(!search
          ? []
          : [
              [
                {
                  type: 'eq',
                  field: 'search_term',
                  value: search,
                },
              ],
            ]),
        ...(filters ?? []),
      ],
    });
    try {
      const response = await fetch(`${API.url}rest/V1/search${params}`, {
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
          text2: 'search_products',
          visibilityTime: 2000,
        });
      }

      const availableFilters = response.aggregations.buckets
        .filter(item => item.values.length > 0)
        .map(({name, values}) => ({
          values,
          name: name.replace('_bucket', ''),
        }));

      dispatch({type: PRODUCT_FILTERS, data: availableFilters});

      const productIds: number[] = response.items.map(
        ({id}: {id: number}) => id,
      );

      const products = await dispatch(get_products_by_id(productIds));

      dispatch({type: ADD_PRODUCTS, data: products});

      return response;
    } catch (e) {
      console.error(e);
    }
  };

export const get_products_by_id = (ids: number[]) => async () => {
  if (!ids.length) {
    return [];
  }

  const params = getProductsFilter({
    filters: ids.map(id => ({
      type: 'equal',
      field: 'entity_id',
      value: id,
    })),
  });
  try {
    const response = await fetch(`${API.url}rest/V1/products${params}`, {
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
        text2: 'get_products_by_id',
        visibilityTime: 2000,
      });
    }

    return response.items;
  } catch (e) {
    console.error(e);
  }
};

export const get_products_by_sku = (skus: string[]) => async () => {
  const params = getProductsFilter({
    filters: skus.map(sku => ({
      type: 'equal',
      field: 'sku',
      value: sku,
    })),
  });
  try {
    const response = await fetch(`${API.url}rest/V1/products${params}`, {
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
        text2: 'get_products_by_sku',
        visibilityTime: 2000,
      });
    }

    return response.items;
  } catch (e) {
    console.error(e);
  }
};

export const get_single_product_by_sku = (sku: string) => async () => {
  try {
    const response = await fetch(`${API.url}rest/V1/products/${sku}`, {
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
        text2: 'get_single_product_by_sku',
        visibilityTime: 2000,
      });
    }

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const select_product = (product: Product) => async dispatch => {
  try {
    dispatch({type: SELECT_PRODUCT, data: product});
    return true;
  } catch (e) {
    console.error(e);
  }
};

export const clear_products = () => dispatch => {
  dispatch({type: CLEAR_PRODUCTS});
};
