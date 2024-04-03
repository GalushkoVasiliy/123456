import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, View} from 'react-native';
import {connect} from 'react-redux';
import {
  clear_products,
  get_products,
  ISearchProducts,
  search_products,
} from '../../redux/actions/products.actions';
import PageTitle from '../../components/PageTitle';
import Header from '../../components/Header';
import {ReducerType} from '../../redux/reducers/reducers';
import styles from './styles';
import SearchField from '../../components/SearchField';
import useDebounceState from '../../hooks/useDebounceState';
import ProductList from './components/ProductList';
import {ProductsFilterProps} from '../../utils/getProductsFilter';
import Pagination from '../../components/Pagination';
import {PER_PAGE} from '../../config/CONSTANTS';
import {useRoute} from '@react-navigation/native';
import {FilterType} from '../../components/Filter/ProductFilter';

interface ProductsProps {
  get_products: (
    id: string,
    filters?: ProductsFilterProps['filterGroups'],
  ) => Promise<any>;
  search_products: (val: ISearchProducts) => Promise<any>;
  clear_products: () => void;
  categories: ReducerType['categories'];
}

// 5 minutes
const AUTO_UPDATE_TIME = 1000 * 60 * 5;

const Products = (props: ProductsProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<FilterType>({});
  const [search, debounceSearch, setSearch, onClear] = useDebounceState('');
  const [totalCount, setTotalCount] = useState(0);
  const route = useRoute();

  const getProducts = useCallback(() => {
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

    // if (route.params?.filter?.card_current_event) {
    //   filters?.push([
    //     {
    //       type: 'eq',
    //       field: 'card_current_event',
    //       value: route.params.filter.card_current_event,
    //     },
    //   ]);
    // }

    return props
      .search_products({
        categoryId: props.categories.singleCategory.id,
        page,
        perPage: PER_PAGE,
        search: debounceSearch.length > 2 ? debounceSearch : '',
        filters: filters,
      })
      .then(res => {
        setTotalCount(res.total_count);
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, debounceSearch, page, route.params]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    return () => {
      props.clear_products();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // auto-refresh
  useEffect(() => {
    const intervalId = setInterval(() => {
      getProducts();
    }, AUTO_UPDATE_TIME);

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getProducts]);

  // manual-refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getProducts().then(() => setRefreshing(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeFilter = (val: FilterType) => {
    setFilter(val);
    setPage(1);
  };

  return (
    <View style={styles.container}>
      <Header />
      <PageTitle isTitle textKey={props.categories.singleCategory.name} />
      <SearchField
        value={search}
        onChangeText={text => setSearch(text)}
        style={{marginBottom: 12}}
        onClear={onClear}
      />

      <ProductList
        pageData={{
          page,
          total: totalCount,
          perPage: PER_PAGE,
        }}
        categoryId={props.categories.singleCategory.id}
        isLoading={isLoading}
        filter={filter}
        setFilter={onChangeFilter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          <Pagination
            totalItems={totalCount}
            pageSize={PER_PAGE}
            currentPage={page}
            onPageChange={setPage}
          />
        }
      />
    </View>
  );
};

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    get_products: (id: string, filters?: ProductsFilterProps['filterGroups']) =>
      dispatch(get_products(id, filters)),
    search_products: (val: ISearchProducts) => dispatch(search_products(val)),
    clear_products: () => dispatch(clear_products()),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    categories: state.categories,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(Products));
