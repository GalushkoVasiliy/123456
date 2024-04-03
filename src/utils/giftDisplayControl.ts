import AsyncStorage from '@react-native-async-storage/async-storage';

const QUOTE_CACHE_KEY = 'Quote_';

export function setIsGiftDisplayed(quoteId: string | number) {
  AsyncStorage.setItem(`${QUOTE_CACHE_KEY}${quoteId}`, 'true');
}

export async function getIsGiftDisplayed(quoteId: string | number) {
  const key = await AsyncStorage.getItem(`${QUOTE_CACHE_KEY}${quoteId}`);
  return !!key;
}

export function removeIsGiftDisplayed(quoteId: string | number) {
  AsyncStorage.removeItem(`${QUOTE_CACHE_KEY}${quoteId}`);
}
