import {LOGIN, GET_PROFILE, LOGOUT, DELETE_MY_ACCOUNT} from '../const';

export interface CustomerToken {
  token: string;
  expiry: number;
}

export interface AuthState {
  token: CustomerToken | null;
  profile: any;
  selectedAddress: number | null;
  deleteRequested: boolean;
}

const initialState: AuthState = {
  token: null,
  profile: null,
  selectedAddress: null,
  deleteRequested: false
};



const authReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        token: action.token,
      };
    }

    case LOGOUT: {
      return initialState;
    }

    case GET_PROFILE: {
      return {...state, profile: action.data};
    }

    case DELETE_MY_ACCOUNT: {
      return {...state, deleteRequested: action.data};
    }

    default:
      return state;
  }
};

export default authReducer;
