import * as yup from 'yup';
import {IRegister} from '../../../../redux/actions/auth.actions';
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  POST_CODE_REGEX,
} from '../../../../config/CONSTANTS';

export interface Props {
  register: (body: IRegister) => Promise<any>;
}

export interface SignUpState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  postcode: string;
  company: string;
  password: string;
  confirmPassword: string;
}

export const initialState: SignUpState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address1: '',
  address2: '',
  address3: '',
  city: '',
  postcode: '',
  company: '',
  password: '',
  confirmPassword: '',
};

export const initialTestState: SignUpState = {
  firstName: 'Jane',
  lastName: 'Does',
  email: 'test+7@rymanapp.com',
  phone: '512-555-1111',
  address1: '123 Oak Ave',
  address2: '',
  address3: '',
  city: 'Purchase',
  postcode: '10755',
  company: '',
  password: 'Password1s',
  confirmPassword: 'Password1s',
};

// min 6 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.
const passwordRules =
  /^(?:(?=.*[A-Z])(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z\d])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]))[A-Za-z\d!@#$%^&*()_+{}|<>?]+$/;

export const SCHEMA = yup.object().shape({
  firstName: yup.string().trim().required('This field is required'),
  lastName: yup.string().trim().required('This field is required'),
  phone: yup
    .string()
    .trim()
    .matches(PHONE_REGEX, 'Invalid phone number')
    .required('This field is required'),
  address1: yup.string().trim().required('This field is required'),
  address2: yup.string(),
  address3: yup.string(),
  city: yup.string().trim().required('This field is required'),
  postcode: yup
    .string()
    .trim()
    .matches(
      POST_CODE_REGEX,
      'Provided Zip/Postal Code seems to be invalid. Example: AB12 3CD; A1B 2CD; AB1 2CD; AB1C 2DF; A12 3BC; A1 2BC.',
    )
    .required('This field is required'),
  company: yup.string(),
  email: yup
    .string()
    .matches(
      EMAIL_REGEX,
      'Please enter a valid email address (Ex: john@domain.com).',
    )
    .required('This field is required'),
  password: yup
    .string()
    .trim()
    .matches(
      passwordRules,
      'Minimum of different classes of characters is 3: Lower Case, Upper Case, Digits, Special Characters.',
    )
    .min(
      8,
      'Minimum length of this field must be equal or greater than 8 symbols. Leading and trailing spaces are ignored.',
    )
    .required('This field is required'),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref('password')], 'Passwords don’t match')
    .required('This field is required'),
});
