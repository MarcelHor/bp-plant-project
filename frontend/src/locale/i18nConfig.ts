import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en/en.json';
import cs from './cs/cs.json';

const resources = {
    en: {
        translation: en,
    },
    cs: {
        translation: cs,
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'cs',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;

