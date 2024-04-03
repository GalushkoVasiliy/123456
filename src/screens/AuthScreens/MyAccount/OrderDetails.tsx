/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {connect} from 'react-redux';

import COLORS from '../../../config/COLORS';
import Header from '../../../components/Header';
import PageTitle from '../../../components/PageTitle';
import {ReducerType} from '../../../redux/reducers/reducers';

interface Props {
  orders: ReducerType['orders'];
}

const OrderDetails = (props: Props) => {
  const getDisplayStreet = function (street: string[]) {
    if (street.length > 1) {
      return street[1] + ', ' + street[0];
    }
    return street[0];
  };

  const getProductOption = function (item: any) {
    if (item.product_type == 'configurable') {
      const additional_data = JSON.parse(item.additional_data)['0'];
      const options = additional_data?.value?.options;
      return options && options[0]?.label + ': ' + options[0]?.value;
    }
  };

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: COLORS.white,
      }}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={styles.scroll}
        keyboardShouldPersistTaps={'handled'}>
        <PageTitle isTitle textKey="Order Details" />
        <View style={styles.mainContainer}>
          <Text style={styles.label}>
            Order Number:{' '}
            <Text style={styles.value}>
              #{props.orders.singleOrder.increment_id}
            </Text>
          </Text>
          <Text style={styles.label}>
            Order Date:{' '}
            <Text style={styles.value}>
              {props.orders.singleOrder?.created_at.replace(
                /^(\d+)\-(\d+)-(\d+) (.*)$/,
                '$3/$2/$1 $4',
              )}
            </Text>{' '}
          </Text>

          <Text style={styles.section}>Billing Info</Text>
          <Text style={styles.label}>
            Customer Name:{' '}
            <Text style={styles.value}>
              {props.orders.singleOrder.billing_address.firstname}{' '}
              {props.orders.singleOrder.billing_address.lastname}
            </Text>
          </Text>
          <Text style={styles.label}>
            Email:{' '}
            <Text style={styles.value}>
              {props.orders.singleOrder.billing_address.email}
            </Text>
          </Text>
          <Text style={styles.label}>
            Telepone:{' '}
            <Text style={styles.value}>
              {props.orders.singleOrder.billing_address.telephone}
            </Text>
          </Text>
          <Text style={styles.label}>
            Address:{' '}
            <Text style={styles.value}>
              {getDisplayStreet(
                props.orders.singleOrder.billing_address.street,
              )}
            </Text>
          </Text>
          <Text style={styles.label}>
            City:{' '}
            <Text style={styles.value}>
              {props.orders.singleOrder.billing_address.city}
            </Text>
          </Text>
          <Text style={styles.label}>
            Postcode:{' '}
            <Text style={styles.value}>
              {props.orders.singleOrder.billing_address.postcode}
            </Text>
          </Text>
          <Text style={styles.section}>Shipping Info</Text>
          <Text style={styles.label}>
            Customer Name:{' '}
            <Text style={styles.value}>
              {
                props.orders.singleOrder.extension_attributes
                  .shipping_assignments[0].shipping.address.firstname
              }{' '}
              {
                props.orders.singleOrder.extension_attributes
                  .shipping_assignments[0].shipping.address.lastname
              }
            </Text>
          </Text>
          <Text style={styles.label}>
            Telepone:{' '}
            <Text style={styles.value}>
              {
                props.orders.singleOrder.extension_attributes
                  .shipping_assignments[0].shipping.address.telephone
              }
            </Text>
          </Text>
          <Text style={styles.label}>
            Address:{' '}
            <Text style={styles.value}>
              {getDisplayStreet(
                props.orders.singleOrder.extension_attributes
                  .shipping_assignments[0].shipping.address.street,
              )}
            </Text>
          </Text>
          <Text style={styles.label}>
            City:{' '}
            <Text style={styles.value}>
              {
                props.orders.singleOrder.extension_attributes
                  .shipping_assignments[0].shipping.address.city
              }
            </Text>
          </Text>
          <Text style={styles.label}>
            Postcode:{' '}
            <Text style={styles.value}>
              {
                props.orders.singleOrder.extension_attributes
                  .shipping_assignments[0].shipping.address.postcode
              }
            </Text>
          </Text>

          <Text style={styles.section}>Items</Text>
          <View style={styles.orderTable}>
            {props.orders.singleOrder.items
              .filter(item => typeof item.parent_item == 'undefined')
              .map((dataRow: any) => (
                <View
                  key={dataRow.product_id}
                  style={[styles.orderSection, {padding: 10}]}>
                  <Text style={styles.orderTitle}>{dataRow.name}</Text>
                  <View
                    style={[
                      styles.skuRow,
                      {
                        marginTop:
                          dataRow.product_type == 'configurable' ? 4 : 0,
                      },
                    ]}>
                    <Text style={{color: COLORS.black}}>
                      {getProductOption(dataRow)}
                    </Text>
                    <Text
                      style={[
                        styles.orderValue,
                        {color: COLORS.gray, textAlign: 'right'},
                      ]}>
                      Sku: {dataRow.sku}
                    </Text>
                  </View>
                  <View style={styles.orderRow}>
                    <Text style={styles.orderValue}>
                      Qty:{' '}
                      <Text style={styles.orderTitle}>
                        {dataRow.qty_ordered}
                      </Text>
                    </Text>

                    <Text style={styles.orderValue}>
                      Price:{' '}
                      <Text style={styles.orderTitle}>
                        £ {Number(dataRow.price_incl_tax).toFixed(2)}
                      </Text>
                    </Text>
                  </View>
                </View>
              ))}
          </View>

          <Text style={styles.total}>
            Subtotal:{' '}
            <Text style={styles.value}>
              £
              {Number(props.orders.singleOrder.base_subtotal_incl_tax).toFixed(
                2,
              )}
            </Text>{' '}
          </Text>
          <Text style={styles.total}>
            Discount:{' '}
            <Text style={styles.value}>
              -£
              {Number(
                Math.abs(props.orders.singleOrder.base_discount_amount),
              ).toFixed(2)}
            </Text>{' '}
          </Text>
          <Text style={styles.total}>
            Shipping:{' '}
            <Text style={styles.value}>
              £
              {Number(props.orders.singleOrder.base_shipping_amount).toFixed(2)}
            </Text>{' '}
          </Text>
          <Text style={styles.total}>
            Grand Total:{' '}
            <Text style={styles.value}>
              £{Number(props.orders.singleOrder.base_grand_total).toFixed(2)}
            </Text>{' '}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    padding: 9,
  },
  label: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    fontSize: 16,
    padding: 10,
    color: COLORS.black,
  },
  value: {
    textAlign: 'left',
    justifyContent: 'flex-start',
    fontSize: 18,
    padding: 10,
    color: COLORS.black,
  },
  section: {
    textAlign: 'left',
    fontSize: 16,
    padding: 10,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  total: {
    textAlign: 'right',
    fontSize: 16,
    padding: 10,
    color: COLORS.black,
  },
  scroll: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
  },
  row: {
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  orderTable: {
    gap: 12,
    paddingHorizontal: 10,
  },
  orderSection: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
  },
  orderValue: {
    fontSize: 16,
    color: COLORS.black,
  },
  skuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 0,
  },
});

const mapStateToProps = (state: ReducerType) => {
  return {
    orders: state.orders,
  };
};

export default connect(
  mapStateToProps,
)(React.memo(OrderDetails));
