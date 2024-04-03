import * as yup from 'yup';
import {EMAIL_REGEX} from '../../../../config/CONSTANTS';

interface SignInProps {
  theme: 'black' | 'white';
  email: string;
  password: string;
  remember: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setRemember: (remember: boolean) => void;
  login: (value: Login) => void;
  loginFaceBook: () => void;
  loginGoogle: () => void;
}

type Login = {
  email: string;
  password: string;
  timezone: string | number;
};

interface SignInData {
  email: string;
  password: string;
  timezone: string | number;
}

interface InputProps {
  email: string;
  password: string;
  theme: 'white' | 'black';
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
}

type Email = {
  email?: string;
  password?: string;
};

const SCHEMA = yup.object().shape({
  email: yup
    .string()
    .matches(
      EMAIL_REGEX,
      'Please enter a valid email address (Ex: john@domain.com).',
    )
    .required('This is a required field.'),
});

export {SCHEMA};

export type {SignInProps, SignInData, InputProps, Email};
