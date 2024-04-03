import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import COLORS from '../../config/COLORS';
import {FlatList} from 'react-native-gesture-handler';
import {
  CATEGORY_ID,
  MOCK_SUB_CATEGORIES,
  PER_PAGE,
  SELECTED_STAGE,
} from '../../config/CONSTANTS';
import {useNavigation, useRoute} from '@react-navigation/native';
import PageTitle from '../../components/PageTitle';
import Header from '../../components/Header';
import {ReducerType} from '../../redux/reducers/reducers';
import SearchField from '../../components/SearchField';
import useDebounceState from '../../hooks/useDebounceState';
import {
  clear_products,
  ISearchProducts,
  search_products,
} from '../../redux/actions/products.actions';
import ProductList from '../Products/components/ProductList';
import Pagination from '../../components/Pagination';
import {select_category} from '../../redux/actions/categories.actions';
import {ProductsFilterProps} from '../../utils/getProductsFilter';
import {FilterType} from '../../components/Filter/ProductFilter';
import useSpecialCategory from '../../hooks/useSpecialCategory';
import LoaderIcon from '../../assets/icons/loader';

interface Props {
  categories: ReducerType['categories'];
  search_products: (val: ISearchProducts) => Promise<any>;
  select_category: (category: any) => void;
  clear_products: () => void;
}

const GreetingCards = (props: Props) => {
  const {navigate} = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>({});
  const [search, debounceSearch, setSearch, onClear] = useDebounceState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const route = useRoute();
  const {category} = useSpecialCategory();

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
      <Header backFalse={route.params?.backFalse} />
      <PageTitle isTitle textKey="Browse" />
      <SearchField
        value={search}
        onChangeText={text => setSearch(text)}
        style={{marginBottom: 12}}
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
            !category
              ? [{loading: true}, ...MOCK_SUB_CATEGORIES[SELECTED_STAGE]]
              : [category, ...MOCK_SUB_CATEGORIES[SELECTED_STAGE]]
          }
          contentContainerStyle={{rowGap: 10}}
          ListFooterComponent={<View style={{height: 10}} />}
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
                    props.select_category(item);
                    navigate('Products', {
                      filter: item.filter,
                    });
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
    width: '100%',
    height: 110,
  },
  banner_loading: {
    flex: 1,
    width: '100%',
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
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
  return {
    categories: state.categories,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GreetingCards);
