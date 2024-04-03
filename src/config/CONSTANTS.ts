import Config from 'react-native-ultimate-config';

const HIT_SLOP = {
  left: 10,
  top: 10,
  right: 10,
  bottom: 10,
};

enum STAGE {
  stage1 = 'stage1',
  stage2 = 'stage2',
  production = 'production',
}

const GOOGLE_KEY = Config.GOOGLE_KEY;
const NEWRELIC_IOS_TOKEN = Config.NEWRELIC_IOS_TOKEN;
const NEWRELIC_ANDROID_TOKEN = Config.NEWRELIC_ANDROID_TOKEN;
const HERO_CATEGORY_ID = Config.HERO_CATEGORY_ID;
export const STORE_GIFTS_CATEGORY_ID = Config.STORE_GIFTS_CATEGORY_ID;
export const HOME_GIFTS_CATEGORY_ID = Config.HOME_GIFTS_CATEGORY_ID;

const SELECTED_STAGE = ['stage1', 'stage2', 'production'].includes(
  Config.SELECTED_STAGE as string,
)
  ? (Config.SELECTED_STAGE as STAGE)
  : STAGE.stage1;

const API = {
  url: Config.API_BASE_URL,
  token: Config.MAGENTO_TOKEN,
  imageMock: Config.IMAGE_MOCK_URL,
  applePayId: Config.APPLE_PAY_ID,
  googlePayId: Config.GOOGLE_PAY_ID,
  googlePayGateway: Config.GOOGLE_PAY_GATEWAY,
  cardPayId: Config.CARD_PAYMENT_MERCHANT_ID,
  cardPayUrl: Config.CARD_PAYMENT_URL,
};

const MOCK_SUB_CATEGORIES = {
  [STAGE.stage1]: [
    {
      id: 5174,
      parent_id: 10,
      name: 'Birthday',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/Category_Birthdays.jpg'),
    },
    {
      id: 5144,
      parent_id: 7,
      name: 'Occasions',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/occasions.jpg'),
    },
    // {
    //   id: 5261,
    //   parent_id: 10,
    //   name: 'Holidays',
    //   is_active: true,
    //   position: 2,
    //   level: 2,
    //   product_count: 7345,
    //   children_data: [],
    //   src: require('../assets/images/holidays.jpg'),
    // },
    {
      id: 5153,
      parent_id: 10,
      name: 'Sentiments',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/sentiments.jpg'),
    },
    {
      id: 5264,
      parent_id: 10,
      name: 'Life Events',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/life-events.jpg'),
    },
  ],
  [STAGE.stage2]: [
    {
      id: 5174,
      parent_id: 10,
      name: 'Birthday',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/Category_Birthdays.jpg'),
    },
    {
      id: 5144,
      parent_id: 7,
      name: 'Occasions',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/occasions.jpg'),
    },
    // {
    //   id: 5261,
    //   parent_id: 10,
    //   name: 'Holidays',
    //   is_active: true,
    //   position: 2,
    //   level: 2,
    //   product_count: 7345,
    //   children_data: [],
    //   src: require('../assets/images/holidays.jpg'),
    // },
    {
      id: 5153,
      parent_id: 10,
      name: 'Sentiments',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/sentiments.jpg'),
    },
    {
      id: 5264,
      parent_id: 10,
      name: 'Life Events',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/life-events.jpg'),
    },
  ],
  [STAGE.production]: [
    {
      id: 8449,
      parent_id: 10,
      name: 'Birthday',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/Category_Birthdays.jpg'),
    },
    {
      id: 8434,
      parent_id: 7,
      name: 'Occasions',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/occasions.jpg'),
    },
    // {
    //   id: 8826,
    //   parent_id: 10,
    //   name: 'Holidays',
    //   is_active: true,
    //   position: 2,
    //   level: 2,
    //   product_count: 7345,
    //   children_data: [],
    //   src: require('../assets/images/holidays.jpg'),
    // },
    {
      id: 8443,
      parent_id: 10,
      name: 'Sentiments',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/sentiments.jpg'),
    },
    {
      id: 8853,
      parent_id: 10,
      name: 'Life Events',
      is_active: true,
      position: 2,
      level: 2,
      product_count: 7345,
      children_data: [],
      src: require('../assets/images/life-events.jpg'),
    },
  ],
};

const MOCK_CATEGORIES = [
  {
    name: 'Greeting Cards',
    route: 'GreetingCards',
    src: require('../assets/images/GreetingCards.jpg'),
  },
  {
    name: 'Store Finder',
    route: 'StoreFinder',
    src: require('../assets/images/StoreFinder.jpg'),
  },
  // {
  //   name: 'Ryman Print Services',
  //   route: 'RymanPrintServices',
  //   src: require('../assets/images/PrintServices.jpg'),
  // },
  {
    name: 'Ryman Rewards',
    route: 'RymanRewards',
    src: require('../assets/images/RymanRewards.jpg'),
  },
];

const CATEGORY_ID = {
  [STAGE.stage1]: '5141',
  [STAGE.stage2]: '5141',
  [STAGE.production]: '8428',
};

const PER_PAGE = 24;

const RYMAN_PRIVACY_POLICY = 'https://www.ryman.co.uk/privacy-policy';

const NAME_REGEX = /^(?=.*[a-zA-Z])[a-zA-Z\d-]+$/;

const PHONE_REGEX = /^\+?[0-9\s-]{8,}$/;

const POST_CODE_REGEX =
  /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,е2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/;

const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export {
  HIT_SLOP,
  API,
  SELECTED_STAGE,
  MOCK_CATEGORIES,
  MOCK_SUB_CATEGORIES,
  CATEGORY_ID,
  PER_PAGE,
  RYMAN_PRIVACY_POLICY,
  GOOGLE_KEY,
  NEWRELIC_IOS_TOKEN,
  NEWRELIC_ANDROID_TOKEN,
  PHONE_REGEX,
  EMAIL_REGEX,
  NAME_REGEX,
  POST_CODE_REGEX,
  HERO_CATEGORY_ID,
};
