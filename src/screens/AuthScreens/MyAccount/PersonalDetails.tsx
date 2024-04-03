/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TextInput} from 'react-native';
import Toast from 'react-native-toast-message';
import InputComponent from '../../../components/InputComponent/InputComponent';
import {connect} from 'react-redux';

import COLORS from '../../../config/COLORS';
import Header from '../../../components/Header';
import PageTitle from '../../../components/PageTitle';
import {
  update_profile,
  ICustomer,
} from '../../../redux/actions/customer.actions';
import {ReducerType} from '../../../redux/reducers/reducers';
import KeyboardAvoid from '../../../components/KeyboardAvoid';
import Button from '../../../components/button';
import {useNavigation} from '@react-navigation/native';

interface Props {
  auth: ReducerType['auth'];
  updateProfile: (body: ICustomer) => Promise<any>;
}

const PersonalDetails = (props: Props) => {
  const {navigate} = useNavigation();
  const [email, setEmail] = useState<string>(props.auth.profile.email);
  const [firstName, setFirstName] = useState<string>(
    props.auth.profile.firstname,
  );
  const [lastName, setLastName] = useState<string>(props.auth.profile.lastname);
  const [isLoading, setIsLoading] = useState(false);

  // variable to hold the references of the textfields
  const inputs = {
    firstName: React.createRef<TextInput>(),
    lastName: React.createRef<TextInput>(),
    email: React.createRef<TextInput>(),
  };

  // function to focus the field
  const focusTheField = (id: keyof typeof inputs) => {
    inputs[id].current?.focus();
  };

  const updateProfileRequest = async () => {
    setIsLoading(true);
    const res = await props
      .updateProfile({
        email: email,
        firstname: firstName,
        lastname: lastName,
        id: props.auth.profile.id,
      })
      .finally(() => setIsLoading(false));

    if ('updated' in res && res.updated) {
      Toast.show({
        type: 'success',
        text1: 'Profile successfully updated',
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        type: 'error',
        text1: res.data.message,
        visibilityTime: 2000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <PageTitle isTitle textKey="Personal Details" />

      <KeyboardAvoid>
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'handled'}>
          <InputComponent
            ref={inputs['firstName']}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              focusTheField('lastName');
            }}
            label="First Name"
            value={firstName}
            onChangeText={text => setFirstName(text)}
          />
          <InputComponent
            ref={inputs['lastName']}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              focusTheField('email');
            }}
            label="Last Name"
            value={lastName}
            onChangeText={text => setLastName(text)}
          />
          <InputComponent
            ref={inputs['email']}
            returnKeyType={'next'}
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
          />

          <Button
            onPress={updateProfileRequest}
            label="Save"
            isLoading={isLoading}
          />

          <Button
            style={{marginTop: 20}}
            color="red"
            onPress={() => navigate('DeleteMyAccount')}
            label="Delete My Account"
          />
        </ScrollView>
      </KeyboardAvoid>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 15,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    updateProfile: (body: ICustomer) => dispatch(update_profile(body)),
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
)(React.memo(PersonalDetails));
