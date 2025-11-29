import { useTranslation } from 'react-i18next';

export function Methods() {
  const { t } = useTranslation('data');
  
  return (
    <div className="py-6 md:py-8 lg:py-12 px-4 md:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">{t('methods.title')}</h1>
        <p className="text-base md:text-lg text-base-content/70">
          {t('methods.description')}
        </p>
      </div>
    </div>
  );
}
