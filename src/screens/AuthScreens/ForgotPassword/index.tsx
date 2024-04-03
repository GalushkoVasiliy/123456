import React, {useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import Toast from 'react-native-toast-message';
import styles from './styles/styles';
import InputComponent from '../../../components/InputComponent/InputComponent';
import {connect} from 'react-redux';
import {forgot_password} from '../../../redux/actions/auth.actions';
import {SCHEMA} from './types/types';
import {ReducerType} from '../../../redux/reducers/reducers';
import {useRoute} from '@react-navigation/native';
import Header from '../../../components/Header';
import KeyboardAvoid from '../../../components/KeyboardAvoid';
import Button from '../../../components/button';

const ForgotPassword = props => {
  const route = useRoute();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const resetPassword = async () => {
    SCHEMA.validate({email})
      .then(async () => {
        const response = await props.forgot_password(email);
        if (typeof response === 'object' && 'message' in response) {
          return Toast.show({
            type: 'error',
            text1: response.message,
            text2: 'forgot_password',
            visibilityTime: 2000,
          });
        } else if (response == true) {
          Toast.show({
            type: 'success',
            text1: `If there is an account associated with ${email} you will receive an email with a link to reset your password.`,
            visibilityTime: 2000,
          });
          setEmail('');
        }
      })
      .catch(err => {
        setError(err.message);
      });
  };

  return (
    <View style={{flex: 1}}>
      <Header />
      <KeyboardAvoid>
        <View style={styles.container}>
          <View style={styles.pageTitleWrapper}>
            <Text style={styles.pageTitle}>Forgotten Your Password?</Text>
          </View>
          <View style={styles.mainContainer}>
            <InputComponent
              label="Email"
              autoCapitalize="none"
              value={email}
              onChangeText={text => setEmail(text)}
              isError={!!error}
              error={error}
              onChange={() => setError('')}
            />

            <Button onPress={resetPassword} label="Reset My Password" />

            <View style={{flex: 1}} />
          </View>
        </View>
      </KeyboardAvoid>
    </View>
  );
};

const mapDispatchToProps = (dispatch: (value: any) => void) => {
  return {
    forgot_password: (email: string) => dispatch(forgot_password(email)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(ForgotPassword));
