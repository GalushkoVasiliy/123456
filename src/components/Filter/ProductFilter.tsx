/* eslint-disable react-native/no-inline-styles */
import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ReducerType} from '../../redux/reducers/reducers';
import {connect} from 'react-redux';
import {
  get_category_options,
  get_product_filter,
} from '../../redux/actions/filters.actions';
import FilterItem from './components/FilterItem';
import COLORS from '../../config/COLORS';
import IconComponent from '../IconComponent';
import Accordion from '../Accordion/Accordion';
import LoaderIcon from '../../assets/icons/loader';

export type FilterType = Record<string, string | number>;

interface Props {
  filters: ReducerType['filters'];
  get_product_filter: () => void;
  get_category_options: (categoryId: string | number) => Promise<any>;
  isOpen: boolean;
  onClose: () => void;
  filter: FilterType;
  setFilter: (val: FilterType) => void;
  availableFilters: any[];
  categoryId: string | number;
  total: number;
  isLoading: boolean;
}

const ProductFilter = (props: Props) => {
  const [options, setOptions] = useState<Record<string, any>>({});
  const [activeSections, setActiveSections] = useState<number[]>([]);

  const categoryLabels = useMemo(() => {
    if (options?.category) {
      const labels = [
        [options?.category.id, {name: options?.category.name, shift: 0}],
      ];

      function recursive(data: any[], shift = 1) {
        data.forEach(item => {
          labels.push([item.id, {name: item.name, shift}]);

          if (item.children_data.length) {
            recursive(item.children_data, shift + 1);
          }
        });
      }

      recursive(options?.category.children_data);

      return Object.fromEntries(labels);
    }

    return {};
  }, [options?.category]);

  useEffect(() => {
    props.availableFilters.forEach(({name}) => {
      if (name === 'category') {
        props.get_category_options(props.categoryId).then(item => {
          setOptions(prev => ({
            ...prev,
            [name]: item,
          }));
        });
        return;
      }
      return;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.availableFilters]);

  useEffect(() => {
    if (!props.filters.products.length) {
      props.get_product_filter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.filters.products]);

  const onClear = () => {
    props.setFilter({});
  };

  const onSelect = (name: string, value: any) => {
    props.setFilter({
      ...props.filter,
      [name]: value,
    });
    setActiveSections([]);
  };

  const onDeleteFilter = (key: string) => {
    const _filter = {...props.filter};
    delete _filter[key];
    props.setFilter(_filter);
  };

  const renderChips = (): ReactNode => {
    return Object.keys(props.filter).map((key, index) => {
      const currentFilter = props.filters.products.find(
        ({attribute_code}: any) => attribute_code === key,
      );

      const label = currentFilter?.options?.find(
        ({value}: any) => value === props.filter[key],
      )?.label;

      return (
        <View key={index} style={{flexDirection: 'row'}}>
          <View style={styles.chipContainer}>
            <Text style={styles.chipLabel}>
              {currentFilter?.default_frontend_label || 'Category'}: {label}
            </Text>

            <View style={styles.chipSeparator} />

            <TouchableOpacity onPress={() => onDeleteFilter(key)}>
              <IconComponent iconName="close" color={COLORS.black} size={16} />
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  const getAccordionContent = () => {
    return props.availableFilters
      .map(availableFilter => {
        // TODO: Temp remove categories
        if (availableFilter.name === 'category') {
          return;
        }
        if (
          availableFilter.values.length <= 1 &&
          availableFilter.name !== 'adult_rating'
        ) {
          return;
        }

        const currentFilter = props.filters.products.find(
          ({attribute_code}: any) => attribute_code === availableFilter.name,
        );

        const getContent = () => {
          switch (availableFilter.name) {
            case 'category': {
              return availableFilter.values.map((valueItem: any) => {
                if (!categoryLabels[valueItem.value]) {
                  return;
                }

                return {
                  label: categoryLabels[valueItem.value].name,
                  count: valueItem.metrics[0],
                  onPress: () =>
                    onSelect(availableFilter.name, valueItem.value),
                  style: {
                    marginLeft: categoryLabels[valueItem.value].shift * 16,
                  },
                  activeOpacity:
                    categoryLabels[valueItem.value].shift > 0 ? 0 : 1,
                };
              });
            }

            case 'price': {
              return availableFilter.values.map((valueItem: any) => {
                const label = valueItem.value
                  .split('_')
                  .map((item: any, index: number) => {
                    if (index === 0) {
                      return `£${Number(item).toFixed(2)}`;
                    }
                    return `£${(Number(item) - 0.01).toFixed(2)}`;
                  })
                  .join('-');

                return {
                  label,
                  count: valueItem.metrics[0],
                  onPress: () =>
                    onSelect(availableFilter.name, valueItem.value),
                };
              });
            }

            default: {
              return availableFilter.values.map((valueItem: any) => {
                const _options = props.filters.products.find(
                  ({attribute_code}: any) =>
                    attribute_code === availableFilter.name,
                )?.options;

                const label = _options?.find(
                  ({value}: any) => value === valueItem.value,
                )?.label;

                return {
                  label,
                  count: valueItem.metrics[0],
                  onPress: () =>
                    onSelect(availableFilter.name, valueItem.value),
                };
              });
            }
          }
        };

        return {
          title: currentFilter?.default_frontend_label || 'Category',
          content: getContent(),
        };
      })
      .filter(item => item);
  };

  const t = getAccordionContent();

  return (
    <Modal visible={props.isOpen}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.headerContainer}>
          <Button
            title="Clear"
            onPress={onClear}
            disabled={Object.keys(props.filter).length === 0}
          />
          <Text style={styles.cardTotal}>Cards Available: {props.total}</Text>
          <Button title="Apply" onPress={props.onClose} />
        </View>

        {props.isLoading ? (
          <View style={styles.loadingContainer}>
            <LoaderIcon size={16} />
          </View>
        ) : (
          <View style={styles.container}>
            <ScrollView contentContainerStyle={{gap: 16}}>
              {/*Render selected filter labels*/}
              {renderChips()}

              {/*Render filters*/}
              <Accordion
                expandMultiple
                data={t.map(({title, content}: any) => ({
                  title,
                  content: content.map((contentItem: any, i: number) => (
                    <FilterItem
                      key={i}
                      label={contentItem.label}
                      count={contentItem.count}
                      onPress={contentItem.onPress}
                      activeOpacity={contentItem?.activeOpacity}
                      style={contentItem?.style}
                    />
                  )),
                }))}
                style={{borderTopWidth: 0, borderBottomWidth: 0}}
                open={activeSections}
                onChange={val => setActiveSections(val)}
              />
            </ScrollView>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: Platform.OS === 'android' ? 15 : 0,
  },
  cardTotal: {
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.black,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 15,
    paddingBottom: 100,
    justifyContent: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.alto,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  chipLabel: {
    paddingRight: 8,
    color: COLORS.black,
  },
  chipSeparator: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.black,
    paddingRight: 8,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    get_product_filter: () => dispatch(get_product_filter()),
    get_category_options: (categoryId: string | number) =>
      dispatch(get_category_options(categoryId)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    filters: state.filters,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(ProductFilter));
