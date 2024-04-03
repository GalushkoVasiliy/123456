import {API} from '../../config/CONSTANTS';
import {getValidCustomerToken} from '../../utils/getValidCustomerToken';
import {
  GET_CART,
  GET_CART_TOTAL,
  CREATE_CART,
  MERGE_GUEST_CART_TO_USER_CART,
  GET_MASKED_CART,
  CLEAR_CART,
} from '../const';
import Toast from 'react-native-toast-message';
import {get_products_by_sku} from './products.actions';
import analytics from '@react-native-firebase/analytics';

export const create_cart = () => async (dispatch, getState) => {
  const token = await dispatch(getValidCustomerToken(getState().auth.token));
  const url = token
    ? `${API.url}rest/V1/carts/mine`
    : `${API.url}rest/V1/guest-carts`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'create_cart',
        visibilityTime: 2000,
      });
    }

    dispatch({type: CREATE_CART, data: response});
    dispatch(get_cart());
    dispatch(get_cart_total());

    return response;
  } catch (e) {
    console.error(e);
  }
};

export interface IAddToCart {
  sku: string | number;
  qty: number;
  quote_id?: string;
}

export const add_to_cart =
  ({sku, qty, quote_id}: IAddToCart) =>
  async (dispatch, getState) => {
    const token = await dispatch(getValidCustomerToken(getState().auth.token));
    const cartId = getState().cart.cartId;

    const url = token
      ? `${API.url}rest/V1/carts/mine/items`
      : `${API.url}rest/V1/guest-carts/${cartId}/items`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          cartItem: {sku, qty, quote_id},
        }),
        headers: {
          'Content-Type': 'application/json',
          ...(token && {Authorization: `Bearer ${token}`}),
        },
      }).then(r => r.json());

      if (typeof response === 'object' && 'message' in response) {
        return Toast.show({
          type: 'error',
          text1: response.message,
          text2: 'add_to_cart',
          visibilityTime: 2000,
        });
      }

      dispatch(get_cart());
      const totals = dispatch(get_cart_total());

      const item_data = {
        item_id: response['sku'],
        item_name: response['name'],
        quantity: qty
      };
      analytics().logAddToCart({currency:'GBP', value: qty * response['price'], items: [item_data]});

      return response;
    } catch (e) {
      console.error(e);
    }
  };

export const remove_non_dnb_products =
  (cartItems: any) => async (dispatch, getState) => {
    const skus = cartItems.map(({sku}) => sku);
    let itemsToRemove = [];
    if (skus.length > 0) {
      itemsToRemove = await dispatch(get_products_by_sku(skus)).then(items => {
        let itemsToRemove: any[] = [];
        if (items) {
          items.forEach(item => {
            const isDnb = item.custom_attributes.find(
              ({attribute_code}: any) => attribute_code === 'is_dnb',
            );
            // Remove any non-dnb products from basket
            if (!isDnb || isDnb.value == '0') {
              const cartItem = cartItems.find(({sku}: any) => sku === item.sku);
              if (cartItem) {
                itemsToRemove.push(cartItem);
              }
            }
          });
        }

        return itemsToRemove;
      });
    }

    for (let i = 0; i < itemsToRemove.length; i++) {
      await dispatch(remove_item_from_cart(itemsToRemove[i].item_id, false));
    }

    return itemsToRemove.length > 0;
  };

export const get_cart = () => async (dispatch, getState) => {
  const token = await dispatch(getValidCustomerToken(getState().auth.token));
  const cartId = getState().cart.cartId;

  if (!cartId && !token) {
    return;
  }

  const url = token
    ? `${API.url}rest/V1/carts/mine`
    : `${API.url}rest/V1/guest-carts/${cartId}`;

  try {
    let response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return dispatch({type: CLEAR_CART});
    }

    // if (response.items) {
    //   const removed = await dispatch(remove_non_dnb_products(response.items));
    //   if (removed) {
    //     response = await fetch(url, {
    //       method: 'GET',
    //       headers: {
    //         Accept: 'application/json',
    //         ...(token && {Authorization: `Bearer ${token}`}),
    //       },
    //     }).then(r => r.json());
    //   }
    //
    //   dispatch({type: GET_CART, data: response});
    // }

    dispatch({type: GET_CART, data: response});

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const get_cart_total = () => async (dispatch, getState) => {
  const token = await dispatch(getValidCustomerToken(getState().auth.token));
  const cartId = getState().cart.cartId;

  if (!cartId && !token) {
    return;
  }

  const url = token
    ? `${API.url}rest/V1/carts/mine/totals`
    : `${API.url}rest/V1/guest-carts/${cartId}/totals`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(token && {Authorization: `Bearer ${token}`}),
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return dispatch({type: CLEAR_CART});
    }

    dispatch({type: GET_CART_TOTAL, data: response});

    return response;
  } catch (e) {
    console.error(e);
  }
};

export const merge_guest_cart_to_user_cart =
  (customerId: string | number) => async (dispatch, getState) => {
    const token = await dispatch(getValidCustomerToken(getState().auth.token));
    const cartId = getState().cart.cartId;
    const storeId = getState().cart.cart.store_id;

    try {
      const response = await fetch(`${API.url}rest/V1/guest-carts/${cartId}`, {
        method: 'PUT',
        body: JSON.stringify({storeId, customerId}),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }).then(r => r.json());

      if (typeof response === 'object' && 'message' in response) {
        return Toast.show({
          type: 'error',
          text1: response.message,
          text2: 'merge_guest_cart_to_user_cart',
          visibilityTime: 2000,
        });
      }

      dispatch({type: MERGE_GUEST_CART_TO_USER_CART, data: response});

      return response;
    } catch (e) {
      console.error(e);
    }
  };

export const get_masked_cart = () => async (dispatch, getState) => {
  const cartId = getState().cart.cartId;

  try {
    const response = await fetch(`${API.url}rest/V1/guest-carts/${cartId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }).then(r => r.json());

    if (typeof response === 'object' && 'message' in response) {
      return Toast.show({
        type: 'error',
        text1: response.message,
        text2: 'get_masked_cart',
        visibilityTime: 2000,
      });
    }

    dispatch({type: GET_MASKED_CART, data: response.id});

    return response;
  } catch (e) {
    console.error(e);
  }
};

export type RemoveType = string | number;

export const remove_item_from_cart =
  (itemId: RemoveType, reloadCartAfterDelete: boolean) =>
  async (dispatch, getState) => {
    const token = await dispatch(getValidCustomerToken(getState().auth.token));
    const cartId = getState().cart.cartId;

    const url = token
      ? `${API.url}rest/V1/carts/mine/items/${itemId}`
      : `${API.url}rest/V1/guest-carts/${cartId}/items/${itemId}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          ...(token && {Authorization: `Bearer ${token}`}),
        },
      }).then(r => r.json());

      if (typeof response === 'object' && 'message' in response) {
        return Toast.show({
          type: 'error',
          text1: response.message,
          text2: 'remove_item_from_cart',
          visibilityTime: 2000,
        });
      }

      if (reloadCartAfterDelete) {
        dispatch(get_cart());
        dispatch(get_cart_total());
      }

      return response;
    } catch (e) {
      console.error(e);
    }
  };
