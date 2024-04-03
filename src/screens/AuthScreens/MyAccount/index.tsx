/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity, View, Text, StyleSheet, Linking} from 'react-native';
import * as Keychain from 'react-native-keychain';
import COLORS from '../../../config/COLORS';
import Header from '../../../components/Header';
import PageTitle from '../../../components/PageTitle';
import {ReducerType} from '../../../redux/reducers/reducers';
import {LOGOUT} from '../../../redux/const';
import Button from '../../../components/button';
import {RYMAN_PRIVACY_POLICY} from '../../../config/CONSTANTS';
import {get_profile} from '../../../redux/actions/auth.actions';
import {CustomerToken} from '../../../redux/reducers/authReducer';
import IconComponent from '../../../components/IconComponent';
import DeviceInfo from 'react-native-device-info';

interface Props {
  logout: () => Promise<void>;
  get_profile: (token: any) => Promise<any>;
  auth: ReducerType['auth'];
  context: any;
}

const MyAccount = (props: Props) => {
  const {navigate} = useNavigation();

  useEffect(() => {
    async function reloadProfile() {
      if (props.auth.token) {
        const profile = await props.get_profile(props.auth.token);

        // Customer not logged in, take to home
        if (!profile) {
          navigate('Home');
        }
      }
    }
    reloadProfile();
  }, [props.auth.token]);

  const onLogout = async () => {
    await Keychain.resetGenericPassword();
    props.logout();
    navigate('SignIn');
  };

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.white,
      }}>
      <Header backFalse />
      <PageTitle isTitle textKey="My Account" />

      <View style={{flex: 1, paddingHorizontal: 15, paddingBottom: 20}}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigate('PersonalDetails')}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{gap: 6}}>
              <Text style={styles.nameText}>
                {props.auth.profile?.firstname} {props.auth.profile?.lastname}
              </Text>
              <Text style={{fontSize: 16, color: COLORS.gray}}>
                {props.auth.profile?.email}
              </Text>
            </View>

            <IconComponent size={20} color={COLORS.gray} iconName="edit" />
          </TouchableOpacity>

          <Button
            color="grey"
            onPress={() => navigate('AddressBook')}
            label="Address Book"
          />

          <Button
            color="grey"
            onPress={() => navigate('MyOrders')}
            label="My Orders"
          />

          <Button color="grey" onPress={onLogout} label="Logout" />
        </View>

        <TouchableOpacity
          style={styles.privacyPolicy}
          onPress={() => Linking.openURL(RYMAN_PRIVACY_POLICY)}>
          <Text style={styles.privacyPolicyText}>Privacy Policy</Text>
        </TouchableOpacity>
        <View style={{alignItems: 'center', paddingBottom: 5}}>
          <Text style={{fontSize: 11, color: COLORS.grayDark}}>
            Version: {DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
          </Text>
        </View>
      </View>
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
  container: {
    flex: 1,
    gap: 20,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: COLORS.white,
  },
  deleteButtonText: {
    color: COLORS.red,
  },
  privacyPolicy: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyPolicyText: {
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.black,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.black,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    logout: () => dispatch({type: LOGOUT}),
    get_profile: (token: CustomerToken) => dispatch(get_profile(token)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    auth: state.auth,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyAccount);
