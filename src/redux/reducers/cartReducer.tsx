import {
  ADD_TO_CART,
  GET_CART,
  GET_CART_TOTAL,
  CREATE_CART,
  CLEAR_CART,
  GET_MASKED_CART,
  LOGOUT,
  CLEAR_GIFT_CART,
} from '../const';

interface Address {
  id: number;
  region: string;
  region_id: null;
  region_code: string;
  country_id: string;
  street: string[];
  telephone: string;
  postcode: string;
  city: string;
  firstname: string;
  lastname: string;
  email: string;
  same_as_billing: number;
  save_in_address_book: number;
}

interface Currency {
  global_currency_code: string;
  base_currency_code: string;
  store_currency_code: string;
  quote_currency_code: string;
  store_to_base_rate: number;
  store_to_quote_rate: number;
  base_to_global_rate: number;
  base_to_quote_rate: number;
}

interface Customer {
  email: null | string;
  firstname: null | string;
  lastname: null | string;
}

interface GiftInformation {
  gift_products: string[];
  gift_products_cross_sell: string[];
  is_gift_product_already_added: boolean;
}

interface ExtensionAttributes {
  shipping_assignments: ShippingAssignment[];
  gift_information?: GiftInformation;
}

interface ShippingAssignment {
  shipping: Shipping;
  items: Item[];
}

export interface Item {
  item_id: number;
  sku: string;
  qty: number;
  name: string;
  price: number;
  price_incl_tax: number;
  product_type: string;
  quote_id: string;
  dnb_image_url: string;
}

interface Shipping {
  address: Address;
  method: string;
}

export interface Cart {
  id: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_virtual: boolean;
  items: Item[];
  items_count: number;
  items_qty: number;
  customer: Customer;
  billing_address: Address;
  orig_order_id: number;
  currency: Currency;
  customer_is_guest: boolean;
  customer_note_notify: boolean;
  customer_tax_class_id: number;
  store_id: number;
  extension_attributes: ExtensionAttributes;
}

export interface CartState {
  cartId: string | number | null;
  maskedId: string | number | null;
  cart: Cart | null;
  total: any;
  giftCards: string[];
}

const initialState: CartState = {
  cartId: null,
  maskedId: null,
  cart: null,
  total: null,
  giftCards: [],
};

const cartReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CREATE_CART: {
      return {...state, cartId: action.data};
    }

    case ADD_TO_CART: {
      const prevItems = !state.cart ? [] : state.cart.items;
      return {
        ...state,
        cart: {
          ...state.cart,
          items: [...prevItems, action.data],
        },
      };
    }

    case LOGOUT: {
      return {
        ...initialState,
      };
    }

    case CLEAR_CART: {
      return {
        ...initialState,
        giftCards: state.giftCards,
      };
    }

    case CLEAR_GIFT_CART: {
      return {
        ...state,
        giftCards: [],
      };
    }

    case GET_CART: {
      action.data.items?.map((elem: any) => {
        const dnbImageUrl = elem.extension_attributes?.dnb_image_url;
        if (dnbImageUrl) {
          elem['dnb_image_url'] = dnbImageUrl;
        }
      });
      return {
        ...state,
        cart: action.data,
        giftCards:
          action.data?.extension_attributes?.gift_information
            ?.gift_products_cross_sell || [],
      };
    }

    case GET_CART_TOTAL: {
      let cart = state.cart;
      if (cart) {
        // Take item price_incl_tax from totals
        // action.data.items?.map((elem: any) => {
        //   cart?.items.map(elemCart => {
        //     if (elem.item_id == elemCart.item_id) {
        //       elemCart['price_incl_tax'] = elem.price_incl_tax;
        //     }
        //   });
        // });
        // Take item sku and dnb_image_url from items
        action.data.items?.map((elem: any) => {
          cart?.items.map(elemCart => {
            if (elem.item_id == elemCart.item_id) {
              // elemCart['price_incl_tax'] = elem.price_incl_tax;
              elem['sku'] = elemCart.sku;
              elem['dnb_image_url'] = elemCart.dnb_image_url;
            }
          });
        });
      }
      return {...state, total: action.data};
    }

    case GET_MASKED_CART: {
      return {...state, maskedId: action.data};
    }

    default:
      return state;
  }
};

export default cartReducer;
