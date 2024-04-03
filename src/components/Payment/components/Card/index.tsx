import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {
  AccessCheckout,
  Brand,
  CARD,
  CardDetails,
  CardValidationConfig,
  CardValidationEventListener,
  Sessions,
  useCardValidation,
} from '@worldpay/access-worldpay-checkout-react-native-sdk';
import Spinner from './components/Spinner';
import CardBrandImage from './components/CardBrandImage';
import VView from './components/VView';
import HView from './components/HView';
import PanField from './components/PanField';
import ExpiryDateField from './components/ExpiryDateField';
import CvcField from './components/CvcField';
import COLORS from '../../../../config/COLORS';
import CustomButton from '../../../button';
import {DeliveryOptions} from '../../../../redux/actions/checkout.actions';
import CheckBox from '../../../CheckBox/CheckBox';
import InputComponent from '../../../InputComponent/InputComponent';
import Accordion from '../../../Accordion/Accordion';
import AutoComplete from '../../../AutoComplete';
import {SCHEMA} from './schema';
import {API} from '../../../../config/CONSTANTS';

const unknownBrandLogo =
  'https://npe.access.worldpay.com/access-checkout/assets/unknown.png';

interface IProps {
  onSubmit: (val: string, form: ICardForm, isSame: boolean) => Promise<any>;
  method: DeliveryOptions;
}

export interface ICardForm {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  postcode: string;
  company: string;
}

const initialForm: ICardForm = {
  address1: '',
  address2: '',
  address3: '',
  city: '',
  postcode: '',
  firstName: '',
  lastName: '',
  company: '',
};

export default function CardFlow({onSubmit, method}: IProps) {
  const [pan, setPan] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');
  const [brandLogo, setBrandLogo] = useState<string>(unknownBrandLogo);
  const [panIsValid, setPanIsValid] = useState<boolean>(false);
  const [expiryIsValid, setExpiryIsValid] = useState<boolean>(false);
  const [cvcIsValid, setCvcIsValid] = useState<boolean>(false);
  const [submitBtnEnabled, setSubmitBtnEnabled] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(true);

  const isDeliveryMethod = method === DeliveryOptions.deliver;
  const [isSameAsDeliver, setIsSameAsDeliver] = useState(isDeliveryMethod);
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const [form, setForm] = useState<ICardForm>(initialForm);
  const [error, setError] = useState<Partial<ICardForm>>({});

  const inputs = {
    firstName: React.createRef<TextInput>(),
    lastName: React.createRef<TextInput>(),
    address1: React.createRef<TextInput>(),
    address2: React.createRef<TextInput>(),
    address3: React.createRef<TextInput>(),
    city: React.createRef<TextInput>(),
    postcode: React.createRef<TextInput>(),
    company: React.createRef<TextInput>(),
  };

  const focusTheField = (id: keyof typeof inputs) => {
    inputs[id].current?.focus();
  };

  const accessCheckout = new AccessCheckout({
    baseUrl: API.cardPayUrl,
    merchantId: API.cardPayId,
  });

  const validationEventListener: CardValidationEventListener = {
    onCardBrandChanged(brand?: Brand): void {
      if (!brand) {
        setBrandLogo(unknownBrandLogo);
        return;
      }

      for (const image of brand.images) {
        if (image.type === 'image/png') {
          setBrandLogo(image.url);
        }
      }
    },

    onPanValidChanged(isValid: boolean): void {
      setPanIsValid(isValid);
      if (!isValid) {
        setSubmitBtnEnabled(false);
      }
    },

    onExpiryDateValidChanged(isValid: boolean): void {
      setExpiryIsValid(isValid);
      if (!isValid) {
        setSubmitBtnEnabled(false);
      }
    },

    onCvcValidChanged(isValid: boolean): void {
      setCvcIsValid(isValid);
      if (!isValid) {
        setSubmitBtnEnabled(false);
      }
    },

    onValidationSuccess() {
      setSubmitBtnEnabled(true);
    },
  };

  const validationConfig = new CardValidationConfig({
    panId: 'panInput',
    expiryDateId: 'expiryDateInput',
    cvcId: 'cvcInput',
    enablePanFormatting: true,
  });

  const {initialiseCardValidation} = useCardValidation(
    accessCheckout,
    validationConfig,
    validationEventListener,
  );

  const onLayout = () => {
    initialiseCardValidation()
      .then(() => {
        console.info('Card Validation successfully initialised');
      })
      .catch(error => {
        console.error('Error', `${error}`, [{text: 'OK'}]);
      });
  };

  function generateSession() {
    const sessionTypes: Array<string> = [CARD];

    setShowSpinner(true);
    setIsEditable(false);
    setSubmitBtnEnabled(false);

    const cardDetails: CardDetails = {
      pan,
      expiryDate,
      cvc,
    };

    accessCheckout
      .generateSessions(cardDetails, sessionTypes)
      .then(async (sessions: Sessions) => {
        const card = sessions.card as string;
        await onSubmit(card, form, isSameAsDeliver);
      })
      .catch(reason => {
        console.error('Error', `${reason}`, [{text: 'OK'}]);
      })
      .finally(() => {
        setShowSpinner(false);
        setSubmitBtnEnabled(true);
        setIsEditable(true);
      });
  }

  const onChange = (key: keyof ICardForm) => (text: string) => {
    setForm(prev => ({
      ...prev,
      [key]: text,
    }));
  };

  const onBlur = (key: keyof ICardForm) => () => {
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

  const getInputProps = (key: keyof ICardForm) => ({
    nativeID: key,
    value: form[key],
    onChangeText: onChange(key),
    onBlur: onBlur(key),
    ...(!!error &&
      error[key] && {
        isError: !!error[key],
        error: error[key],
      }),
  });

  return (
    <View style={{gap: 12}}>
      <VView style={styles.cardFlow} onLayout={onLayout}>
        {/*<Spinner testID="spinner" show={showSpinner} />*/}
        <HView>
          <PanField
            testID="panInput"
            isValid={panIsValid}
            onChange={setPan}
            isEditable={isEditable}
          />
          <CardBrandImage testID="cardBrandImage" logo={brandLogo} />
        </HView>
        <HView>
          <ExpiryDateField
            testID="expiryDateInput"
            isValid={expiryIsValid}
            onChange={setExpiryDate}
            isEditable={isEditable}
          />
          <CvcField
            testID="cvcInput"
            isValid={cvcIsValid}
            onChange={setCvc}
            isEditable={isEditable}
          />
        </HView>
      </VView>

      {isDeliveryMethod && (
        <CheckBox
          checked={isSameAsDeliver}
          onPress={() => setIsSameAsDeliver(!isSameAsDeliver)}
          rightLabel="Same as Delivery Address"
          type="checkbox"
        />
      )}

      {!isSameAsDeliver && (
        <View style={{marginBottom: 0}}>
          <InputComponent
            ref={inputs.firstName}
            returnKeyType={'next'}
            onSubmitEditing={() => {
              focusTheField('lastName');
            }}
            label={
              <Text>
                First Name <Text style={styles.required}>*</Text>
              </Text>
            }
            {...getInputProps('firstName')}
          />
          <InputComponent
            ref={inputs.lastName}
            returnKeyType={'next'}
            label={
              <Text>
                Last Name <Text style={styles.required}>*</Text>
              </Text>
            }
            {...getInputProps('lastName')}
          />

          <AutoComplete
            label="Quick Address Finder"
            style={{marginBottom: 16}}
            onPress={e => {
              const newAddress = {
                address1: e.addressLine1,
                address2: e.addressLine2,
                address3: e.addressLine3,
                city: e.locality,
                postcode: e.postalCode,
                // countryId: address.countryId, countryId should be GB always
              };
              setForm(prev => ({
                ...prev,
                ...newAddress,
              }));
            }}
          />

          <Accordion
            data={[
              {
                title: 'Enter Address Manually',
                content: (
                  <>
                    <InputComponent
                      ref={inputs.address1}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {
                        focusTheField('address2');
                      }}
                      label={
                        <Text>
                          Address Line 1 <Text style={styles.required}>*</Text>
                        </Text>
                      }
                      {...getInputProps('address1')}
                    />

                    <InputComponent
                      ref={inputs.address2}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {
                        focusTheField('address3');
                      }}
                      label="Address Line 2 (optional)"
                      {...getInputProps('address2')}
                    />

                    <InputComponent
                      ref={inputs.address3}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {
                        focusTheField('city');
                      }}
                      label="Address Line 3 (optional)"
                      {...getInputProps('address3')}
                    />

                    <InputComponent
                      ref={inputs.city}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {
                        focusTheField('postcode');
                      }}
                      label={
                        <Text>
                          City <Text style={styles.required}>*</Text>
                        </Text>
                      }
                      {...getInputProps('city')}
                    />

                    <InputComponent
                      ref={inputs.postcode}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {
                        focusTheField('company');
                      }}
                      label={
                        <Text>
                          Postcode <Text style={styles.required}>*</Text>
                        </Text>
                      }
                      {...getInputProps('postcode')}
                    />

                    <InputComponent
                      ref={inputs.company}
                      returnKeyType={'next'}
                      label="Company (optional)"
                      {...getInputProps('company')}
                    />
                  </>
                ),
              },
            ]}
            open={activeSections}
            onChange={val => setActiveSections(val)}
          />
        </View>
      )}

      <VView>
        <CustomButton
          label="Submit"
          testID="submitButton"
          onPress={generateSession}
          disabled={!submitBtnEnabled}
          isLoading={showSpinner}
        />
      </VView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardFlow: {
    gap: 16,
  },
  required: {
    color: COLORS.red,
  },
});
