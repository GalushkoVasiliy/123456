/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  ScrollView,
  Platform,
  TextInput,
} from 'react-native';
import Toast from 'react-native-toast-message';
import InputComponent from '../../components/InputComponent/InputComponent';
import {connect} from 'react-redux';

import COLORS from '../../config/COLORS';
import Header from '../../components/Header';
import PageTitle from '../../components/PageTitle';
import {add_receipt, IReceipt} from '../../redux/actions/rewards.actions';
import {ReducerType} from '../../redux/reducers/reducers';
import {CustomerToken} from '../../redux/reducers/authReducer';
import KeyboardAvoid from '../../components/KeyboardAvoid';

interface Props {
  addReceipt: (body: IReceipt, token: CustomerToken | null) => any;
  auth: ReducerType['auth'];
}

const AddReceipt = (props: Props) => {
  const [posId, setPosId] = useState<string>('');
  const [transId, setTransId] = useState<string>('');
  const [receiptTotal, setReceiptTotal] = useState<string>('');

  const transRef = React.createRef<TextInput>();
  const receiptRef = React.createRef<TextInput>();

  const addReceiptRequest = async () => {
    const res = await props.addReceipt(
      {
        posNum: posId,
        transId: transId,
        totalAmount: receiptTotal,
      },
      props.auth.token,
    );

    if (typeof res === 'object' && 'message' in res) {
      Toast.show({
        type: 'error',
        text1: res.message,
      });
      return;
    } else if (res === true) {
      Toast.show({
        type: 'success',
        text1:
          'Your receipt is being verified. Your purchase will show in your account once this is complete.',
      });
      setPosId('');
      setTransId('');
      setReceiptTotal('');
    }
  };

  return (
    <KeyboardAvoid keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 64}>
      <ScrollView
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          backgroundColor: COLORS.white,
        }}>
        <Header />
        <PageTitle isTitle textKey="Add a store receipt to your account" />
        <Text style={styles.label}>
          Add your store receipt details to the form below, within 30 days of
          your purchase, and click submit. We will verify your purchase and add
          the points to your account if they have not already been added.
        </Text>
        <View style={styles.mainContainer}>
          <InputComponent
            returnKeyType={'next'}
            onSubmitEditing={() => {
              transRef.current?.focus();
            }}
            label="POS ID"
            value={posId}
            onChangeText={text => setPosId(text)}
          />
          <InputComponent
            ref={transRef}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              receiptRef.current?.focus();
            }}
            label="Trans ID"
            value={transId}
            onChangeText={text => setTransId(text)}
          />
          <InputComponent
            ref={receiptRef}
            label="Receipt Total"
            value={receiptTotal}
            onChangeText={text => setReceiptTotal(text)}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={addReceiptRequest}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  mainContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    padding: 10,
  },
  label: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: 16,
    padding: 10,
    color: COLORS.black,
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
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    paddingBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapDispatchToProps = (dispatch: (value: any) => void) => {
  return {
    addReceipt: (body: IReceipt, token: CustomerToken | null) =>
      dispatch(add_receipt(token, body)),
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
)(React.memo(AddReceipt));
