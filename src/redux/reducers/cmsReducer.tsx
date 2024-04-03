import {GET_CMS_BLOCK} from '../const/cms';

export interface CmsState {
  delete_my_account: string;
}

const initialState: CmsState = {
  delete_my_account: '',
};

const cmsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CMS_BLOCK:
      return {...state, delete_my_account: action.data};

    default:
      return state;
  }
};

export default cmsReducer;
