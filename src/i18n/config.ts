import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptCommon from './locales/pt/common.json';
import ptNavigation from './locales/pt/navigation.json';
import ptHome from './locales/pt/home.json';
import ptAbout from './locales/pt/about.json';
import ptProject from './locales/pt/project.json';
import ptData from './locales/pt/data.json';
import ptMethods from './locales/pt/methods.json';
import ptPlatform from './locales/pt/platform.json';
import ptFaq from './locales/pt/faq.json';
import ptContact from './locales/pt/contact.json';
import ptFooter from './locales/pt/footer.json';

import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enHome from './locales/en/home.json';
import enAbout from './locales/en/about.json';
import enProject from './locales/en/project.json';
import enData from './locales/en/data.json';
import enMethods from './locales/en/methods.json';
import enPlatform from './locales/en/platform.json';
import enFaq from './locales/en/faq.json';
import enContact from './locales/en/contact.json';
import enFooter from './locales/en/footer.json';

import esCommon from './locales/es/common.json';
import esNavigation from './locales/es/navigation.json';
import esHome from './locales/es/home.json';
import esAbout from './locales/es/about.json';
import esProject from './locales/es/project.json';
import esData from './locales/es/data.json';
import esMethods from './locales/es/methods.json';
import esPlatform from './locales/es/platform.json';
import esFaq from './locales/es/faq.json';
import esContact from './locales/es/contact.json';
import esFooter from './locales/es/footer.json';

const resources = {
  pt: {
    common: ptCommon,
    navigation: ptNavigation,
    home: ptHome,
    about: ptAbout,
    project: ptProject,
    data: ptData,
    methods: ptMethods,
    platform: ptPlatform,
    faq: ptFaq,
    contact: ptContact,
    footer: ptFooter,
  },
  en: {
    common: enCommon,
    navigation: enNavigation,
    home: enHome,
    about: enAbout,
    project: enProject,
    data: enData,
    methods: enMethods,
    platform: enPlatform,
    faq: enFaq,
    contact: enContact,
    footer: enFooter,
  },
  es: {
    common: esCommon,
    navigation: esNavigation,
    home: esHome,
    about: esAbout,
    project: esProject,
    data: esData,
    methods: esMethods,
    platform: esPlatform,
    faq: esFaq,
    contact: esContact,
    footer: esFooter,
  },
};

// Detectar idioma da URL na inicialização
const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    if (['pt', 'en', 'es'].includes(firstSegment)) {
      return firstSegment;
    }
    // Se não tem idioma na URL, verificar localStorage
    const storedLang = localStorage.getItem('i18nextLng');
    if (storedLang) {
      const lang = storedLang.split('-')[0];
      if (['pt', 'en', 'es'].includes(lang)) {
        return lang;
      }
    }
  }
  return 'pt';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'pt',
    defaultNS: 'common',
    ns: [
      'common',
      'navigation',
      'home',
      'about',
      'project',
      'data',
      'methods',
      'platform',
      'faq',
      'contact',
      'footer',
    ],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: [],
      checkWhitelist: true,
    },
    supportedLngs: ['pt', 'en', 'es'],
    load: 'languageOnly',
  });

export default i18n;

