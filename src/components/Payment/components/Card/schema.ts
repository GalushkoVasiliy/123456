import * as yup from 'yup';
import {POST_CODE_REGEX} from '../../../../config/CONSTANTS';

export const SCHEMA = yup.object().shape({
  firstName: yup.string().required('This field is required'),
  lastName: yup.string().required('This field is required'),
  address1: yup.string().required('This field is required'),
  address2: yup.string(),
  address3: yup.string(),
  city: yup.string().required('This field is required'),
  postcode: yup
    .string()
    .matches(
      POST_CODE_REGEX,
      'Provided Zip/Postal Code seems to be invalid. Example: AB12 3CD; A1B 2CD; AB1 2CD; AB1C 2DF; A12 3BC; A1 2BC.',
    )
    .required('This field is required'),
  company: yup.string(),
});
