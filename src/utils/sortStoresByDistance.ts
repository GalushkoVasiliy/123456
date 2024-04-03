import {Store} from '../redux/reducers/storesReducer';

// When searching, do not show more than the closest MAX_STORES
const MAX_STORES = 10;

export const sortStoresByDistance = (stores: Store[]): Store[] => {
  const storesSorted = stores.sort((a, b) => {
    return a.distance - b.distance;
  });
  return storesSorted.slice(0, MAX_STORES);
}