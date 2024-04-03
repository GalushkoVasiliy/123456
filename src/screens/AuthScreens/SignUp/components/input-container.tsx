/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useState} from 'react';
import {
  // I18nManager,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// import Icon from '../../../components/common/Icon';

import COLORS from '../../../../config/COLORS';
import I18n from '../../../../locales';
import styles from '../styles/styles';
import themes from '../styles/themes';
import {Email, InputProps, SCHEMA} from '../types/types';
import BaseText from '../../../../components/BaseText';

const InputContainer = (props: InputProps) => {
  const stylesTheme = themes[props.theme || 'black'];
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const checkData = async (data: Email) => {
    SCHEMA.validate(data)
      .then(() => {
        data.email ? setEmailError('') : setPasswordError('');
      })
      .catch(err => {
        data.email
          ? setEmailError(err.errors[0])
          : setPasswordError(err.errors[0]);
      });
  };

  const setEmail = useCallback(
    (value: string) => {
      props.setEmail(value.trim());
      checkData({email: value.trim()});
    },
    [props],
  );

  const setPassword = useCallback(
    (value: string) => {
      props.setPassword(value.trim());
      checkData({password: value.trim()});
    },
    [props],
  );

  const setConfirmPassword = useCallback(
    (value: string) => {
      props.setConfirmPassword(value.trim());
      checkData({password: value.trim()});
    },
    [props],
  );

  const inputs = useCallback(() => {
    return [
      {
        id: '1',
        name: 'signIn.email',
        iconName: 'email',
        onChange: (text: string) => setEmail(text),
        defaultValue: props.email,
        placeholder: 'signIn.email',
        security: false,
      },
      {
        id: '2',
        name: 'signIn.password',
        iconName: 'lock-closed-outline',
        onChange: (text: string) => setPassword(text),
        defaultValue: props.password,
        placeholder: 'signIn.password',
        security: true,
      },
      {
        id: '3',
        name: 'signUp.confirmPassword',
        iconName: 'lock-closed-outline',
        onChange: (text: string) => setConfirmPassword(text),
        defaultValue: props.password,
        placeholder: 'signUp.confirmPassword',
        security: true,
      },
    ];
  }, [props.email, props.password, setEmail, setPassword, setConfirmPassword]);

  const [secure, setSecure] = useState(true);
  return (
    <View>
      {inputs().map(input => (
        <View key={input.id}>
          <View
            style={[
              stylesTheme.textAreaContainer,
              emailError.length ? styles.error : {},
            ]}>
            <BaseText
              style={stylesTheme.inputField}
              textKey={input.placeholder}
            />
            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={stylesTheme.textArea}
                underlineColorAndroid="transparent"
                defaultValue={input.defaultValue}
                onChangeText={input.onChange}
                // placeholder={input.placeholder}
                placeholderTextColor="grey"
                secureTextEntry={input.name === 'password' ? secure : false}
              />
              {input.name === 'password' && (
                <TouchableOpacity
                  onPress={() => {
                    setSecure(!secure);
                  }}>
                  {/* <Icon
                    name={input.iconName}
                    size={20}
                    color={COLORS.silver}
                    ins={true}
                  /> */}
                </TouchableOpacity>
              )}
            </View>
          </View>
          {input.name === 'password' && passwordError.length ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          {input.name === 'email' && emailError.length ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
};

export default InputContainer;
