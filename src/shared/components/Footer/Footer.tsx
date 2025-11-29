import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Logo } from '../Logo';
import { useI18n } from '@/shared/hooks/useI18n';

export function Footer() {
  const { t } = useTranslation('footer');
  const { currentLanguage } = useI18n();

  const getLocalizedPath = (path: string) => {
    return `/${currentLanguage}${path}`;
  };

  return (
    <>
      <footer className="footer sm:footer-horizontal text-base-content p-10 footer-gradient-main">
        <div className="max-w-[1920px] mx-auto w-full px-4 md:px-6 lg:px-0">
          <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <aside className="col-span-1">
              <div className="mb-4">
                <Logo to={undefined} size="md" />
              </div>
            </aside>

            <nav className="col-span-1">
              <h6 className="footer-title text-gray-600">{t('quickLinks.title')}</h6>
              <Link to={getLocalizedPath('/platform')} className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors">
                {t('quickLinks.platform')}
              </Link>
              <a
                href="https://soildata.mapbiomas.org/dataverse/soildata?q="
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors"
              >
                {t('quickLinks.repository')}
              </a>
              <Link to={getLocalizedPath('/statistics')} className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors">
                {t('quickLinks.statistics')}
              </Link>
              <Link to={getLocalizedPath('/about')} className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors">
                {t('quickLinks.about')}
              </Link>
              <Link to={getLocalizedPath('/contact')} className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors">
                {t('quickLinks.contact')}
              </Link>
            </nav>

            <nav className="col-span-1">
              <h6 className="footer-title text-gray-600">{t('resources.title')}</h6>
              <a
                href="https://soildata.mapbiomas.org/dicionario"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors"
              >
                {t('resources.dictionary')}
              </a>
              <a
                href="https://docs.google.com/spreadsheets/d/1bCRlrHx0HZLhzNoh5iCKNljSTZnoT4gGgyElfi-AY2o/edit?gid=0#gid=0"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors"
              >
                {t('resources.spreadsheet')}
              </a>
            </nav>

            <nav className="col-span-1">
              <h6 className="footer-title text-gray-600">{t('legal.title')}</h6>
              <Link
                to={getLocalizedPath('/privacy-policy')}
                className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors"
              >
                {t('legal.privacy')}
              </Link>
              <Link
                to={getLocalizedPath('/termos-uso')}
                className="link link-hover block text-gray-500 hover:text-orange-600 transition-colors"
              >
                {t('legal.terms')}
              </Link>
            </nav>
          </div>
        </div>
      </footer>

      <footer className="footer sm:footer-horizontal footer-center footer-gradient-bottom text-base-content p-4">
        <aside>
          <p className="text-sm mb-2 text-white">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-sm text-white/80">
            {t('developed')}
            <br />
            <a
              href="https://www.pedometria.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover text-white/80 hover:text-orange-600 transition-colors"
            >
              {t('lab')}
            </a>
            {' | '}
            <a
              href="https://ecostage.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover text-white/80 hover:text-orange-600 transition-colors"
            >
              {t('ecostage')}
            </a>
          </p>
        </aside>
      </footer>
    </>
  );
}
