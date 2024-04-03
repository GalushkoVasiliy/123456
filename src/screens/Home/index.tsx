/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Linking,
  Pressable,
} from 'react-native';
import Header from '../../components/Header';
import {
  CATEGORY_ID,
  MOCK_CATEGORIES,
  PER_PAGE,
  SELECTED_STAGE,
} from '../../config/CONSTANTS';
import COLORS from '../../config/COLORS';
import {FlatList} from 'react-native-gesture-handler';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ReducerType} from '../../redux/reducers/reducers';
import {connect} from 'react-redux';
import {
  clear_products,
  ISearchProducts,
  search_products,
} from '../../redux/actions/products.actions';
import SearchField from '../../components/SearchField';
import useDebounceState from '../../hooks/useDebounceState';
import ProductList from '../Products/components/ProductList';
import Pagination from '../../components/Pagination';
import {ProductsFilterProps} from '../../utils/getProductsFilter';
import {select_category} from '../../redux/actions/categories.actions';
import {FilterType} from '../../components/Filter/ProductFilter';
import useSpecialCategory from '../../hooks/useSpecialCategory';
import LoaderIcon from '../../assets/icons/loader';

const srcGif = require('../../assets/video/home_banner.gif');

interface Props {
  search_products: (val: ISearchProducts) => Promise<any>;
  clear_products: () => void;
  select_category: (category: any) => void;
  get_category_by_id: (id: string | number) => Promise<any>;
}

const RYMAN_SERVICES_LINK = 'https://www.ryman.co.uk/services/print';

const Home = (props: Props) => {
  const {navigate} = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>({});
  const [search, debounceSearch, setSearch, onClear] = useDebounceState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const route = useRoute();

  const {category, card} = useSpecialCategory();

  useEffect(() => {
    // When home is realoaded (header/tab link) search should be cleared
    if (route.params?.timestamp) {
      onClear();
    }
  }, [route]);

  useEffect(() => {
    if (debounceSearch.length > 2) {
      setIsLoading(true);
      props.clear_products();

      const filterKeys = Object.keys(filter);
      const filters = filterKeys
        .map(item => {
          if (item === 'category') {
            return;
          }
          return [
            {
              type: 'eq',
              field: item,
              value: filter[item],
            },
          ];
        })
        .filter(item => item) as ProductsFilterProps['filterGroups'];

      props
        .search_products({
          categoryId: CATEGORY_ID[SELECTED_STAGE],
          search: debounceSearch,
          page: page,
          perPage: PER_PAGE,
          filters: filters,
        })
        .then(res => {
          setTotalCount(res.total_count);
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch, page, filter]);

  useEffect(() => {
    return () => {
      props.clear_products();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeFilter = (val: FilterType) => {
    setFilter(val);
    setPage(1);
  };

  return (
    <View style={styles.container}>
      <Header backFalse />
      <SearchField
        value={search}
        onChangeText={text => setSearch(text)}
        style={{marginTop: 16, marginBottom: 10}}
        onClear={onClear}
      />

      {debounceSearch.length > 2 && (
        <ProductList
          pageData={{
            page,
            total: totalCount,
            perPage: PER_PAGE,
          }}
          categoryId={CATEGORY_ID[SELECTED_STAGE]}
          isLoading={isLoading}
          filter={filter}
          setFilter={onChangeFilter}
          ListFooterComponent={
            <Pagination
              totalItems={totalCount}
              pageSize={PER_PAGE}
              currentPage={page}
              onPageChange={setPage}
            />
          }
        />
      )}

      {debounceSearch.length <= 2 && (
        <FlatList
          style={styles.list}
          data={
            !card
              ? [{loading: true}, ...MOCK_CATEGORIES]
              : [card, ...MOCK_CATEGORIES]
          }
          contentContainerStyle={{rowGap: 10}}
          ListFooterComponent={<View style={{height: 10}} />}
          ListHeaderComponent={
            <Pressable
              onPress={() => navigate('Browse')}
              style={{marginHorizontal: 0}}>
              <ImageBackground
                source={srcGif}
                borderRadius={0}
                resizeMode="contain"
                style={{
                  height: 110,
                }}
              />
            </Pressable>
          }
          renderItem={({item}) => {
            return item.loading ? (
              <View style={styles.banner_loading}>
                <LoaderIcon color={COLORS.black} />
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    if (
                      !['RymanPrintServices', 'Products'].includes(item.route)
                    ) {
                      navigate(item.route);
                    }
                    if (item.route === 'Products') {
                      props.select_category(category);

                      navigate(item.route, {
                        filter: {
                          card_current_event: 1,
                        },
                      });
                    }
                    if (item.route === 'RymanPrintServices') {
                      Linking.openURL(RYMAN_SERVICES_LINK);
                    }
                  }}>
                  <ImageBackground
                    source={item.src}
                    borderRadius={0}
                    resizeMode="cover"
                    style={styles.image} // Set a fixed height
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
  },
  list: {
    paddingHorizontal: 15,
  },
  image: {
    height: 110,
  },
  banner_loading: {
    flex: 1,
    width: '100%',
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 7.5,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    search_products: (val: ISearchProducts) => dispatch(search_products(val)),
    clear_products: () => dispatch(clear_products()),
    select_category: (category: any) => dispatch(select_category(category)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Home));
