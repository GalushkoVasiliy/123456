import i18next from 'i18next';
// import {initReactI18next,reactI18nextModule} from 'react-i18next';

import en from './en.json';
import uk from './uk.json';

i18next
  // .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    resources: {
      en,
      uk,
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .catch(console.error);

export default i18next;
