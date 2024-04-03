import {ADD_ORDERS, CLEAR_ORDERS, SELECT_ORDER} from '../const';
import {LOGOUT} from '../const';

export interface OrdersState {
  orders: any[];
  singleOrder: any;
}

const initialState: OrdersState = {
  orders: [],
  singleOrder: null,
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDERS:
      return {...state, orders: action.data};
    case LOGOUT:
    case CLEAR_ORDERS:
      return {...state, orders: []};
    case SELECT_ORDER:
      return {...state, singleOrder: action.data};
    default:
      return state;
  }
};

export default ordersReducer;
