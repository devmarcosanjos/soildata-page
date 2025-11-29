import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

export const SUPPORTED_LANGUAGES = ['pt', 'en', 'es'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function useI18n() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = async (lang: SupportedLanguage) => {
    // Aguardar a atualização do i18n antes de navegar
    await i18n.changeLanguage(lang);
    
    // Atualizar a URL mantendo o caminho atual
    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(pt|en|es)/, '') || '/';
    const newPath = `/${lang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
    
    navigate(newPath, { replace: true });
  };

  const getCurrentLanguage = (): SupportedLanguage => {
    // Priorizar o idioma da URL, que é a fonte da verdade
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    
    if (SUPPORTED_LANGUAGES.includes(firstSegment as any)) {
      return firstSegment as SupportedLanguage;
    }
    
    // Fallback para i18n.language se não houver idioma na URL
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

