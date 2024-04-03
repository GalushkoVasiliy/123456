import { useEffect, useState } from 'react';
import { get_category_by_id } from '../redux/actions/categories.actions';
import { API, HERO_CATEGORY_ID } from '../config/CONSTANTS';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ICard {
  name: string;
  route: string;
  src: {
    uri: string;
  };
}

const CACHE_KEY = 'SPECIAL_CATEGORY';

export default function useSpecialCategory() {
  const [category, setCategory] = useState();
  const [card, setCard] = useState<ICard>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadDataFromStorage = async () => {
      try {
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedData) {

          const parsedData = JSON.parse(cachedData);
          setCategory(parsedData.category);
          setCard(parsedData.card);
          setIsReady(true);
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadDataFromStorage();

    const getSpecialCategory = async () => {
      try {
        const val = await get_category_by_id(HERO_CATEGORY_ID)();
        const imageUrl = val.custom_attributes.find(({ attribute_code }: any) => attribute_code === 'image')?.value;

        setIsReady(true);
        setCategory({
          ...val,
          src: {
            uri: `${API.url}${imageUrl}`,
          },
          filter: {
            card_current_event: 1,
          },
        });
        setCard({
          name: val.name,
          route: 'Products',
          src: {
            uri: `${API.url}${imageUrl}`,
          },
        });

        // Cache the data
        AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ 
          category: {
            ...val,
            src: {
              uri: `${API.url}${imageUrl}`,
            },
            filter: {
              card_current_event: 1,
            },
          }, card: {
            name: val.name,
            route: 'Products',
            src: {
              uri: `${API.url}${imageUrl}`,
            },
          } 
        }));
      } catch (error) {
        console.error('Error fetching special category:', error);
      }
    };

    getSpecialCategory();
  }, []);

  return {
    isReady,
    category,
    card,
  };
}
