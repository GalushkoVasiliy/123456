import {
  ADD_PRODUCTS,
  CLEAR_PRODUCTS,
  ADD_TO_BASKET_IN_PROGRESS,
  PRODUCT_FILTERS,
  SELECT_PRODUCT,
  LOGOUT,
} from '../const';

export interface Product {
  id: number;
  sku: string;
  name: string;
  attribute_set_id: number;
  price: number;
  status: number;
  visibility: number;
  type_id: string;
  created_at: string;
  updated_at: string;
  product_links: any[];
  options: any[];
  tier_prices: any[];
  custom_attributes: {
    attribute_code: string;
    value: string;
  }[];
  media_gallery_entries: {
    id: number;
    media_type: 'image';
    label: null;
    position: null;
    disabled: boolean;
    types: string[];
    file: string;
  }[];
  extension_attributes: {
    website_ids: number[];
    category_links: {
      position: number;
      category_id: string;
    }[];
    configurable_product_options: [
      {
        id: number;
        attribute_id: string;
        label: string;
        position: number;
        values: {
          value_index: number;
        }[];
        product_id: number;
      },
    ];
    configurable_product_links: number[];
  };
}

export interface ProductsState {
  products: Product[];
  singleProduct: Product | null;
  searchFilters: {name: string; values: any[]}[];
  isAddToBasketInProgress: boolean;
}

const initialState: ProductsState = {
  products: [],
  singleProduct: null,
  searchFilters: [],
  isAddToBasketInProgress: false,
};

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCTS: {
      return {...state, products: action.data};
    }

    case SELECT_PRODUCT: {
      return {...state, singleProduct: action.data};
    }

    case PRODUCT_FILTERS: {
      return {...state, searchFilters: action.data};
    }

    case LOGOUT:
    case CLEAR_PRODUCTS: {
      return {...state, products: [], searchFilters: []};
    }
    case ADD_TO_BASKET_IN_PROGRESS:
      return {...state, isAddToBasketInProgress: action.data};

    default: {
      return state;
    }
  }
};

export default productsReducer;
