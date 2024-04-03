/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import {connect} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import WalletManager from 'react-native-wallet-manager';

import COLORS from '../../config/COLORS';
import {API} from '../../config/CONSTANTS';
import PageTitle from '../../components/PageTitle';
import {ReducerType} from '../../redux/reducers/reducers';
import {get_reward_balance} from '../../redux/actions/rewards.actions';
import Header from '../../components/Header';
import Button from '../../components/button';
import {get_profile} from '../../redux/actions/auth.actions';
import {CustomerToken} from '../../redux/reducers/authReducer';
import AddToGoogle from '../../assets/icons/AddToGoogle';

interface Props {
  logout: () => Promise<void>;
  login: () => Promise<void>;
  get_profile: (token: any) => Promise<any>;
  get_reward_balance: (token: any) => Promise<any>;
  auth: ReducerType['auth'];
  rewards: ReducerType['rewards'];
  context: any;
}

const Rewards = (props: Props) => {
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

  useEffect(() => {
    if (props.auth.token && props.auth.profile?.id) {
      props.get_reward_balance('RR-' + props.auth.profile.id);
    }
  }, [props.auth.token, props.auth.profile]);

  const addToWallet = async () => {
    try {
      const token = props.auth.profile?.custom_attributes.find(
        ({attribute_code}: any) => attribute_code === 'customer_club_token',
      );
      const appleUrl = `${API.url}/club-programme/card/applewalletpass/?customer-token=${token.value}`;
      const androidUrl = `${API.url}/club-programme/card/googlewalletpass/?customer-token=${token.value}`;
      const result = await WalletManager.addPassFromUrl(
        Platform.OS === 'android' ? androidUrl : appleUrl,
      );
      return result;
    } catch (e) {
      console.error(e);
    }
  };

  if (!props.auth.token) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 15,
          gap: 20,
        }}>
        <Text style={styles.centered}>
          You are not signed in to your account
        </Text>
        <Text style={[styles.centered, {fontWeight: '400'}]}>
          Please sign in to use Ryman Rewards
        </Text>
        <Button onPress={() => navigate('Account')} label="Sign-in" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.white,
      }}>
      <Header backFalse />
      <PageTitle isTitle textKey="Ryman Rewards" />
      <ScrollView>
        <Barcode value={'RR-' + props.auth.profile?.id} format="CODE128" />
        <Text style={styles.centered}>
          Customer No. RR-{props.auth.profile?.id}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.buttonWallet]} onPress={addToWallet}>
            {Platform.OS === 'ios' && (
              <Image
                source={{
                  uri: `${API.url}/static/frontend/Astound/tprg-ryman/en_GB/Astound_CustomerClubProgramme/images/apple_button.png`,
                }}
                style={styles.buttonImageIconStyle}
              />
            )}
            {Platform.OS === 'android' && <AddToGoogle />}
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Current Balance</Text>
        <Text style={styles.currentBalance}>{props.rewards.balance}</Text>
        <View style={styles.buttonContainer}>
          <Text style={[styles.label, {fontSize: 18}]}>
            Have a store receipt to add to your account?
          </Text>
          <Button
            style={{width: '100%'}}
            onPress={() => navigate('AddReceipt')}
            label="Add Now"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: 20,
    color: COLORS.black,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 8,
  },
  buttonWallet: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 4,
    margin: 15,
  },
  button: {
    width: '60%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 8,
    marginTop: 20,
    marginLeft: 10,
  },
  buttonAdd: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    backgroundColor: COLORS.black,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
    textAlign: 'center',
    lineHeight: 50,
  },
  buttonImageIconStyle: {
    height: Platform.OS === 'android' ? 50 : 67,
    width: Platform.OS === 'android' ? 250 : 200,
    resizeMode: 'stretch',
  },
  label: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 26,
    marginTop: 20,
    paddingHorizontal: 15,
    color: COLORS.black,
  },
  currentBalance: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: 60,
    marginTop: 10,
    marginBottom: 50,
    color: COLORS.black,
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    login: () => dispatch('LOGIN'),
    get_reward_balance: (id: string | number) =>
      dispatch(get_reward_balance(id)),
    get_profile: (token: CustomerToken) => dispatch(get_profile(token)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    auth: state.auth,
    rewards: state.rewards,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Rewards);
