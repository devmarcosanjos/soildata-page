import 'react-i18next';

import common from './locales/pt/common.json';
import navigation from './locales/pt/navigation.json';
import home from './locales/pt/home.json';
import about from './locales/pt/about.json';
import project from './locales/pt/project.json';
import data from './locales/pt/data.json';
import methods from './locales/pt/methods.json';
import platform from './locales/pt/platform.json';
import faq from './locales/pt/faq.json';
import contact from './locales/pt/contact.json';
import footer from './locales/pt/footer.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      navigation: typeof navigation;
      home: typeof home;
      about: typeof about;
      project: typeof project;
      data: typeof data;
      methods: typeof methods;
      platform: typeof platform;
      faq: typeof faq;
      contact: typeof contact;
      footer: typeof footer;
    };
  }
}

