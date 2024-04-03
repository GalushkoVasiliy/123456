import * as yup from 'yup';
import {
  EMAIL_REGEX,
  NAME_REGEX,
  PHONE_REGEX,
} from '../../../../config/CONSTANTS';

export const SCHEMA = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .matches(NAME_REGEX, 'Invalid format')
    .min(2, 'Please enter more or equal than 2 symbols')
    .required('This field is required'),
  lastName: yup
    .string()
    .trim()
    .matches(NAME_REGEX, 'Invalid format')
    .min(2, 'Please enter more or equal than 2 symbols')
    .required('This field is required'),
  phone: yup
    .string()
    .trim()
    .matches(PHONE_REGEX, 'Invalid phone number')
    .required('This field is required'),
  email: yup
    .string()
    .trim()
    .matches(
      EMAIL_REGEX,
      'Please enter a valid email address (Ex: john@domain.com).',
    )
    .required('This field is required'),
});
