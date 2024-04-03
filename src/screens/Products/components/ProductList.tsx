/* eslint-disable react-native/no-inline-styles */
import React, {useMemo, useState} from 'react';
import styles from '../styles';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Switch,
  Dimensions,
  Platform, FlatListProps,
} from 'react-native';
import FastImageComponent from '../../../components/FastImageComponent/FastImageComponent';
import {API} from '../../../config/CONSTANTS';
import {Product} from '../../../redux/reducers/productsReducer';
import {select_product} from '../../../redux/actions/products.actions';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import IconComponent from '../../../components/IconComponent';
import COLORS from '../../../config/COLORS';
import {ReducerType} from '../../../redux/reducers/reducers';
import ProductFilter, {
  FilterType,
} from '../../../components/Filter/ProductFilter';
import useHapticFeedback from '../../../hooks/useHapticFeedback';
import LoaderIcon from '../../../assets/icons/loader';
import CustomSwitch from '../../../components/CustomSwitch';

interface IPageData {
  page: number;
  perPage: number;
  total: number;
}

interface Props extends Omit<FlatListProps<any>, 'renderItem' | 'data'> {
  selectProduct: (data: Product) => any;
  filter: FilterType;
  setFilter: (val: FilterType) => void;
  products: ReducerType['products'];
  isLoading: boolean;
  categoryId: string;
  pageData: IPageData;
}

const width = Dimensions.get('screen').width / 2 - 30;

const ProductList = ({
  selectProduct,
  filter,
  setFilter,
  products,
  isLoading,
  categoryId,
  pageData,
  ...props
}: Props) => {
  const {navigate} = useNavigation();
  const triggerHaptic = useHapticFeedback();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const adultRatingId = useMemo(() => {
    return products.searchFilters.find(({name}) => name === 'adult_rating')
      ?.values[0].value;
  }, [products.searchFilters]);

  const onAllAgesClick = () => {
    triggerHaptic();
    const _filter = {...filter};
    if (!_filter?.adult_rating) {
      _filter.adult_rating = adultRatingId;
    } else {
      delete _filter.adult_rating;
    }
    setFilter(_filter);
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 15,
          height: 20,
          marginBottom: 18,
        }}>
        <Text style={{fontSize: 16, flex: 1, color: COLORS.black}}>
          <Text style={{fontWeight: '700'}}>
            {pageData.total > pageData.perPage
              ? `${pageData.perPage * (pageData.page - 1) + 1}-${Math.min(
                  pageData.page * pageData.perPage,
                  pageData.total,
                )}`
              : pageData.total}
          </Text>{' '}
          of {pageData.total}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <CustomSwitch
            value={!filter?.adult_rating}
            onChange={onAllAgesClick}
          />
          <Text
            style={{
              color: COLORS.black,
              paddingLeft: Platform.OS === 'android' ? 8 : 0,
            }}>
            Adult Humour
          </Text>
        </View>

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 4,
            alignItems: 'center',
            flex: 1,
          }}
          onPress={() => {
            triggerHaptic();
            setIsFilterOpen(true);
          }}>
          <Text style={{fontSize: 16, color: COLORS.black}}>
            <IconComponent size={20} iconName="filter" color={COLORS.black} />{' '}
            Filter
          </Text>

          <View
            style={{
              height: 16,
              width: 16,
              backgroundColor: COLORS.red,
              borderRadius: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 12, color: COLORS.white}}>
              {Object.keys(filter).length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ProductFilter
        filter={filter}
        setFilter={setFilter}
        availableFilters={products.searchFilters}
        categoryId={categoryId}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        total={pageData.total}
        isLoading={isLoading}
      />

      {isLoading && (
        <View style={styles.noDataContainer}>
          <LoaderIcon />
        </View>
      )}

      {!isLoading && products.products.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No cards found</Text>
        </View>
      )}

      {!isLoading && products.products.length > 0 && (
        <FlatList
          style={styles.list}
          numColumns={2}
          contentContainerStyle={{rowGap: 20}}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          data={products.products}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            return (
              <View key={item.id} style={styles.card}>
                <TouchableOpacity
                  style={styles.touchableCard}
                  activeOpacity={1}
                  onPress={() => {
                    selectProduct(item);
                    navigate('SingleProduct');
                  }}>
                  <FastImageComponent
                    height={240}
                    width={width}
                    resizeMode="cover"
                    style={styles.image}
                    uri={`${API.imageMock}${item.media_gallery_entries[0]?.file}`}
                  />
                  {/*<Text style={styles.textName} numberOfLines={2}>*/}
                  {/*  {item.name}*/}
                  {/*</Text>*/}

                  {/*<Text style={styles.textPrice}>*/}
                  {/*  £{item.price} <Text style={{fontSize: 12}}>inc VAT</Text>*/}
                  {/*</Text>*/}
                </TouchableOpacity>
              </View>
            );
          }}
          {...props}
        />
      )}
    </View>
  );
};

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    selectProduct: (data: Product) => dispatch(select_product(data)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    products: state.products,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(ProductList));
