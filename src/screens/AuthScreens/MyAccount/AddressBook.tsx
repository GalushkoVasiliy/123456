/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {View, StyleSheet, ScrollView, Text, TextInput} from 'react-native';
import InputComponent from '../../../components/InputComponent/InputComponent';
import {connect} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import Toast from 'react-native-toast-message';

import COLORS from '../../../config/COLORS';
import PageTitle from '../../../components/PageTitle';
import {ReducerType} from '../../../redux/reducers/reducers';
import {update_profile_addresses} from '../../../redux/actions/customer.actions';
import KeyboardAvoid from '../../../components/KeyboardAvoid';
import Header from '../../../components/Header';
import Button from '../../../components/button';
import Select from '../../../components/Select/Select';
import PhoneNumberInput from '../../../components/PhoneNumberInput';
import PhoneInput from 'react-native-phone-input';
import CheckBox from '../../../components/CheckBox/CheckBox';
import {SCHEMA} from './schema';

interface Props {
  updateAddress: (body: any) => Promise<any>;
  auth: ReducerType['auth'];
}

interface AddressFormState {
  firstname: string;
  lastname: string;
  telephone: string;
  street: [string | null];
  city: string;
  countryId: string;
  postcode: string;
  company: string;
}

const AddressBook = (props: Props) => {
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const [street, setStreet] = useState<string>();
  const [street1, setStreet1] = useState<string>();
  const [postcode, setPostcode] = useState<string>();
  const [city, setCity] = useState<string>();
  const [phone, setTelephone] = useState<string>();
  const [defaultBilling, setDefaultBilling] = useState<boolean>();
  const [defaultShipping, setDefaultShipping] = useState<boolean>();
  const [error, setError] = useState<Partial<AddressFormState>>({});

  const dropdownRef = useRef<SelectDropdown>(null);

  const [selectedAddress, setSelectedAddress] = useState<number | null>(
    props.auth.selectedAddress,
  );

  // variable to hold the references of the textfields
  const inputs = {
    firstName: React.createRef<TextInput>(),
    lastName: React.createRef<TextInput>(),
    email: React.createRef<TextInput>(),
    phone: React.createRef<PhoneInput>(),
    address1: React.createRef<TextInput>(),
    address2: React.createRef<TextInput>(),
    city: React.createRef<TextInput>(),
    postcode: React.createRef<TextInput>(),
  };

  // function to focus the field
  const focusTheField = (id: keyof typeof inputs) => {
    inputs[id].current?.focus();
  };

  const updateAddressRequest = async () => {
    if (selectedAddress == null) {
      return;
    }
    var addresses = Object.assign({}, props.auth.profile.addresses);
    // Creating new address
    if (!addresses[selectedAddress]) {
      addresses[selectedAddress] = {
        street: [],
        country_id: 'GB',
        region_id: 0,
        default_shipping: false,
        default_billing: false,
      };
    }
    addresses[selectedAddress].firstname = firstName;
    addresses[selectedAddress].lastname = lastName;
    addresses[selectedAddress].street[0] = street;
    addresses[selectedAddress].street[1] = street1;
    addresses[selectedAddress].postcode = postcode;
    addresses[selectedAddress].city = city;
    addresses[selectedAddress].telephone = phone;
    addresses[selectedAddress].default_billing = defaultBilling;
    addresses[selectedAddress].default_shipping = defaultShipping;

    SCHEMA.validate(addresses[selectedAddress], {abortEarly: false})
      .then(async () => {
        const res = await props.updateAddress({
          ...props.auth.profile,
          addresses: addresses,
        });

        if ('updated' in res && res.updated) {
          dropdownRef.current?.selectIndex(selectedAddress);
          Toast.show({
            type: 'success',
            text1: 'Address successfully saved',
            visibilityTime: 2000,
          });
          return;
        } else {
          Toast.show({
            type: 'error',
            text1: res.data.message,
            visibilityTime: 2000,
          });
          return;
        }
      })
      .catch(err => {
        const errors = err.inner.reduce((acc: any, val: any) => {
          if (val.path.indexOf('street["0"]') == -1) {
            acc[val.path] = val.message;
          } else {
            acc['street'] = [val.message];
          }
          return acc;
        }, {});
        setError(errors);
      });
  };

  const onBlur = (key: keyof AddressFormState, value: any) => () => {
    const obj: AddressFormState = {
      firstname: '',
      lastname: '',
      telephone: '',
      street: [''],
      city: '',
      countryId: '',
      postcode: '',
      company: '',
    };
    obj[key] = value;
    if (key == 'street') {
      obj[key] = [value];
    }
    SCHEMA.validateAt(key, obj)
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

  const deleteAddressRequest = async () => {
    if (selectedAddress == null) {
      return;
    }
    var addresses = Object.assign({}, props.auth.profile.addresses);
    delete addresses[selectedAddress];
    setSelectedAddress(null);
    dropdownRef.current?.reset();

    const res = await props.updateAddress({
      ...props.auth.profile,
      addresses: addresses,
    });

    if ('updated' in res && res.updated) {
      Toast.show({
        type: 'success',
        text1: 'Address successfully removed',
        visibilityTime: 2000,
      });
      return;
    } else {
      Toast.show({
        type: 'error',
        text1: res.data.message,
        visibilityTime: 2000,
      });
      return;
    }
  };

  const onAddressSelected = (index: number) => {
    setError([]);
    setSelectedAddress(index);
    let currentAddress = props.auth.profile.addresses[index];
    if (!currentAddress) {
      currentAddress = {street: []};
    }

    setFirstName(currentAddress.firstname);
    setLastName(currentAddress.lastname);
    setStreet(currentAddress.street[0]);
    setStreet1(currentAddress.street[1]);
    setPostcode(currentAddress.postcode);
    setCity(currentAddress.city);
    setTelephone(currentAddress.telephone);
    setDefaultBilling(currentAddress.default_billing);
    setDefaultShipping(currentAddress.default_shipping);
  };

  const getAddresses = function () {
    let addresses: any[] = [];
    if (!props.auth.token) {
      return addresses;
    }

    props.auth.profile.addresses.map((dataRow: any) =>
      addresses.push(
        dataRow.firstname +
          ' - ' +
          dataRow.street[0] +
          '..., ' +
          dataRow.postcode +
          ', ' +
          dataRow.city,
      ),
    );
    addresses.push('Add New Address');
    return addresses;
  };

  const renderAddress = function () {
    if (selectedAddress == null) {
      return;
    }

    return (
      <>
        <View style={{height: 80}}>
          <InputComponent
            ref={inputs.firstName}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              focusTheField('lastName');
            }}
            label="First Name"
            value={firstName}
            onChangeText={text => setFirstName(text)}
            onBlur={onBlur('firstname', firstName)}
            isError={!!error && !!error['firstname']}
            error={!!error ? error['firstname'] : undefined}
          />
        </View>
        <View style={{height: 80}}>
          <InputComponent
            ref={inputs.lastName}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              focusTheField('address1');
            }}
            label="Last Name"
            value={lastName}
            onChangeText={text => setLastName(text)}
            onBlur={onBlur('lastname', lastName)}
            isError={!!error && !!error['lastname']}
            error={!!error ? error['lastname'] : undefined}
          />
        </View>
        <View style={{height: 80}}>
          <InputComponent
            ref={inputs.address1}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              focusTheField('address2');
            }}
            label="Street Line 1"
            value={street}
            onChangeText={text => setStreet(text)}
            onBlur={onBlur('street', street)}
            isError={!!error && !!error['street'] && !!error['street'][0]}
            error={(!!error && error['street']) || undefined}
          />
        </View>
        <View style={{height: 80}}>
          <InputComponent
            ref={inputs.address2}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              focusTheField('postcode');
            }}
            label="Street Line 2"
            value={street1}
            onChangeText={text => setStreet1(text)}
          />
        </View>
        <View style={{height: 80}}>
          <InputComponent
            ref={inputs.postcode}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              focusTheField('city');
            }}
            label="Postcode"
            value={postcode}
            onChangeText={text => setPostcode(text)}
            onBlur={onBlur('postcode', postcode)}
            isError={!!error && !!error['postcode']}
            error={!!error ? error['postcode'] : undefined}
          />
        </View>
        <View style={{height: 80}}>
          <InputComponent
            ref={inputs.city}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              focusTheField('phone');
            }}
            label="City"
            value={city}
            onChangeText={text => setCity(text)}
            onBlur={onBlur('city', city)}
            isError={!!error && !!error['city']}
            error={!!error ? error['city'] : undefined}
          />
        </View>
        <View style={{height: 80}}>
          <PhoneNumberInput
            ref={inputs.phone}
            label="Telephone"
            onChange={text => setTelephone(text)}
            value={phone || ''}
            onBlur={onBlur('telephone', phone)}
            isError={!!error && !!error['telephone']}
            error={!!error ? error['telephone'] : undefined}
          />
        </View>
        <CheckBox
          style={{justifyContent: 'space-between', height: 40}}
          onPress={() => {
            setDefaultBilling(!defaultBilling);
          }}
          checked={!!defaultBilling}
          leftLabel="Default Billing"
          type="checkbox"
        />
        <CheckBox
          style={{justifyContent: 'space-between', height: 40}}
          onPress={() => {
            setDefaultShipping(!defaultShipping);
          }}
          checked={!!defaultShipping}
          leftLabel="Default Shipping"
          type="checkbox"
        />
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <PageTitle isTitle textKey="Address Book" />

      <KeyboardAvoid>
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={styles.scroll}
          keyboardShouldPersistTaps={'handled'}>
          <View
            style={{
              flex: 1,
              padding: 10,
              paddingTop: 0,
              backgroundColor: '#fff',
              gap: 8,
            }}>
            <Select
              ref={dropdownRef}
              data={getAddresses()}
              onSelect={(_, index) => {
                onAddressSelected(index);
              }}
              defaultButtonText="Select Address"
              defaultValue={selectedAddress}
              renderCustomizedRowChild={item => (
                <View style={{alignItems: 'center'}}>
                  <Text style={styles.selectItem}>{item}</Text>
                </View>
              )}
            />
            {renderAddress()}
            <View style={styles.buttonContainer}>
              {selectedAddress !== null && (
                <Button
                  style={{width: '100%'}}
                  onPress={updateAddressRequest}
                  label={
                    props.auth.profile.addresses[selectedAddress]
                      ? 'Update'
                      : 'Save'
                  }
                />
              )}

              {selectedAddress !== null &&
                props.auth.profile.addresses[selectedAddress] && (
                  <Button
                    style={{width: '100%'}}
                    color="red"
                    onPress={deleteAddressRequest}
                    label="Delete"
                  />
                )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoid>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: 20,
  },
  selectItem: {
    fontSize: 14,
    color: COLORS.black,
  },
  button: {
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 8,
    marginTop: 0,
  },
  buttonContainer: {
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  buttonDelete: {
    width: '70%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginTop: 0,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    paddingBottom: 0,
    height: 25,
    marginBottom: 0,
  },
  buttonDeleteText: {
    color: COLORS.red,
    fontSize: 20,
    fontWeight: '700',
    paddingTop: 0,
    marginTop: -10,
  },
  label: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 26,
    marginTop: 30,
  },
  text: {textAlign: 'center', fontWeight: 'bold'},
  dataWrapper: {marginTop: -1},
  row: {height: 30},
  scroll: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    updateAddress: (body: any) =>
      dispatch(update_profile_addresses(body.id, body)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    auth: state.auth,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddressBook);
