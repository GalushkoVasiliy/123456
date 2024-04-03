/* eslint-disable react-native/no-inline-styles */
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import InputComponent from '../../../InputComponent/InputComponent';
import {SCHEMA} from './schema';
import styles from './styles';
import {connect, useSelector} from 'react-redux';
import {
  DeliveryOptions,
  estimate_shipping_methods,
  EstimateShippingMethods,
  send_shipping_information,
  SendShippingInformation,
  ShippingMethod,
} from '../../../../redux/actions/checkout.actions';
import {ReducerType} from '../../../../redux/reducers/reducers';
import CheckBox from '../../../CheckBox/CheckBox';
import Accordion from '../../../Accordion/Accordion';
import Toast from 'react-native-toast-message';
import Button from '../../../button';
import AutoComplete from '../../../AutoComplete';
import {update_profile_addresses} from '../../../../redux/actions/customer.actions';
import Payment from '../../../Payment/Payment';
import PhoneNumberInput from '../../../PhoneNumberInput';
import PhoneInput from 'react-native-phone-input';
import {MODAL_NAMES, ModalContext} from '../../../../utils/modal-context';
import {
  getIsGiftDisplayed,
  setIsGiftDisplayed,
} from '../../../../utils/giftDisplayControl';

interface StoreFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  countryId: string;
  postcode: string;
  company: string;
}

enum InputsEnum {
  firstName,
  lastName,
  email,
  phone,
  address1,
  address2,
  address3,
  city,
  postcode,
  company,
}

interface Props {
  estimateShippingMethods: (
    val: EstimateShippingMethods,
  ) => Promise<ShippingMethod[]>;
  sendShippingInformation: (val: SendShippingInformation) => Promise<void>;
  auth: ReducerType['auth'];
  deliveryMethod: DeliveryOptions;
  updateAddress: (body: any) => Promise<void>;
  onScrollBottom: () => void;
  isGiftAdded: boolean;
}

enum Envelope {
  toMe,
  toRecipient,
}

const DeliverForm = ({
  estimateShippingMethods,
  sendShippingInformation,
  auth,
  deliveryMethod,
  updateAddress,
  onScrollBottom,
  isGiftAdded,
}: Props) => {
  const isCouponUpdating = useSelector(
    (state: ReducerType) => state.checkout.isCouponUpdating,
  );
  const gift_products = useSelector(
    (state: ReducerType) =>
      state.cart.cart?.extension_attributes.gift_information?.gift_products,
  );
  const cart = useSelector((state: ReducerType) => state.cart.cart);

  const isNonDnb = useMemo(() => {
    if (cart) {
      return cart.items.some(item => !Object.hasOwn(item, 'dnb_image_url'));
    }
    return false;
  }, [cart]);

  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [shippingMethods, setShippingMethods] = useState<
    ShippingMethod[] | null
  >(null);
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [error, setError] = useState<Partial<StoreFormState>>({});
  const isProfileAddresses = auth.profile && auth.profile.addresses.length > 0;
  const defaultShippingAddressIdx =
    isProfileAddresses &&
    auth.profile.addresses.findIndex(
      ({default_shipping}: any) => default_shipping == true,
    );
  const [selectedAddress, setSelectedAddress] = useState(
    defaultShippingAddressIdx > -1 ? defaultShippingAddressIdx : 0,
  );
  const [isAddAddressForm, setIsAddAddressForm] = useState(!isProfileAddresses);
  const [isShowPayment, setIsShowPayment] = useState(false);
  const [extraEnvelope, setExtraEnvelope] = useState<Envelope | null>(null);
  const [isLoadingPay, setIsLoadingPay] = useState(false);

  const [form, setForm] = useState<StoreFormState>({
    firstName: isProfileAddresses
      ? auth.profile?.addresses[selectedAddress].firstname
      : '',
    lastName: isProfileAddresses
      ? auth.profile?.addresses[selectedAddress].lastname
      : '',
    email: auth?.profile?.email ?? '',
    phone: isProfileAddresses
      ? auth.profile?.addresses[selectedAddress].telephone
      : '',
    address1: isProfileAddresses
      ? auth.profile?.addresses[selectedAddress].street.at(0) ?? ''
      : '',
    address2: isProfileAddresses
      ? auth.profile?.addresses[selectedAddress].street.at(1) ?? ''
      : '',
    address3: isProfileAddresses
      ? auth.profile?.addresses[selectedAddress].street.at(2) ?? ''
      : '',
    city: isProfileAddresses
      ? auth.profile?.addresses[selectedAddress].city
      : '',
    countryId: isProfileAddresses
      ? auth.profile?.addresses[selectedAddress].country_id
      : 'GB',
    postcode: isProfileAddresses
      ? auth.profile?.addresses[selectedAddress].postcode
      : '',
    company: isProfileAddresses
      ? auth.profile?.addresses[selectedAddress]?.company
      : '',
  });

  const {onOpen} = useContext(ModalContext);

  // variable to hold the references of the textfields
  const inputs = useRef<(PhoneInput | TextInput)[]>([]);

  // function to focus the field
  const focusTheField = (id: number) => {
    inputs.current[id].focus();
  };

  const handleEstimate = () => {
    console.log('estimateShippingMethods - handleEstimate');
    SCHEMA.validate(form, {abortEarly: false})
      .then(() => {
        estimateShippingMethods({
          firstname: form.firstName,
          lastname: form.lastName,
          telephone: form.phone,
          email: form.email,
          city: form.city,
          country_id: form.countryId,
          customer_id: auth.profile?.id ?? null,
          postcode: form.postcode,
          street: [form.address1, form.address2, form.address3],
        }).then(res => setShippingMethods(res));
      })
      .catch(err => {
        const errors = err.inner.reduce((acc: any, val: any) => {
          acc[val.path] = val.message;
          return acc;
        }, {});

        const isPostcodeFocus =
          inputs.current[InputsEnum.postcode] !== undefined &&
          (inputs.current[InputsEnum.postcode] as TextInput)?.isFocused();

        if (
          'postcode' in errors &&
          !!auth.token &&
          form.postcode.length > 0 &&
          !isPostcodeFocus
        ) {
          Toast.show({
            type: 'error',
            text1: 'Postcode has wrong format, check in your Address Book',
            visibilityTime: 2000,
          });
        }

        setShippingMethods(null);
      });
  };

  useLayoutEffect(() => {
    const timerId = setTimeout(handleEstimate, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [estimateShippingMethods, form, auth.profile?.id]);

  const openModal = () => {
    if (!isNonDnb && gift_products && gift_products.length > 0) {
      setIsGiftDisplayed(cart?.id as number);
      onOpen(MODAL_NAMES.gift_carousel, {
        gifts: gift_products,
        handleEstimate,
      });
    }
  };

  useLayoutEffect(() => {
    if (!isGiftAdded) {
      getIsGiftDisplayed(cart?.id as number).then(value => {
        if (!value) {
          openModal();
        }
      });
    }
  }, []);

  useEffect(() => {
    // Workaround to make sure payments are always visible after page re-renders due editing the form inputs
    if (
      !isLoadingPay &&
      !isShowPayment &&
      selectedMethod !== null &&
      shippingMethods &&
      shippingMethods.length > 0
    ) {
      setIsShowPayment(true);
    }
  }, [isLoadingPay]);

  useEffect(() => {
    if (isProfileAddresses) {
      setForm({
        firstName: auth.profile.addresses[selectedAddress].firstname,
        lastName: auth.profile.addresses[selectedAddress].lastname,
        email: auth?.profile?.email ?? '',
        phone: auth.profile.addresses[selectedAddress].telephone,
        address1: auth.profile.addresses[selectedAddress].street.at(0) ?? '',
        address2: auth.profile.addresses[selectedAddress].street.at(1) ?? '',
        address3: auth.profile.addresses[selectedAddress].street.at(2) ?? '',
        city: auth.profile.addresses[selectedAddress].city,
        countryId: auth.profile.addresses[selectedAddress].country_id,
        postcode: auth.profile.addresses[selectedAddress].postcode,
        company: auth.profile.addresses[selectedAddress]?.company ?? '',
      });
    }
  }, [
    auth.profile?.addresses,
    auth.profile?.email,
    isProfileAddresses,
    selectedAddress,
  ]);

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
      shippingMethods &&
      shippingMethods.length > 0
    ) {
      SCHEMA.validate(form)
        .then(() => {
          setIsLoadingPay(true);
          sendShippingInformation({
            shipping_address: {
              firstname: form.firstName,
              lastname: form.lastName,
              telephone: form.phone,
              email: form.email,
              city: form.city,
              country_id: form.countryId,
              postcode: form.postcode,
              street: [form.address1, form.address2, form.address3],
              region_code: form.countryId,
            },
            shipping_carrier_code:
              shippingMethods[selectedMethod]?.carrier_code ?? '',
            shipping_method_code:
              shippingMethods[selectedMethod]?.method_code ?? '',
          })
            .then(() => {
              if (!isShowPayment) {
                setIsShowPayment(true);
              }
            })
            .finally(() => {
              setIsLoadingPay(false);
            });
        })
        .catch(() => {
          setIsShowPayment(false);
          setShippingMethods(null);
        });
    }
  }, [shippingMethods, selectedMethod, form]);

  const onSaveAddress = () => {
    SCHEMA.validate(form, {abortEarly: false})
      .then(() => {
        updateAddress({
          ...auth.profile,
          addresses: [
            ...auth.profile.addresses,
            {
              country_id: form.countryId,
              street: [form.address1, form.address2, form.address3],
              postcode: form.postcode,
              city: form.city,
              firstname: form.firstName,
              lastname: form.lastName,
              telephone: form.phone,
            },
          ],
        }).then(() => {
          Toast.show({
            visibilityTime: 2000,
            type: 'success',
            text1: 'Address successfully saved',
          });
          setActiveSections([]);
          setIsAddAddressForm(false);
          if (auth.profile.addresses.length > 0) {
            setSelectedAddress(auth.profile.addresses.length);
          }
        });
      })
      .catch(err => {
        const errors = err.inner.reduce((acc: any, val: any) => {
          acc[val.path] = val.message;
          return acc;
        }, {});
        setError(errors);

        const accordionItems = [
          'address1',
          'address2',
          'address3',
          'city',
          'postcode',
          'company',
        ];

        if (Object.keys(errors).some(item => accordionItems.includes(item))) {
          setActiveSections([0]);
        }
      });
  };

  const onAddAddress = () => {
    setIsAddAddressForm(true);
    setForm({
      firstName: '',
      lastName: '',
      email: auth?.profile?.email ?? '',
      address1: '',
      address2: '',
      address3: '',
      city: '',
      company: '',
      countryId: 'GB',
      postcode: '',
      phone: '',
    });
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', gap: 8, flex: 1, marginBottom: 16}}>
        <TouchableOpacity
          style={[
            styles.shippingCard,
            {flex: 1, justifyContent: 'center'},
            extraEnvelope === Envelope.toRecipient && styles.shippingCardActive,
          ]}
          onPress={() => setExtraEnvelope(Envelope.toRecipient)}>
          <Text
            style={[styles.selectItem, {textAlign: 'center', fontSize: 16}]}>
            Send Your Card <Text style={styles.shippingCardBold}>Directly</Text>{' '}
            to the Recipient
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.shippingCard,
            {flex: 1, justifyContent: 'center'},
            extraEnvelope === Envelope.toMe && styles.shippingCardActive,
          ]}
          onPress={() => setExtraEnvelope(Envelope.toMe)}>
          <Text
            style={[styles.selectItem, {textAlign: 'center', fontSize: 16}]}>
            Send the Card to <Text style={styles.shippingCardBold}>Me</Text>{' '}
            with a Spare Blank Envelope
          </Text>
        </TouchableOpacity>
      </View>

      {extraEnvelope !== null && (
        <>
          <Text style={styles.title}>Delivery Address</Text>

          {isProfileAddresses && (
            <View style={{marginBottom: 12, gap: 8}}>
              {auth.profile.addresses.map((address: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.shippingCard,
                    index === selectedAddress && styles.shippingCardActive,
                  ]}
                  onPress={() => setSelectedAddress(index)}>
                  <CheckBox checked={index === selectedAddress} />
                  <View style={{flex: 1}}>
                    <Text style={styles.shippingCardBold}>
                      {address.city}, {address.postcode}
                    </Text>

                    <Text
                      style={[
                        styles.shippingCardBold,
                        {flex: 1, flexWrap: 'wrap'},
                      ]}>
                      {address.street.join(', ')}
                    </Text>

                    <Text style={styles.shippingCardDesc}>
                      {address.telephone}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              <Button onPress={onAddAddress} label="Add New Address" />
            </View>
          )}

          {((isAddAddressForm && isProfileAddresses) ||
            !isProfileAddresses) && (
            <>
              <InputComponent
                ref={ref =>
                  (inputs.current[InputsEnum.firstName] = ref as TextInput)
                }
                returnKeyType={'next'}
                onSubmitEditing={() => {
                  focusTheField(InputsEnum.lastName);
                }}
                label={
                  <Text>
                    First Name <Text style={styles.required}>*</Text>
                  </Text>
                }
                {...getInputProps('firstName')}
              />
              <InputComponent
                ref={ref =>
                  (inputs.current[InputsEnum.lastName] = ref as TextInput)
                }
                returnKeyType={'next'}
                onSubmitEditing={() => {
                  focusTheField(
                    auth.profile ? InputsEnum.phone : InputsEnum.email,
                  );
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
                  ref={ref =>
                    (inputs.current[InputsEnum.email] = ref as TextInput)
                  }
                  returnKeyType={'next'}
                  onSubmitEditing={() => {
                    focusTheField(InputsEnum.phone);
                  }}
                  label={
                    <Text>
                      Email Address <Text style={styles.required}>*</Text>
                    </Text>
                  }
                  {...getInputProps('email')}
                  autoCapitalize="none"
                />
              )}
              <PhoneNumberInput
                ref={ref =>
                  (inputs.current[InputsEnum.phone] = ref as PhoneInput)
                }
                label={
                  <Text>
                    Phone Number <Text style={styles.required}>*</Text>
                  </Text>
                }
                onChange={onChange('phone')}
                value={form.phone}
                onBlur={onBlur('phone')}
                isError={!!error && !!error.phone}
                error={error ? error.phone : undefined}
              />
              <AutoComplete
                label="Quick Address Finder"
                style={{marginBottom: 16}}
                onPress={e => {
                  const newAddress = {
                    address1: e.addressLine1,
                    address2: e.addressLine2,
                    address3: e.addressLine3,
                    city: e.locality,
                    postcode: e.postalCode,
                    // countryId: address.countryId, countryId should be GB always
                  };
                  setForm(prev => ({
                    ...prev,
                    ...newAddress,
                  }));
                }}
              />

              <Accordion
                data={[
                  {
                    title: 'Enter Address Manually',
                    content: (
                      <>
                        <InputComponent
                          ref={ref =>
                            (inputs.current[InputsEnum.address1] =
                              ref as TextInput)
                          }
                          returnKeyType={'next'}
                          onSubmitEditing={() => {
                            focusTheField(InputsEnum.address2);
                          }}
                          label={
                            <Text>
                              Address Line 1{' '}
                              <Text style={styles.required}>*</Text>
                            </Text>
                          }
                          {...getInputProps('address1')}
                        />

                        <InputComponent
                          ref={ref =>
                            (inputs.current[InputsEnum.address2] =
                              ref as TextInput)
                          }
                          returnKeyType={'next'}
                          onSubmitEditing={() => {
                            focusTheField(InputsEnum.address3);
                          }}
                          label="Address Line 2 (optional)"
                          {...getInputProps('address2')}
                        />

                        <InputComponent
                          ref={ref =>
                            (inputs.current[InputsEnum.address3] =
                              ref as TextInput)
                          }
                          returnKeyType={'next'}
                          onSubmitEditing={() => {
                            focusTheField(InputsEnum.city);
                          }}
                          label="Address Line 3 (optional)"
                          {...getInputProps('address3')}
                        />

                        <InputComponent
                          ref={ref =>
                            (inputs.current[InputsEnum.city] = ref as TextInput)
                          }
                          returnKeyType={'next'}
                          onSubmitEditing={() => {
                            focusTheField(InputsEnum.postcode);
                          }}
                          label={
                            <Text>
                              City <Text style={styles.required}>*</Text>
                            </Text>
                          }
                          {...getInputProps('city')}
                        />

                        <InputComponent
                          ref={ref =>
                            (inputs.current[InputsEnum.postcode] =
                              ref as TextInput)
                          }
                          returnKeyType={'next'}
                          autoCapitalize={'none'}
                          onSubmitEditing={() => {
                            focusTheField(InputsEnum.company);
                          }}
                          label={
                            <Text>
                              Postcode <Text style={styles.required}>*</Text>
                            </Text>
                          }
                          {...getInputProps('postcode')}
                        />

                        <InputComponent
                          ref={ref =>
                            (inputs.current[InputsEnum.company] =
                              ref as TextInput)
                          }
                          label="Company (optional)"
                          {...getInputProps('company')}
                        />
                      </>
                    ),
                  },
                ]}
                open={activeSections}
                onChange={val => setActiveSections(val)}
              />

              {!!auth.token && (
                <Button
                  style={{marginTop: 8}}
                  onPress={onSaveAddress}
                  label="Save Address & Continue"
                />
              )}
            </>
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
                        <Text style={styles.shippingCardBold}>
                          £{method.amount.toFixed(2)}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {isShowPayment && (
                <Payment
                  context={{
                    method: deliveryMethod,
                    form: {
                      ...form,
                      street: [form.address1, form.address2, form.address3],
                    },
                    extraEnvelope: extraEnvelope === Envelope.toMe,
                  }}
                  isLoading={isLoadingPay || isCouponUpdating}
                  openModal={openModal}
                />
              )}
            </View>
          )}
        </>
      )}
    </View>
  );
};

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    estimateShippingMethods: (val: EstimateShippingMethods) =>
      dispatch(estimate_shipping_methods(val)),
    sendShippingInformation: (val: SendShippingInformation) =>
      dispatch(send_shipping_information(val)),
    updateAddress: (body: any) =>
      dispatch(update_profile_addresses(body.id, body)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    auth: state.auth,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(DeliverForm));
