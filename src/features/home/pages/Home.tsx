import { useTranslation } from 'react-i18next';
import soloImage from '@/assets/solo.png';
import logoDOI from '@/assets/doi.png';
import logoMapBiomas from '@/assets/mapbiomas.png';
import logoCNPq from '@/assets/cnpq.png';
import logoDataCite from '@/assets/DataCite-Logo_stacked.svg';
import { PublicationsSection } from '@/shared/components/PublicationsSection';
import { PlatformPreviewSection } from '@/shared/components/PlatformPreviewSection';
import { RepositoryPreviewSection } from '@/shared/components/RepositoryPreviewSection';
import { CollaborativeNetworkSection } from '@/shared/components/CollaborativeNetworkSection';
import { SearchBar } from '@/shared/components/SearchBar';
import { mockPublications } from '@/data/mockPublications';
import { useLatestDatasets } from '@/hooks/queries/useDatasets';

export function Home() {
  const { t } = useTranslation('home');
  const { t: tFooter } = useTranslation('footer');
  const { data: datasets = mockPublications, isLoading } = useLatestDatasets(6);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const encodedQuery = encodeURIComponent(query.trim());
      const soilDataUrl = `https://soildata.mapbiomas.org/dataverse/soildata?q=${encodedQuery}`;
      window.location.href = soilDataUrl;
    }
  };

  return (
    <>
      <div 
        className="h-[60vh] flex items-center relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${soloImage})` }}
      >
        <div className="absolute inset-0 bg-black/25 z-0"></div>
        
        <div className="max-w-[1920px] mx-auto w-full px-4 md:px-6 lg:px-0">
          <div className="max-w-[1200px] mx-auto w-full px-2 md:px-4 lg:px-0">
            <div className="text-center relative z-10">
              <p className="text-lg md:text-xl text-white mb-10 max-w-3xl lg:max-w-[980px] mx-auto text-left leading-relaxed">
            {t('hero.description')}{' '}
            <span className="text-rotate">
              <span>
                <span>{t('hero.activities.teaching')}</span>
                <span>{t('hero.activities.research')}</span>
                <span>{t('hero.activities.commercial')}</span>
              </span>
            </span>
          </p>

          <div className="mb-4 flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>

          <p className="text-white text-sm md:text-base">
            {t('hero.searchPlaceholder')}
          </p>

          <div className="mt-6 flex justify-center -translate-y-2.5">
            <div className="inline-flex items-center gap-1 px-2 md:px-2.5 py-1 md:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/40 shadow-lg">
              <p className="text-white text-[10px] md:text-xs font-medium drop-shadow-sm">
                {t('hero.doiNote')}
              </p>
              <img 
                className="h-3.5 md:h-6 w-auto object-contain opacity-100 drop-shadow-md" 
                src={logoDOI} 
                alt="DOI" 
              />
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>

    

      {!isLoading && <PublicationsSection datasets={datasets} />}
      <PlatformPreviewSection />
      <RepositoryPreviewSection />
      <CollaborativeNetworkSection />

      {/* Seção Iniciativa, Apoio e Indexado */}
      <section className="py-8 md:py-10 bg-gray-50">
        <div className="max-w-[1920px] mx-auto px-4 md:px-6 lg:px-0">
          <div className="max-w-[1200px] mx-auto w-full px-2 md:px-4 lg:px-0">
            <div className="flex flex-col md:flex-row items-start justify-center md:justify-start gap-8 md:gap-12 lg:gap-16">
              {/* Seção INICIATIVA */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-sm font-semibold mb-6 text-center md:text-left text-gray-600">
                  {tFooter('initiative')}
                </h3>
                <div className="flex items-center justify-center" style={{ height: '95px' }}>
                  <img
                    src={logoMapBiomas}
                    alt="MapBiomas"
                    className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxHeight: '95px' }}
                  />
                </div>
              </div>

              {/* Seção APOIO */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-sm font-semibold mb-6 text-center md:text-left text-gray-600">
                  {tFooter('support')}
                </h3>
                <div className="flex items-center justify-center" style={{ height: '95px' }}>
                  <img
                    src={logoCNPq}
                    alt="CNPq"
                    className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxHeight: '95px' }}
                  />
                </div>
              </div>

              {/* Seção INDEXADO */}
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-sm font-semibold mb-6 text-center md:text-left text-gray-600">
                  {tFooter('indexed')}
                </h3>
                <div className="flex items-center justify-center" style={{ height: '95px' }}>
                  <img
                    src={logoDataCite}
                    alt="DataCite"
                    className="h-full w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxHeight: '95px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
