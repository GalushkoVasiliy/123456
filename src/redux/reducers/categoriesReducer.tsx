import {
  ADD_CATEGORIES,
  CLEAR_CATEGORIES,
  LOGOUT,
  SELECT_CATEGORY,
} from '../const';

export interface CategoriesState {
  categories: any[];
  singleCategory: any;
}

const initialState: CategoriesState = {
  categories: [],
  singleCategory: null,
};

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CATEGORIES: {
      return {...state, categories: action.data};
    }
    case SELECT_CATEGORY: {
      return {...state, singleCategory: action.data};
    }
    case LOGOUT:
    case CLEAR_CATEGORIES: {
      return {...state, categories: []};
    }
    default:
      return state;
  }
};

export default categoriesReducer;
