import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import soloImage from '@/assets/solo.png';
import logoDOI from '@/assets/doi.png';
import { PublicationsSection } from '@/shared/components/PublicationsSection';
import { PlatformPreviewSection } from '@/shared/components/PlatformPreviewSection';
import { RepositoryPreviewSection } from '@/shared/components/RepositoryPreviewSection';
import { SearchBar } from '@/shared/components/SearchBar';
import { mockPublications } from '@/data/mockPublications';
import type { Dataset } from '@/types/dataset';
import { getLatestDatasets } from '@/services/latestDatasetsApi';

export function Home() {
  const { t } = useTranslation('home');
  const [datasets, setDatasets] = useState<Dataset[]>(mockPublications);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDatasets() {
      setIsLoading(true);
      try {
        const latestDatasets = await getLatestDatasets(6);
        if (latestDatasets.length > 0) {
          setDatasets(latestDatasets);
        }
      } catch (error) {
        console.error('Erro ao carregar datasets:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDatasets();
  }, []);

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
    </>
  );
}
