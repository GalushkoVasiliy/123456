import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {
  clear_products,
  ISearchProducts,
  search_products,
  select_product,
} from '../../redux/actions/products.actions';
import PageTitle from '../../components/PageTitle';
import Header from '../../components/Header';
import {ReducerType} from '../../redux/reducers/reducers';
import FastImageComponent from '../../components/FastImageComponent/FastImageComponent';
import COLORS from '../../config/COLORS';
import {Product} from '../../redux/reducers/productsReducer';
import {API, HOME_GIFTS_CATEGORY_ID, PER_PAGE} from '../../config/CONSTANTS';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import Pagination from '../../components/Pagination';
import LoaderIcon from '../../assets/icons/loader';

interface GiftsProps {
  selectProduct: (data: Product) => any;
  products: ReducerType['products'];
  clear_products: () => void;
  search_products: (val: ISearchProducts) => Promise<any>;
}

const width = Dimensions.get('screen').width / 2 - 30;

const Gifts = (props: GiftsProps) => {
  const {navigate} = useNavigation();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const route = useRoute<RouteProp<{params: {categoryId: string}}>>();

  const isHomeGifts = useMemo(() => {
    return route.params.categoryId === HOME_GIFTS_CATEGORY_ID;
  }, [route.params.categoryId]);

  const getProducts = useCallback(() => {
    setIsLoading(true);
    props.clear_products();

    return props
      .search_products({
        categoryId: route.params.categoryId,
        page,
        perPage: PER_PAGE,
        search: '',
      })
      .then(res => {
        setTotalCount(res.total_count);
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    return () => {
      props.clear_products();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <PageTitle
        isTitle
        textKey={isHomeGifts ? 'Gifting' : 'Click & Collect Gifts'}
      />

      <View style={{height: 20, paddingHorizontal: 15, marginBottom: 12}}>
        <Text style={{fontSize: 16, flex: 1, color: COLORS.black}}>
          <Text style={{fontWeight: '700'}}>
            {totalCount > PER_PAGE
              ? `${PER_PAGE * (page - 1) + 1}-${Math.min(
                  page * PER_PAGE,
                  totalCount,
                )}`
              : totalCount}
          </Text>{' '}
          of {totalCount}
        </Text>
      </View>

      {isLoading && (
        <View style={styles.noDataContainer}>
          <LoaderIcon />
        </View>
      )}

      {!isLoading && props.products.products.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No cards found</Text>
        </View>
      )}

      {!isLoading && props.products.products.length > 0 && (
        <FlatList
          style={styles.list}
          numColumns={2}
          contentContainerStyle={{rowGap: 20}}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          data={props.products.products}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <View key={index} style={styles.card}>
                <TouchableOpacity
                  style={styles.touchableCard}
                  activeOpacity={1}
                  disabled={!isHomeGifts}
                  onPress={() => {
                    props.selectProduct(item);
                    navigate('SingleProduct');
                  }}>
                  <FastImageComponent
                    height={240}
                    width={width}
                    resizeMode="contain"
                    style={styles.image}
                    uri={`${API.imageMock}${item.media_gallery_entries[0]?.file}`}
                  />
                  <Text style={styles.textName} numberOfLines={2}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
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
  card: {
    width: Dimensions.get('screen').width / 2 - 30,
    padding: 0,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  list: {
    paddingHorizontal: 15,
  },
  image: {
    marginBottom: 20,
  },
  textName: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    width: '100%',
    color: COLORS.black,
  },
  touchableCard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  noDataText: {
    color: COLORS.gray,
    fontSize: 28,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    selectProduct: (data: Product) => dispatch(select_product(data)),
    clear_products: () => dispatch(clear_products()),
    search_products: (val: ISearchProducts) => dispatch(search_products(val)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    products: state.products,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Gifts));
