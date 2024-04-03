import {combineReducers} from 'redux';
import categoriesReducer, {CategoriesState} from './categoriesReducer';
import productsReducer, {ProductsState} from './productsReducer';
import cartReducer, {CartState} from './cartReducer';
import authReducer, {AuthState} from './authReducer';
import storeReducer, {StoresState} from './storesReducer';
import checkoutReducer, {CheckoutState} from './checkoutReducer';
import rewardReducer, {RewardsState} from './rewardsReducer';
import ordersReducer, {OrdersState} from './ordersReducer';
import filtersReducer, {FiltersState} from './filtersReducer';
import cmsReducer, {CmsState} from './cmsReducer';

export interface ReducerType {
  categories: CategoriesState;
  products: ProductsState;
  cart: CartState;
  auth: AuthState;
  stores: StoresState;
  checkout: CheckoutState;
  rewards: RewardsState;
  orders: OrdersState;
  filters: FiltersState;
  cms: CmsState;
}

const rootReducer = combineReducers({
  categories: categoriesReducer,
  products: productsReducer,
  cart: cartReducer,
  auth: authReducer,
  stores: storeReducer,
  checkout: checkoutReducer,
  rewards: rewardReducer,
  orders: ordersReducer,
  filters: filtersReducer,
  cms: cmsReducer,
});

export default rootReducer;
