import * as yup from 'yup';
import {POST_CODE_REGEX} from '../../../config/CONSTANTS';

const digitsOnly = (value: string) => !/^\d+$/.test(value);
const digitsAndSpacesOnly = (value: string) => /^(\d|\s|\+)+$/.test(value);
const noSpecialCharacters = (value: string) => /^(\d|\w|-)+$/.test(value);

export const SCHEMA = yup.object().shape({
  firstname: yup
    .string()
    .required('This field is required')
    .test('Digits only', 'This field cannot contain only numbers', digitsOnly)
    .min(2, 'Please enter more than one characters.')
    .test(
      'Special characters',
      'This field cannot contain any special characters apart from "-"',
      noSpecialCharacters,
    ),
  lastname: yup
    .string()
    .required('This field is required')
    .test('Digits only', 'This field cannot contain only numbers', digitsOnly)
    .min(2, 'Please enter more than one characters.')
    .test(
      'Special characters',
      'This field cannot contain any special characters apart from "-"',
      noSpecialCharacters,
    ),
  telephone: yup
    .string()
    .required('This field is required')
    .test(
      'Digits only',
      'This field can only contain numbers and spaces',
      digitsAndSpacesOnly,
    ),
  street: yup
    .array()
    .test(
      'Street Line 1',
      'This field is required',
      (value: any): boolean => value[0]?.length > 0,
    ),
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
