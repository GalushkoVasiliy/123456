import * as Keychain from 'react-native-keychain';

import {LOGOUT, TOKEN_EXPIRY} from '../redux/const';
import {CustomerToken} from '../redux/reducers/authReducer';
import {ILogin, login} from '../redux/actions/auth.actions';

/**
 * Check if token is expired and request a new one if needed.
 * Magento doesn't provide any mechanism to renew/refresh a new token so we need to re-log in the customer behind scenes
 *
 * @param CustomerToken token
 * @return string
 */
export const getValidCustomerToken =
  (token: CustomerToken | null) => async dispatch => {
    // Customer not logged in
    if (!token) {
      return;
    }
    // Customer logged in but token is expired, force a re-login
    if (token.expiry < new Date().getTime()) {
      // Clear state (logout customer)
      dispatch({type: LOGOUT});
      try {
        // Retreive the credentials and login again to get a valid token
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const loginData = await dispatch(
            login({
              username: credentials.username,
              password: credentials.password,
            }),
          );
          return loginData.token;
        } else {
          console.log('No credentials stored');
        }
      } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
      }
    }

    return token.token;
  };
