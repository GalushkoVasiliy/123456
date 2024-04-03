/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Linking, TextInput} from 'react-native';

import {SCHEMA} from './types/types';
import {useNavigation} from '@react-navigation/native';
import BaseText from '../../../components/BaseText';
import styles from './styles/styles';
import Header from '../../../components/Header';
import InputComponent from '../../../components/InputComponent/InputComponent';
import {ILogin, login} from '../../../redux/actions/auth.actions';
import {connect} from 'react-redux';
import {ReducerType} from '../../../redux/reducers/reducers';
import KeyboardAvoid from '../../../components/KeyboardAvoid';
import {RYMAN_PRIVACY_POLICY} from '../../../config/CONSTANTS';
import Button from '../../../components/button';
import DeviceInfo from 'react-native-device-info';
import COLORS from '../../../config/COLORS';

interface IForm {
  email: string;
  password: string;
}

interface Props {
  login: (data: ILogin) => any;
  auth: ReducerType['auth'];
}

const SignIn = (props: Props) => {
  const {navigate} = useNavigation();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<Partial<IForm>>({});

  const passwordRef = React.createRef<TextInput>();

  const loginRequest = async () => {
    SCHEMA.validate({email, password}, {abortEarly: false})
      .then(async () => {
        try {
          await props.login({username: email, password});
        } catch (e) {
          console.error(e);
        }
      })
      .catch(err => {
        const errors = err.inner.reduce((acc: any, val: any) => {
          acc[val.path] = val.message;
          return acc;
        }, {});
        setError(errors);
      });
  };

  const onBlur = (key: keyof IForm) => () => {
    SCHEMA.validateAt(key, {email, password})
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

  const onChangeReset = (key: keyof IForm) => {
    const _error = {...error};

    if (key in _error) {
      delete _error[key];
      setError(_error);
    }
  };

  useEffect(() => {
    if (props.auth.token) {
      navigate('MyAccount');
    }
  }, [props.auth.token, navigate]);

  return (
    <View style={styles.page}>
      <Header backFalse />
      <KeyboardAvoid>
        <View style={styles.container}>
          <View style={styles.pageTitleWrapper}>
            <Text style={styles.pageTitle}>Sign in to your Ryman account</Text>
          </View>
          <View style={styles.mainContainer}>
            <InputComponent
              returnKeyType={'next'}
              onSubmitEditing={() => {
                passwordRef.current.focus();
              }}
              label="Email"
              value={email}
              onChange={() => onChangeReset('email')}
              onChangeText={text => setEmail(text)}
              isError={!!error?.email}
              error={error?.email}
              autoCapitalize={'none'}
              onBlur={onBlur('email')}
            />
            <InputComponent
              ref={passwordRef}
              secureTextEntry
              label="Password"
              labelRight={
                <TouchableOpacity onPress={() => navigate('ForgotPassword')}>
                  <BaseText textKey="signIn.forgotPassword" />
                </TouchableOpacity>
              }
              value={password}
              onChange={() => onChangeReset('password')}
              onChangeText={text => setPassword(text)}
              isError={!!error?.password}
              error={error?.password}
              onBlur={onBlur('password')}
            />

            <Button onPress={loginRequest} label="Sign-in" />
          </View>
        </View>
      </KeyboardAvoid>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.privacyPolicy}
          onPress={() => Linking.openURL(RYMAN_PRIVACY_POLICY)}>
          <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <BaseText textKey="signIn.haveAccount" />
          <TouchableOpacity
            style={styles.signUpWrapper}
            onPress={() => navigate('SignUp')}>
            <BaseText style={styles.signUp} textKey="signIn.signUp" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{alignItems: 'center', paddingBottom: 5}}>
        <Text style={{fontSize: 11, color: COLORS.grayDark}}>
          Version: {DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
        </Text>
      </View>
    </View>
  );
};

const mapDispatchToProps = (dispatch: (value: any) => void) => {
  return {
    login: (body: ILogin) => dispatch(login(body)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    auth: state.auth,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(SignIn));
