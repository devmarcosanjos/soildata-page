import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

export const SUPPORTED_LANGUAGES = ['pt', 'en', 'es'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function useI18n() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = (lang: SupportedLanguage) => {
    i18n.changeLanguage(lang);
    
    // Atualizar a URL mantendo o caminho atual
    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(pt|en|es)/, '') || '/';
    const newPath = `/${lang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
    
    navigate(newPath, { replace: true });
  };

  const getCurrentLanguage = (): SupportedLanguage => {
    const lang = i18n.language.split('-')[0] as SupportedLanguage;
    return SUPPORTED_LANGUAGES.includes(lang) ? lang : 'pt';
  };

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: getCurrentLanguage(),
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}

