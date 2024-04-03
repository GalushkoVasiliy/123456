import {GET_STORES, CLEAR_STORES, LOGOUT} from '../const';

export type Store = {
  id: number;
  name: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  image: string;
  address: string;
  address_line2: string;
  city: string;
  region: string;
  region_id: number;
  postcode: string;
  country: string;
  country_id: string;
  opening_hours: string[];
  brand_text: string;
  brand_code: string;
  branch_code: string;
  distance: number;
};

export interface StoresState {
  stores: Store[];
}

const initialState: StoresState = {
  stores: [],
};

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_STORES:
      return {...state, stores: action.data};
    case LOGOUT:
    case CLEAR_STORES:
      return {...state, stores: []};
    default:
      return state;
  }
};

export default storeReducer;
