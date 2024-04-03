/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import InputComponent from '../../../InputComponent/InputComponent';
import {SCHEMA} from './schema';
import styles from './styles';
import {get_stores} from '../../../../redux/actions/stores.actions';
import {connect, useSelector} from 'react-redux';
import {Store} from '../../../../redux/reducers/storesReducer';
import StoreComponent from '../../../Store/Store';
import {
  DeliveryOptions,
  estimate_shipping_methods,
  EstimateShippingMethods,
  send_shipping_information,
  SendShippingInformation,
  set_selection_point_id,
  ShippingMethod,
} from '../../../../redux/actions/checkout.actions';
import {ReducerType} from '../../../../redux/reducers/reducers';
import {filterStoresByCoordinates} from '../../../../utils/filterStoresByCoordinates';
import CheckBox from '../../../CheckBox/CheckBox';
import {sortStoresByDistance} from '../../../../utils/sortStoresByDistance';
import {TextInput} from 'react-native';
import Geocoder from 'react-native-geocoding';
import AutoComplete from '../../../AutoComplete';
import Payment from '../../../Payment/Payment';
import PhoneNumberInput from '../../../PhoneNumberInput';
import PhoneInput from 'react-native-phone-input';
import GoogleAutoComplete from '../../../GoogleAutoComplete';

interface StoreFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Props {
  get_stores_array: () => void;
  setSelectionPoint: (collectionPointId: number) => void;
  estimateShippingMethods: (
    val: EstimateShippingMethods,
  ) => Promise<ShippingMethod[]>;
  sendShippingInformation: (val: SendShippingInformation) => Promise<void>;
  stores: ReducerType['stores'];
  auth: ReducerType['auth'];
  deliveryMethod: DeliveryOptions;
  onScrollTop: () => void;
  onScrollBottom: () => void;
}

const StoreForm = ({
  estimateShippingMethods,
  sendShippingInformation,
  setSelectionPoint,
  get_stores_array,
  stores,
  auth,
  deliveryMethod,
  onScrollTop,
  onScrollBottom,
}: Props) => {
  const isCouponUpdating = useSelector(
    (state: ReducerType) => state.checkout.isCouponUpdating,
  );
  const phone = useMemo(() => {
    const flaggedPhone = auth?.profile?.addresses.find(
      ({default_shipping}: any) => !!default_shipping,
    )?.telephone;

    const firstPhone =
      auth?.profile?.addresses.length && auth?.profile?.addresses[0].telephone;

    return flaggedPhone ?? firstPhone ?? '';
  }, [auth?.profile?.addresses]);

  const [form, setForm] = useState<StoreFormState>({
    firstName: auth?.profile?.firstname ?? '',
    lastName: auth?.profile?.lastname ?? '',
    email: auth?.profile?.email ?? '',
    phone: phone,
  });
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [shippingMethods, setShippingMethods] = useState<
    ShippingMethod[] | null
  >(null);
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [error, setError] = useState<Partial<StoreFormState>>({});
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [current, setCurrent] = useState<
    {latitude: number; longitude: number} | undefined
  >();
  const [isShowPayment, setIsShowPayment] = useState(false);
  const [isLoadingPay, setIsLoadingPay] = useState(false);

  // variable to hold the references of the textfields
  let inputs = {
    firstName: React.createRef<TextInput>(),
    lastName: React.createRef<TextInput>(),
    email: React.createRef<TextInput>(),
    phone: React.createRef<PhoneInput>(),
  };

  // function to focus the field
  const focusTheField = (id: keyof typeof inputs) => {
    inputs[id].current?.focus();
  };

  useEffect(() => {
    get_stores_array();
  }, [get_stores_array]);

  useEffect(() => {
    if (selectedStore) {
      SCHEMA.validate(form, {abortEarly: false}).catch(err => {
        const errors = err.inner.reduce((acc: any, val: any) => {
          acc[val.path] = val.message;
          return acc;
        }, {});
        setError(errors);
        onScrollTop();
      });
    }
  }, [selectedStore]);

  useEffect(() => {
    if (selectedStore) {
      SCHEMA.validate(form, {abortEarly: false})
        .then(() => {
          estimateShippingMethods({
            firstname: form.firstName,
            lastname: form.lastName,
            telephone: form.phone,
            email: form.email,
            city: selectedStore.city,
            country_id: selectedStore.country_id,
            customer_id: null,
            region: selectedStore.region,
            postcode: selectedStore.postcode,
            street: [selectedStore.address],
            region_id: selectedStore.region_id,
          }).then(res => {
            setShippingMethods(res);
          });
        })
        .catch(err => {
          const errors = err.inner.reduce((acc: any, val: any) => {
            acc[val.path] = val.message;
            return acc;
          }, {});
          setError(errors);
        });
    }
  }, [estimateShippingMethods, form, selectedStore]);

  const onChange = (key: keyof StoreFormState) => (text: string) => {
    setForm(prev => ({
      ...prev,
      [key]: text,
    }));
  };

  const onBlur = (key: keyof StoreFormState) => () => {
    SCHEMA.validateAt(key, form)
      .then(() => {
        const _error = {...error};
        delete _error[key];
        setError(_error);
      })
      .catch(err => {
        setIsShowPayment(false);
        setError({
          ...error,
          [key]: err.message,
        });
      });
  };

  const getInputProps = (key: keyof StoreFormState) => ({
    value: form[key],
    onChangeText: onChange(key),
    onBlur: onBlur(key),
    ...(!!error &&
      error[key] && {
        isError: !!error[key],
        error: error[key],
      }),
  });

  useEffect(() => {
    if (
      selectedMethod !== null &&
      selectedStore !== null &&
      shippingMethods &&
      shippingMethods.length > 0
    ) {
      setIsLoadingPay(true);
      setIsShowPayment(false);

      SCHEMA.validate(form, {abortEarly: false}).then(() => {
        sendShippingInformation({
          billing_address: {
            firstname: form.firstName,
            lastname: form.lastName,
            telephone: form.phone,
            email: form.email,
            city: selectedStore.city,
            country_id: selectedStore.country_id,
            region: selectedStore.region,
            postcode: selectedStore.postcode,
            street: [selectedStore.address],
            region_id: selectedStore.region_id,
            region_code: selectedStore.country_id,
          },
          shipping_address: {
            firstname: form.firstName,
            lastname: form.lastName,
            telephone: form.phone,
            email: form.email,
            city: selectedStore.city,
            country_id: selectedStore.country_id,
            region: selectedStore.region,
            postcode: selectedStore.postcode,
            street: [selectedStore.address],
            region_id: selectedStore.region_id,
            region_code: selectedStore.country_id,
          },
          shipping_carrier_code:
            shippingMethods[selectedMethod]?.carrier_code ?? '',
          shipping_method_code:
            shippingMethods[selectedMethod]?.method_code ?? '',
        })
          .then(() => {
            setIsShowPayment(true);
          })
          .finally(() => {
            setIsLoadingPay(false);
          });
      });
    }
  }, [selectedMethod, shippingMethods]);

  useEffect(() => {
    if (current) {
      setFilteredStores(
        sortStoresByDistance(filterStoresByCoordinates(stores.stores, current)),
      );
    } else {
      setFilteredStores([]);
    }
  }, [current, stores.stores]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Details</Text>
      <InputComponent
        ref={inputs['firstName']}
        returnKeyType={'next'}
        onSubmitEditing={() => {
          focusTheField('lastName');
        }}
        label={
          <Text>
            First Name <Text style={styles.required}>*</Text>
          </Text>
        }
        {...getInputProps('firstName')}
      />
      <InputComponent
        ref={inputs['lastName']}
        returnKeyType={'next'}
        onSubmitEditing={() => {
          focusTheField(auth.profile ? 'phone' : 'email');
        }}
        label={
          <Text>
            Last Name <Text style={styles.required}>*</Text>
          </Text>
        }
        {...getInputProps('lastName')}
      />
      {!auth.profile && (
        <InputComponent
          autoCapitalize="none"
          ref={inputs['email']}
          returnKeyType={'next'}
          onSubmitEditing={() => {
            focusTheField('phone');
          }}
          label={
            <Text>
              Email Address <Text style={styles.required}>*</Text>
            </Text>
          }
          {...getInputProps('email')}
        />
      )}
      <PhoneNumberInput
        ref={inputs['phone']}
        label={
          <Text>
            Phone Number <Text style={styles.required}>*</Text>
          </Text>
        }
        onChange={onChange('phone')}
        value={form.phone}
        onBlur={onBlur('phone')}
        isError={!!error && !!error['phone']}
        error={!!error ? error['phone'] : undefined}
      />

      <Text style={styles.title}>Find a Store</Text>
      <Text style={styles.desc}>
        Which store would you like to collect from?
      </Text>

      <GoogleAutoComplete
        onPress={json => {
          setCurrent({
            latitude: json.results[0].geometry.location.lat,
            longitude: json.results[0].geometry.location.lng,
          });
        }}
      />

      {filteredStores.length > 0 && (
        <View style={{marginTop: 8, gap: 8}}>
          {filteredStores.slice(0, 5).map(store => (
            <TouchableOpacity
              key={store.id}
              style={[
                styles.shippingCard,
                store.id === selectedStore?.id && styles.shippingCardActive,
              ]}
              onPress={() => {
                setSelectedStore(store);
                setSelectionPoint(store.id);
              }}>
              <CheckBox checked={store.id === selectedStore?.id} />
              <View>
                <Text style={styles.shippingCardBold}>
                  {store.name}
                  {current && (
                    <Text style={styles.shippingCardDistance}>
                      {' '}
                      ({Number(store.distance).toFixed(2)} miles)
                    </Text>
                  )}
                </Text>
                <Text style={styles.shippingCardDesc}>{store.city}</Text>
                <Text style={styles.shippingCardDesc}>{store.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!!selectedStore && (
        <View style={{borderWidth: 1, marginTop: 15}}>
          <StoreComponent storeFinder={selectedStore} withOutStoreOptions />
        </View>
      )}

      {!!shippingMethods && shippingMethods.length > 0 && (
        <View style={styles.shippingContainer}>
          {shippingMethods.map((method, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.shippingCard,
                index === selectedMethod && styles.shippingCardActive,
              ]}
              onPress={() => setSelectedMethod(index)}>
              <CheckBox checked={index === selectedMethod} />
              <View style={{justifyContent: 'center'}}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: Dimensions.get('screen').width * 0.76,
                  }}>
                  <Text
                    style={[
                      styles.shippingCardBold,
                      {flexWrap: 'wrap', width: '77%'},
                    ]}>
                    {method.method_title}
                  </Text>

                  {method.amount > 0 && (
                    <Text style={[styles.shippingCardBold, {marginRight: 8}]}>
                      £{method.amount.toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {isShowPayment && selectedStore && (
            <Payment
              context={{
                method: deliveryMethod,
                form: {
                  ...form,
                  city: selectedStore.city,
                  country_id: selectedStore.country_id,
                  customer_id: null,
                  region: selectedStore.region,
                  postcode: selectedStore.postcode,
                  street: [selectedStore.address],
                  region_id: selectedStore.region_id,
                },
              }}
              isLoading={isLoadingPay || isCouponUpdating}
            />
          )}
        </View>
      )}
    </View>
  );
};

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    get_stores_array: () => dispatch(get_stores()),
    setSelectionPoint: (collectionPointId: number) =>
      dispatch(set_selection_point_id(collectionPointId)),
    estimateShippingMethods: (val: EstimateShippingMethods) =>
      dispatch(estimate_shipping_methods(val)),
    sendShippingInformation: (val: SendShippingInformation) =>
      dispatch(send_shipping_information(val)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    stores: state.stores,
    auth: state.auth,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(StoreForm));
