import {
  ADD_COUPON,
  DELETE_COUPON,
  GET_COUPON,
  LOGOUT,
  SEND_SHIPPING_INFORMATION,
  SET_COUPON_UPDATING,
} from '../const';

interface Totals {
  grand_total: number;
  base_grand_total: number;
  subtotal: number;
  base_subtotal: number;
  discount_amount: number;
  base_discount_amount: number;
  subtotal_with_discount: number;
  base_subtotal_with_discount: number;
  shipping_amount: number;
  base_shipping_amount: number;
  shipping_discount_amount: number;
  base_shipping_discount_amount: number;
  tax_amount: number;
  base_tax_amount: number;
  weee_tax_applied_amount: null;
  shipping_tax_amount: number;
  base_shipping_tax_amount: number;
  subtotal_incl_tax: number;
  shipping_incl_tax: number;
  base_shipping_incl_tax: number;
  base_currency_code: string;
  quote_currency_code: string;
  items_qty: number;
  items: Item[];
  total_segments: TotalSegment[];
  extension_attributes: TotalsExtensionAttributes;
}

interface TotalsExtensionAttributes {
  reward_points_balance: number;
  reward_currency_amount: number;
  base_reward_currency_amount: number;
}

interface Item {
  item_id: number;
  price: number;
  base_price: number;
  qty: number;
  row_total: number;
  base_row_total: number;
  row_total_with_discount: number;
  tax_amount: number;
  base_tax_amount: number;
  tax_percent: number;
  discount_amount: number;
  base_discount_amount: number;
  discount_percent: number;
  price_incl_tax: number;
  base_price_incl_tax: number;
  row_total_incl_tax: number;
  base_row_total_incl_tax: number;
  options: string;
  weee_tax_applied_amount: null;
  weee_tax_applied: null;
  extension_attributes: ItemExtensionAttributes;
  name: string;
}

interface ItemExtensionAttributes {
  delivery_option_content: string;
}

interface TotalSegment {
  code: string;
  title: string;
  value: number | null;
  extension_attributes?: TotalSegmentExtensionAttributes;
  area?: string;
}

interface TotalSegmentExtensionAttributes {
  gw_item_ids?: any[];
  gw_price?: string;
  gw_base_price?: string;
  gw_items_price?: string;
  gw_items_base_price?: string;
  gw_card_price?: string;
  gw_card_base_price?: string;
  tax_grandtotal_details?: TaxGrandtotalDetail[];
}

interface TaxGrandtotalDetail {
  amount: number;
  rates: Rate[];
  group_id: number;
}

interface Rate {
  percent: string;
  title: string;
}

interface IPaymentMethods {
  code: string;
  title: string;
}

interface IShippingInformation {
  payment_methods: IPaymentMethods[];
  totals: Totals;
}

export interface CheckoutState {
  shippingInformation: IShippingInformation | null;
  coupon: string;
  isCouponUpdating: boolean;
}

const initialState: CheckoutState = {
  shippingInformation: null,
  coupon: '',
  isCouponUpdating: false,
};

const checkoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEND_SHIPPING_INFORMATION: {
      return {...state, shippingInformation: action.data};
    }
    case ADD_COUPON:
    case GET_COUPON: {
      return {...state, coupon: action.data};
    }
    case LOGOUT:
    case DELETE_COUPON: {
      return {...state, coupon: ''};
    }
    case SET_COUPON_UPDATING: {
      return {...state, isCouponUpdating: action.data};
    }
    default:
      return state;
  }
};

export default checkoutReducer;
