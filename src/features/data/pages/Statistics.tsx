import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeroPageLayout } from '@/shared/components/HeroPageLayout';
import { MetricsChart } from '@/shared/components/Metrics';
import {
  useTotalDatasets,
  useTotalFiles,
  useMonthlyDownloads,
} from '@/hooks/queries/useMetrics';
import { Database, Download, FileText, TrendingUp } from 'lucide-react';

export function Statistics() {
  const { t, i18n } = useTranslation('data');
  const locale = i18n.language.split('-')[0] || 'pt';

  // Buscar métricas usando React Query
  const { data: datasetsData, isLoading: datasetsLoading, isError: datasetsError } = useTotalDatasets();
  const { data: filesData, isLoading: filesLoading, isError: filesError } = useTotalFiles();
  const { data: monthlyDownloadsData = [], isLoading: monthlyLoading, isError: monthlyError } = useMonthlyDownloads();

  // Estados derivados
  const loading = datasetsLoading || filesLoading || monthlyLoading;
  const error = (datasetsError || filesError || monthlyError) ? t('statistics.error') : null;

  // Processar dados
  const totalDatasets = datasetsData?.count ?? 0;
  const totalFiles = filesData?.count ?? 0;
  
  // Calcular total de downloads do último valor acumulativo dos dados mensais
  const totalDownloads = useMemo(() => {
    if (Array.isArray(monthlyDownloadsData) && monthlyDownloadsData.length > 0) {
      return monthlyDownloadsData[monthlyDownloadsData.length - 1].count;
    }
    return 0;
  }, [monthlyDownloadsData]);

  // Calcular métricas derivadas
  const avgDownloadsPerDataset = totalDatasets > 0 ? Math.round(totalDownloads / totalDatasets) : 0;
  const avgFilesPerDataset = totalDatasets > 0 ? (totalFiles / totalDatasets).toFixed(1) : '0';

  return (
    <HeroPageLayout title={t('statistics.title')}>
      {/* Descrição */}
      <div className="mb-8 md:mb-12">
        <p className="text-base text-gray-500 leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
          {t('statistics.description')}
        </p>
      </div>

      {error && (
        <div className="alert alert-error mb-6 shadow-lg">
          <span>{error}</span>
        </div>
      )}

      {/* Seção: Visão Geral */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          {t('statistics.sections.overview.title')}
        </h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="stats stats-vertical lg:stats-horizontal shadow w-full bg-white">
            <div className="stat">
              <div className="stat-figure" style={{ color: '#C55B28' }}>
                <Database className="w-8 h-8" />
              </div>
              <div className="stat-title" style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280' }}>{t('statistics.sections.overview.totalDatasets')}</div>
              <div className="stat-value" style={{ fontFamily: "'Lato', sans-serif", color: '#C55B28', fontSize: '2.5rem' }}>{totalDatasets.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR')}</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure" style={{ color: '#C55B28' }}>
                <Download className="w-8 h-8" />
              </div>
              <div className="stat-title" style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280' }}>{t('statistics.sections.overview.totalDownloads')}</div>
              <div className="stat-value" style={{ fontFamily: "'Lato', sans-serif", color: '#C55B28', fontSize: '2.5rem' }}>
                {totalDownloads.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR')}
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-figure" style={{ color: '#C55B28' }}>
                <FileText className="w-8 h-8" />
              </div>
              <div className="stat-title" style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280' }}>{t('statistics.sections.overview.totalFiles')}</div>
              <div className="stat-value" style={{ fontFamily: "'Lato', sans-serif", color: '#C55B28', fontSize: '2.5rem' }}>{totalFiles.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR')}</div>
            </div>
          </div>
        )}
        
        {/* Métricas adicionais */}
        {!loading && (totalDatasets > 0 || totalDownloads > 0) && (
          <div className="mt-6 stats stats-vertical lg:stats-horizontal shadow w-full bg-gray-50">
            <div className="stat">
              <div className="stat-figure" style={{ color: '#C55B28' }}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="stat-title" style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280' }}>{t('statistics.sections.overview.avgDownloadsPerDataset')}</div>
              <div className="stat-value" style={{ fontFamily: "'Lato', sans-serif", fontSize: '2rem', color: '#374151' }}>{avgDownloadsPerDataset.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR')}</div>
            </div>
            <div className="stat">
              <div className="stat-figure" style={{ color: '#C55B28' }}>
                <FileText className="w-6 h-6" />
              </div>
              <div className="stat-title" style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280' }}>{t('statistics.sections.overview.avgFilesPerDataset')}</div>
              <div className="stat-value" style={{ fontFamily: "'Lato', sans-serif", fontSize: '2rem', color: '#374151' }}>{avgFilesPerDataset}</div>
            </div>
          </div>
        )}
      </div>

      {/* Seção: Downloads Mensais */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          {t('statistics.sections.monthlyDownloads.title')}
        </h2>
        <div className="w-full overflow-x-auto">
          <MetricsChart
            data={Array.isArray(monthlyDownloadsData) ? monthlyDownloadsData : []}
            loading={loading}
            className="w-full"
          />
        </div>
      </div>

    </HeroPageLayout>
  );
}
