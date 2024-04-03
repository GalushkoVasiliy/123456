import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import styles from './styles/styles';
import BaseText from '../../../components/BaseText';
import {useNavigation} from '@react-navigation/native';
import InputComponent from '../../../components/InputComponent/InputComponent';
import {IRegister, register} from '../../../redux/actions/auth.actions';
import {connect} from 'react-redux';
import {SCHEMA, SignUpState, Props, initialState} from './types/types';
import Header from '../../../components/Header';
import KeyboardAvoid from '../../../components/KeyboardAvoid';
import Button from '../../../components/button';
import PhoneNumberInput from '../../../components/PhoneNumberInput';
import PhoneInput from 'react-native-phone-input';
import DeviceInfo from 'react-native-device-info';
import COLORS from '../../../config/COLORS';

const SignUp = (props: Props) => {
  const {navigate} = useNavigation();

  const [form, setForm] = useState<SignUpState>(initialState);
  const [error, setError] = useState<Partial<SignUpState> | null>(null);

  // variable to hold the references of the textfields
  const inputs = {
    firstName: React.createRef<TextInput>(),
    lastName: React.createRef<TextInput>(),
    email: React.createRef<TextInput>(),
    phone: React.createRef<PhoneInput>(),
    address1: React.createRef<TextInput>(),
    address2: React.createRef<TextInput>(),
    address3: React.createRef<TextInput>(),
    city: React.createRef<TextInput>(),
    postcode: React.createRef<TextInput>(),
    company: React.createRef<TextInput>(),
    password: React.createRef<TextInput>(),
    password2: React.createRef<TextInput>(),
  };

  // function to focus the field
  const focusTheField = (id: keyof typeof inputs) => {
    inputs[id].current?.focus();
  };

  const onChange = (key: string) => (text: string) => {
    setForm(prev => ({
      ...prev,
      [key]: text,
    }));
  };

  const goToSignIn = () => navigate('SignIn');

  const signUp = () => {
    SCHEMA.validate(form, {abortEarly: false})
      .then(() => {
        const request: IRegister = {
          customer: {
            email: form.email,
            firstname: form.firstName,
            lastname: form.lastName,
            website_id: '2',
            addresses: [
              {
                defaultShipping: true,
                defaultBilling: true,
                firstname: form.firstName,
                lastname: form.lastName,
                postcode: form.postcode,
                street: [form.address1, form.address2, form.address3],
                city: form.city,
                telephone: form.phone,
                countryId: 'GB',
                company: form.company,
              },
            ],
          },
          password: form.password,
        };

        props.register(request).then(response => {
          if (response) {
            setError(null);
            navigate('MyAccount');
          }
        });
      })
      .catch(err => {
        const errors = err.inner.reduce((acc: any, val: any) => {
          acc[val.path] = val.message;
          return acc;
        }, {});
        setError(errors);
      });
  };
  const onBlur = (key: keyof SignUpState) => () => {
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

  const getInputProps = (key: keyof SignUpState) => ({
    value: form[key],
    onBlur: onBlur(key),
    onChangeText: onChange(key),
    ...(!!error &&
      error[key] && {
        isError: !!error[key],
        error: error[key],
      }),
  });

  return (
    <View style={{flex: 1}}>
      <Header />
      <KeyboardAvoid>
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}>
          <View style={styles.pageTitleWrapper}>
            <Text style={styles.pageTitle}>
              Create Your Ryman Rewards Account
            </Text>
          </View>
          <View style={styles.mainContainer}>
            <InputComponent
              ref={inputs['firstName']}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                focusTheField('lastName');
              }}
              label="First Name"
              {...getInputProps('firstName')}
            />
            <InputComponent
              ref={inputs['lastName']}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                focusTheField('email');
              }}
              label="Last Name"
              {...getInputProps('lastName')}
            />
            <InputComponent
              autoCapitalize="none"
              ref={inputs['email']}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                focusTheField('phone');
              }}
              label="Email"
              {...getInputProps('email')}
            />
            <PhoneNumberInput
              ref={inputs['phone']}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                focusTheField('address1');
              }}
              label="Phone Number"
              onChange={onChange('phone')}
              value={form.phone}
              onBlur={onBlur('phone')}
              isError={!!error && !!error['phone']}
              error={!!error ? error['phone'] : undefined}
            />
            <InputComponent
              ref={inputs['address1']}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                focusTheField('address2');
              }}
              label="Address Line"
              {...getInputProps('address1')}
            />
            <InputComponent
              ref={inputs['address2']}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                focusTheField('address3');
              }}
              label="Address Line 2 (optional)"
              {...getInputProps('address2')}
            />
            <InputComponent
              ref={inputs['address3']}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                focusTheField('city');
              }}
              label="Address Line 3 (optional)"
              {...getInputProps('address3')}
            />
            <InputComponent
              ref={inputs['city']}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                focusTheField('postcode');
              }}
              label="City"
              {...getInputProps('city')}
            />
            <InputComponent
              ref={inputs['postcode']}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                focusTheField('company');
              }}
              label="Postcode"
              autoCapitalize={'characters'}
              {...getInputProps('postcode')}
            />
            <InputComponent
              ref={inputs['company']}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                focusTheField('password');
              }}
              label="Company (optional)"
              {...getInputProps('company')}
            />

            <InputComponent
              ref={inputs['password']}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                focusTheField('password2');
              }}
              secureTextEntry
              label="Password"
              {...getInputProps('password')}
            />
            <InputComponent
              ref={inputs['password2']}
              secureTextEntry
              label="Confirm Password"
              {...getInputProps('confirmPassword')}
            />

            <Button onPress={signUp} label="Create Account" />
          </View>

          <View style={styles.footer}>
            <BaseText textKey="signUp.haveAccount" />
            <TouchableOpacity style={styles.signUpWrapper} onPress={goToSignIn}>
              <BaseText style={styles.signUp} textKey="signUp.login" />
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center', paddingBottom: 5}}>
            <Text style={{fontSize: 11, color: COLORS.grayDark}}>
              Version: {DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoid>
    </View>
  );
};

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    register: (body: IRegister) => dispatch(register(body)),
  };
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(SignUp));
