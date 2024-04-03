import {GET_REWARD_BALANCE, LOGOUT} from '../const';

export interface RewardsState {
  balance: number;
}

const initialState: RewardsState = {
  balance: 0,
};

const rewardsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_REWARD_BALANCE: {
      return {...state, balance: action.data};
    }

    case LOGOUT: {
      return {...state, balance: 0};
    }

    default:
      return state;
  }
};

export default rewardsReducer;
