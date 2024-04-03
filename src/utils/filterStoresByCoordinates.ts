import {Store} from '../redux/reducers/storesReducer';

const RADIUS = 50;

export const haversine = (
  currentLat: number,
  currentLon: number,
  itemLat: number,
  itemLon: number,
) => {
  const R = 3958.8;
  const dLat = (itemLat - currentLat) * (Math.PI / 180);
  const dLon = (itemLon - currentLon) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(currentLat * (Math.PI / 180)) *
      Math.cos(currentLon * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

export const filterStoresByCoordinates = (
  stores: Store[],
  current: {latitude: number; longitude: number},
): Store[] => {
  const storesWithinRadius = stores.filter(store => {
    store.distance = haversine(
      current.latitude,
      current.longitude,
      store.latitude,
      store.longitude,
    );
    return store.distance <= RADIUS;
  });
  return storesWithinRadius;
};
