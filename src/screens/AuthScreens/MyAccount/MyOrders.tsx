/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import COLORS from '../../../config/COLORS';
import Header from '../../../components/Header';
import PageTitle from '../../../components/PageTitle';
import {ReducerType} from '../../../redux/reducers/reducers';
import {get_orders, select_order} from '../../../redux/actions/orders.actions';
import LoaderIcon from '../../../assets/icons/loader';

interface Props {
  auth: ReducerType['auth'];
  orders: ReducerType['orders'];
  get_orders: (id: string | number) => Promise<any>;
  select_order: (data: {id: string}) => void;
}

const tableHead = ['Order #', 'Status', 'Date', ' Total'];

const MyOrders = (props: Props) => {
  const {navigate} = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (props.auth.token) {
      props.get_orders(props.auth.profile.id).then(() => setIsLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.auth.token]);

  const Capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.white,
        }}>
        <Header />
        <PageTitle isTitle textKey="My Orders" />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <LoaderIcon size={24} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.white,
      }}>
      <Header />
      <PageTitle
        isTitle
        textKey={`My Orders: ${
          props.orders.orders ? props.orders.orders.length : 0
        } Item(s)`}
      />
      <FlatList
        style={styles.list}
        data={props.orders.orders}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          <View style={styles.header}>
            {tableHead.map((item, index: number) => (
              <View
                key={index}
                style={{
                  alignItems:
                    index === 0
                      ? 'flex-start'
                      : index === 3
                      ? 'flex-end'
                      : 'center',
                  ...(index === 3 ? {width: 60} : {flex: 1}),
                }}>
                <Text
                  style={[
                    styles.headerText,
                    {paddingLeft: index === 0 ? 10 : 0},
                  ]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        }
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.renderItem}
            onPress={() => {
              props.select_order(item);
              navigate('OrderDetails');
            }}>
            <View style={styles.renderItemContainer}>
              <View
                style={{
                  alignItems: 'flex-start',
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontWeight: '400',
                    color: COLORS.black,
                  }}>
                  {item.increment_id}
                </Text>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontWeight: '700',
                    color:
                      item.status === 'processing'
                        ? COLORS.amber
                        : item.status === 'complete'
                        ? COLORS.darkGreen
                        : COLORS.black,
                  }}>
                  {Capitalize(item.status)}
                </Text>
              </View>

              <View
                style={{
                  alignItems: 'center',
                  flex: 1,
                }}>
                <Text
                  style={{
                    fontWeight: '400',
                    color: COLORS.black,
                  }}>
                  {item.created_at.replace(
                    /^(\d+)\-(\d+)-(\d+) (.*)$/,
                    '$3/$2/$1',
                  )}
                </Text>
              </View>

              <View
                style={{
                  alignItems: 'flex-end',
                  width: 60,
                }}>
                <Text
                  style={{
                    fontWeight: '700',
                    color: COLORS.black,
                  }}>
                  {'£' + Number(item.base_grand_total).toFixed(2)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={{paddingBottom: 20}} />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 30,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  headerText: {
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.black,
  },
  renderItem: {
    height: 40,
    justifyContent: 'center',
  },
  renderItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    get_orders: (id: string | number) => dispatch(get_orders(id)),
    select_order: (data: {id: string}) => dispatch(select_order(data)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    auth: state.auth,
    orders: state.orders,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
