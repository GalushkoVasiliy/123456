/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {ReducerType} from '../../redux/reducers/reducers';
import {connect, useSelector} from 'react-redux';
import {
  send_billing_address,
  IBillingAddress,
  IPaymentInformation,
  send_payment_information,
  DeliveryOptions,
} from '../../redux/actions/checkout.actions';
import {update_profile_addresses} from '../../redux/actions/customer.actions';

import {
  get_order,
  IChallengeResponse,
  worldpay_challenge,
  worldpay_restore_cart,
} from '../../redux/actions/orders.actions';
import Accordion from '../Accordion/Accordion';
import {DropDownContext} from '../../utils/dropdown-context';
import Toast from 'react-native-toast-message';
import {MODAL_NAMES, ModalContext} from '../../utils/modal-context';
import {PaymentComplete} from '@rnw-community/react-native-payments';
import PaymentMethod from './components/PaymentMethod';
import styles from './style';
import IconComponent from '../IconComponent';
import COLORS from '../../config/COLORS';
import useMobilePay from '../../hooks/useMobilePay';
import Promo from './components/Promo';
import analytics from '@react-native-firebase/analytics';
import CardFlow, {ICardForm} from './components/Card';
import CheckBox from '../CheckBox/CheckBox';
import Google from '../../assets/icons/Google';
import LoaderIcon from '../../assets/icons/loader';
import CustomButton from '../button';
import {SELECTED_STAGE} from '../../config/CONSTANTS';
import {removeIsGiftDisplayed} from '../../utils/giftDisplayControl';

interface Props {
  updateAddress: (body: any) => Promise<void>;
  billingAddress: (val: IBillingAddress) => Promise<void>;
  paymentInformation: (val: IPaymentInformation) => Promise<number>;
  getOrder: (val: number) => Promise<any>;
  worldpayChallenge: (val: number) => Promise<any>;
  worldpayRestoreCart: (val: number) => Promise<any>;
  auth: ReducerType['auth'];
  cart: ReducerType['cart'];
  context: any;
  isLoading: boolean;
  openModal?: () => void;
}

enum PaymentMethods {
  cash,
  applePay,
  free,
  card,
}

const Payment = (props: Props) => {
  const cartTotal = useSelector(
    (state: ReducerType) => state.cart.total?.grand_total,
  );
  const {toClose} = useContext(DropDownContext);
  const {onOpen} = useContext(ModalContext);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethods>(
      cartTotal > 0 ? PaymentMethods.applePay : PaymentMethods.free,
    );
  const [activeSections, setActiveSections] = useState<number[]>([]);
  const {createPaymentRequest, isWalletAvailable} = useMobilePay(true);

  const onClearGiftStorage = useCallback(() => {
    removeIsGiftDisplayed(props.cart.cart?.id as number);
  }, [props.cart.cart]);

  const isShowGiftButton =
    props.context.method === DeliveryOptions.deliver &&
    !!props.cart.cart?.extension_attributes?.gift_information?.gift_products
      .length &&
    !props.cart.cart?.extension_attributes?.gift_information
      ?.is_gift_product_already_added;

  const onClose = () => {
    if (toClose) {
      toClose();
    }
  };

  const onShowErrorCardPay = () => {
    onClose();
    onOpen(MODAL_NAMES.challenge_error, undefined);
  };

  const onRestoreCart = (orderId: number) => {
    props.worldpayRestoreCart(orderId);
  };

  const onOpenSuccess = (val: number) => {
    onOpen(MODAL_NAMES.success_checkout, {
      orderNumber: val,
      isStoreMethod: props.context.method === DeliveryOptions.store,
    });
    onClearGiftStorage();
  };

  const onCardPay = async (
    sessionHref: string,
    form: ICardForm,
    isSame: boolean,
  ) => {
    const billingAddress = {
      city: isSame ? props.context.form.city : form.city,
      company: isSame ? props.context.form.company : form.company,
      postcode: isSame ? props.context.form.postcode : form.postcode,
      firstname: isSame ? props.context.form.firstName : form.firstName,
      lastname: isSame ? props.context.form.lastName : form.lastName,
      telephone: props.context.form.phone,
      saveInAddressBook: null,
      region: '',
      countryId: 'GB',
      street: isSame
        ? props.context.form.street.filter((item: any) => item)
        : [form.address1, form.address2, form.address3].filter(
            (item: any) => item,
          ),
    };

    return props
      .paymentInformation({
        billingAddress: billingAddress,
        paymentMethod: {
          method: 'accessworldpay_creditcard',
          additional_data: {
            sessionHref,
          },
          extension_attributes: {
            extra_envelope: props.context.extraEnvelope,
          },
        },
        email: props.context.form.email,
      })
      .then((orderId: number) => {
        if (orderId) {
          props
            .worldpayChallenge(orderId)
            .then((challenge: IChallengeResponse) => {
              const finishOrder = () => {
                props.getOrder(orderId).then((order: any) => {
                  if (order) {
                    onClose();
                    onOpenSuccess(order.increment_id);
                  }
                });
              };

              if (challenge.outcome === 'challenged') {
                onOpen(MODAL_NAMES.challenge, {
                  url: challenge.url,
                  jwt: challenge.jwt,
                  orderId,
                  finishOrder,
                  onShowErrorCardPay,
                  onRestoreCart,
                });
              }

              if (challenge.outcome === 'authenticated') {
                finishOrder();
              }
            });
        }
      });
  };

  const onSendPaymentInformation = (method: PaymentMethods) => {
    const billingAddress = {
      city: props.context.form.city,
      company: props.context.form.company,
      postcode: props.context.form.postcode,
      firstname: props.context.form.firstName,
      lastname: props.context.form.lastName,
      telephone: props.context.form.phone,
      saveInAddressBook: null,
      region: '',
      countryId: 'GB',
      street: props.context.form.street
        ? props.context.form.street.filter((item: any) => item)
        : [],
    };
    return props
      .paymentInformation({
        billingAddress: billingAddress,
        paymentMethod: {
          method: PaymentMethods[method],
          extension_attributes: {
            extra_envelope: props.context.extraEnvelope,
          },
        },
        email: props.context.form.email,
      })
      .then((item: number) => {
        if (item) {
          props.getOrder(item).then((order: any) => {
            if (order) {
              onClose();
              onOpenSuccess(order.increment_id);
            }
          });
        }
      });
  };

  const onApplePayPayment = () => {
    if (isWalletAvailable) {
      setIsLoading(true);
      const paymentRequest = createPaymentRequest();
      paymentRequest
        .show()
        .then(paymentResponse => {
          const iosAdditional = {
            walletToken: JSON.stringify({
              version:
                paymentResponse.details.applePayToken.paymentData.version,
              signature:
                paymentResponse.details.applePayToken.paymentData.signature,
              header: {
                ephemeralPublicKey:
                  paymentResponse.details.applePayToken.paymentData.header
                    .ephemeralPublicKey,
                publicKeyHash:
                  paymentResponse.details.applePayToken.paymentData.header
                    .publicKeyHash,
                transactionId:
                  paymentResponse.details.applePayToken.paymentData.header
                    .transactionId,
              },
              data: paymentResponse.details.applePayToken.paymentData.data,
            }),
          };

          const androidAdditional = {
            walletToken: paymentResponse.details.androidPayToken.rawToken,
          };

          return props
            .paymentInformation({
              billingAddress: {
                city:
                  paymentResponse.details.billingAddress?.address2 ||
                  paymentResponse.details.billingAddress?.address1 ||
                  '',
                postcode:
                  paymentResponse.details.billingAddress?.postalCode ?? '',
                firstname: props.context.form.firstName,
                lastname: props.context.form.lastName,
                telephone: props.context.form.phone,
                countryId: 'GB',
                street: [
                  paymentResponse.details.billingAddress?.address1 ?? '',
                  paymentResponse.details.billingAddress?.address3 ?? '',
                ],
                saveInAddressBook: null,
                region: '',
              },
              paymentMethod: {
                method:
                  Platform.OS === 'android'
                    ? 'accessworldpay_googlepay'
                    : 'accessworldpay_applepay',
                additional_data:
                  Platform.OS === 'android' ? androidAdditional : iosAdditional,
                extension_attributes: {
                  extra_envelope: props.context.extraEnvelope,
                },
              },
              email: props.context.form.email,
            })
            .then(async (orderId: number) => {
              if (orderId) {
                return await props.getOrder(orderId).then(async order => {
                  return await paymentResponse
                    .complete(PaymentComplete.SUCCESS)
                    .then(() => {
                      return order;
                    });
                });
              }
            })
            .catch(() => {
              return paymentResponse.complete(PaymentComplete.FAIL);
            });
        })
        .then(order => {
          if (order) {
            setTimeout(() => {
              onClose();
              onOpenSuccess(order.increment_id);

              let orderItems = [];
              for (var i in order.items) {
                console.log("order item", i, order.items[i]);
                orderItems.push({
                  item_id: order.items[i].sku,
                  item_name: order.items[i].name,
                  quantity: order.items[i].qty_ordered,
                  price: order.items[i].price
                });
              }
              const purchase = {
                transaction_id: order.increment_id,
                currency: 'GBP',
                value: order.base_grand_total,
                tax: order.base_tax_amount,
                shipping: order.base_shipping_amount,
                items: orderItems
              };
              analytics().logPurchase(purchase);
            }, 2000);
          }
        })
        .catch(() => {
          paymentRequest.abort();
        })
        .finally(() => setIsLoading(false));
    } else {
      if (Platform.OS === 'ios') {
        Toast.show({
          type: 'error',
          text1: 'Apple pay not available',
        });
      }

      if (Platform.OS === 'android') {
        onOpen(MODAL_NAMES.wallet, undefined);
      }
    }
  };

  // const onCashPayment = () => {
  //   onSendPaymentInformation(PaymentMethods.cash);
  // };

  const onFreePayment = () => {
    onSendPaymentInformation(PaymentMethods.free);
  };

  return (
    <View>
      <View>
        <Accordion
          data={[
            {
              title: 'Add a Promotional Code',
              content: <Promo />,
            },
          ]}
          open={activeSections}
          onChange={val => setActiveSections(val)}
        />
      </View>

      {isShowGiftButton && (
        <CustomButton
          style={{marginTop: 12}}
          label="Additional Gift Ideas"
          onPress={props.openModal}
        />
      )}
      <View>
        <Text style={styles.subTitle}>Payment Options</Text>
        {/*{SELECTED_STAGE !== 'production' && cartTotal > 0 && (*/}
        {/*  <PaymentMethod*/}
        {/*    onSelectMethod={() => setSelectedPaymentMethod(PaymentMethods.cash)}*/}
        {/*    isSelected={selectedPaymentMethod === PaymentMethods.cash}*/}
        {/*    onPay={onCashPayment}*/}
        {/*    title="Cash"*/}
        {/*  />*/}
        {/*)}*/}
        {cartTotal === 0 && (
          <PaymentMethod
            onSelectMethod={() => setSelectedPaymentMethod(PaymentMethods.free)}
            isSelected={selectedPaymentMethod === PaymentMethods.free}
            onPay={onFreePayment}
            title="Free (Paid with Points)"
            isLoading={props.isLoading}
          />
        )}
        {cartTotal > 0 && (
          <PaymentMethod
            onSelectMethod={() =>
              setSelectedPaymentMethod(PaymentMethods.applePay)
            }
            isSelected={selectedPaymentMethod === PaymentMethods.applePay}
            onPay={onApplePayPayment}
            title={Platform.OS === 'android' ? 'Google Pay' : 'Apple Pay'}
            isLoading={props.isLoading || isLoading}
            payBtnStyle={{width: 160}}
            {...(Platform.OS === 'android'
              ? {
                  payBtn: (
                    <TouchableOpacity
                      onPress={onApplePayPayment}
                      disabled={props.isLoading || isLoading}
                      style={{
                        backgroundColor: COLORS.black,
                        width: 160,
                        height: 40,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 4,
                      }}>
                      {props.isLoading || isLoading ? (
                        <LoaderIcon color={COLORS.white} />
                      ) : (
                        <Google />
                      )}
                    </TouchableOpacity>
                  ),
                }
              : {
                  payBtnLabel: (
                    <>
                      Buy with{' '}
                      <IconComponent
                        iconName="apple"
                        size={16}
                        color={COLORS.white}
                      />
                      Pay
                    </>
                  ),
                })}
          />
        )}
      </View>

      {cartTotal > 0 && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setSelectedPaymentMethod(PaymentMethods.card)}
          style={[
            styles.container,
            selectedPaymentMethod === PaymentMethods.card &&
              styles.containerSelected,
          ]}>
          <View style={styles.paymentRow}>
            <CheckBox checked={selectedPaymentMethod === PaymentMethods.card} />

            <Text style={{color: COLORS.black}}>Credit Card</Text>
          </View>

          {selectedPaymentMethod === PaymentMethods.card && (
            <View style={{width: '100%'}}>
              <CardFlow onSubmit={onCardPay} method={props.context.method} />
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* {isWalletAvailable ? (
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => {
              // handlePay();
              // isDefined(response) && onSendInformation();
              // onSendInformation()
            }}>
            <Text style={styles.checkoutLabel}>Continue to Payment</Text>
          </TouchableOpacity>
        ) : (
          <Text>Unfortunately Apple/Google pay is not available</Text>
        )} */}
    </View>
  );
};

const mapDispatchToProps = (dispatch: (value: any) => any) => {
  return {
    updateAddress: (body: any) =>
      dispatch(update_profile_addresses(body.id, body)),
    billingAddress: (val: IBillingAddress) =>
      dispatch(send_billing_address(val)),
    paymentInformation: (val: IPaymentInformation) =>
      dispatch(send_payment_information(val)),
    getOrder: (orderId: number) => dispatch(get_order(orderId)),
    worldpayChallenge: (orderId: number) =>
      dispatch(worldpay_challenge(orderId)),
    worldpayRestoreCart: (orderId: number) =>
      dispatch(worldpay_restore_cart(orderId)),
  };
};

const mapStateToProps = (state: ReducerType) => {
  return {
    auth: state.auth,
    cart: state.cart,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(React.memo(Payment));
