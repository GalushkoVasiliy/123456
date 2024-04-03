import {GET_PRODUCT_FILTER, LOGOUT} from '../const';

export interface FiltersState {
  products: any[];
}

const initialState: FiltersState = {
  products: [],
};

const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCT_FILTER: {
      return {...state, products: action.data};
    }

    case LOGOUT: {
      return initialState;
    }

    default: {
      return state;
    }
  }
};

export default filtersReducer;
