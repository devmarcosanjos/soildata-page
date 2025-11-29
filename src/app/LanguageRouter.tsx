import { useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appRoutes } from './routes';
import { SUPPORTED_LANGUAGES } from '@/shared/hooks/useI18n';

export function LanguageRouter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];

    // Se a rota não começa com um idioma suportado, redirecionar para /pt/...
    if (!SUPPORTED_LANGUAGES.includes(firstSegment as any)) {
      const currentPath = location.pathname === '/' ? '' : location.pathname;
      const detectedLang = i18n.language.split('-')[0] || 'pt';
      const lang = SUPPORTED_LANGUAGES.includes(detectedLang as any) ? detectedLang : 'pt';
      navigate(`/${lang}${currentPath}`, { replace: true });
      return;
    }

    // Se a rota começa com um idioma suportado, atualizar o i18n imediatamente
    const lang = firstSegment as typeof SUPPORTED_LANGUAGES[number];
    const currentLang = i18n.language.split('-')[0];
    
    // Sempre atualizar o idioma para garantir sincronização
    if (currentLang !== lang) {
      // Aguardar a atualização do i18n para garantir sincronização
      i18n.changeLanguage(lang).catch((error) => {
        console.error('Error changing language:', error);
        // Se houver erro, tentar novamente
        i18n.changeLanguage(lang);
      });
    }
  }, [location.pathname, navigate, i18n]);

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const firstSegment = pathSegments[0];
  const currentLang = SUPPORTED_LANGUAGES.includes(firstSegment as any) ? firstSegment : 'pt';

  // Função para remover prefixo de idioma existente do path
  const removeLanguagePrefix = (path: string): string => {
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0] as any)) {
      return '/' + segments.slice(1).join('/');
    }
    return path;
  };

  // Se estamos na raiz com idioma, redirecionar para /{lang}/discover-soildata
  if (pathSegments.length === 1 && SUPPORTED_LANGUAGES.includes(firstSegment as any)) {
    return <Navigate to={`/${firstSegment}/discover-soildata`} replace />;
  }

  return (
    <Routes>
      {SUPPORTED_LANGUAGES.map((lang) =>
        appRoutes.map((route) => {
          const routePath = route.path === '/' ? '/discover-soildata' : route.path;
          const fullPath = `/${lang}${routePath}`;
          
          return (
            <Route
              key={fullPath}
              path={fullPath}
              element={route.element}
            />
          );
        })
      )}
      {/* Redirecionar rotas antigas sem idioma */}
      <Route
        path="*"
        element={
          <Navigate
            to={`/${currentLang}${
              location.pathname === '/'
                ? '/discover-soildata'
                : removeLanguagePrefix(location.pathname) || '/discover-soildata'
            }`}
            replace
          />
        }
      />
    </Routes>
  );
}

