import React from 'react';

export enum DROPDOWN_PAGES {
  cart = 'cart',
  store = 'store',
  checkout = 'checkout',
}

export interface DropdownValues {
  page: DROPDOWN_PAGES;
  content?: any;
}

interface Props {
  toOpen: (values: DropdownValues) => void;
  toClose?: () => void;
}

export const DropDownContext = React.createContext<Props>({
  toOpen: values => values,
  toClose: () => {},
});
