/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {connect} from 'react-redux';

import COLORS from '../../../config/COLORS';
import Header from '../../../components/Header';
import PageTitle from '../../../components/PageTitle';
import {
  IDeleteRequest,
  myclub_delete,
} from '../../../redux/actions/customer.actions';
import {ReducerType} from '../../../redux/reducers/reducers';
import Button from '../../../components/button';

interface Props {
  myclub_delete: (body: IDeleteRequest) => Promise<any>;
  auth: ReducerType['auth'];
}

const DeleteMyAccount = (props: Props) => {
  const {navigate} = useNavigation();
  const [confirmation, showConfirmation] = useState<boolean>();

  const deleteMyAccountRequest = async () => {
    let customer = props.auth.profile;
    const res = await props.myclub_delete({
      store_code: 'ryman_uk_main_en_gb',
      first_name: customer.firstname,
      last_name: customer.lastname,
      email_address: customer.email,
      type: 'erasure',
      source: 'customer',
      status: 'new',
    });

    if (typeof res === 'object' && 'message' in res) {
      Toast.show({
        type: 'error',
        text1: res.message,
        visibilityTime: 2000,
      });
      return;
    } else {
      showConfirmation(true);
    }
  };

  const renderContent = function () {
    if (confirmation) {
      return (
        <>
          <Text style={styles.title}>Your submission has been received</Text>
          <Text style={styles.confirmation}>
            Thank you for your submission.
          </Text>
          <Text style={styles.confirmation}>
            We will send you a confirmation email to validate your information
            and start processing your request by clicking on the link.
          </Text>
          <Text style={styles.confirmation}>
            Don't forget to check your spam folder in case the email has
            appeared there.
          </Text>
        </>
      );
    }

    if (props.auth.deleteRequested) {
      return (
        <>
          <Text style={styles.title}>Your submission has been received</Text>
          <Text style={styles.confirmation}>
            Thank you for your submission. We will get started and keep you
            updated.
          </Text>
        </>
      );
    }

    return (
      <>
        <Button
          style={{marginTop: 10}}
          onPress={() => navigate('MyAccount')}
          label="No, take me back!"
        />
        <Button
          style={{marginTop: 10}}
          onPress={deleteMyAccountRequest}
          label="Yes, delete my account"
        />
      </>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: COLORS.white,
      }}>
      <Header />
      <ScrollView>
        <PageTitle isTitle textKey="Delete My Account" />
        <View style={styles.mainContainer}>
          {!props.auth.deleteRequested && !confirmation && (
            <>
              <Text style={styles.title}>Are you sure?</Text>
              <Text style={styles.paragraph}>
                If you delete your account you will no longer have access to all
                the great benefits of being a Ryman Rewards member like earning
                points every time you shop.
              </Text>
              <Text style={styles.paragraph}>
                You will also no longer have access to your My Account area
                where you can review your order history and manage your
                preferences.
              </Text>
              <Text style={styles.paragraph}>
                Any remaining points balance will also be lost.
              </Text>
            </>
          )}

          {renderContent()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 30,
    flex: 1,
    gap: 15,
  },
  confirmation: {
    fontSize: 20,
    marginLeft: 20,
    color: COLORS.black,
  },
  paragraph: {
    fontSize: 20,
    color: COLORS.black,
  },
  title: {
    color: COLORS.black,
    fontSize: 20,
    fontWeight: '800',
  },
});

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    myclub_delete: (body: IDeleteRequest) => dispatch(myclub_delete(body)),
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
)(React.memo(DeleteMyAccount));
