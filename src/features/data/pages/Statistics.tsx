import { useEffect, useState } from 'react';
import { HeroPageLayout } from '@/shared/components/HeroPageLayout';
import { MetricsChart } from '@/shared/components/Metrics';
import {
  getTotalDatasets,
  getTotalFiles,
  getMonthlyDownloads,
  clearMetricsCache,
} from '@/services/metricsApi';
import type { MonthlyMetric } from '@/types/metrics';
import { Database, Download, FileText, TrendingUp } from 'lucide-react';

export function Statistics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Métricas totais
  const [totalDatasets, setTotalDatasets] = useState<number>(0);
  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const [totalFiles, setTotalFiles] = useState<number>(0);

  // Métricas mensais
  const [monthlyDownloads, setMonthlyDownloads] = useState<MonthlyMetric[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      
      // Limpar cache para garantir dados atualizados
      clearMetricsCache();

      try {
        // Buscar todas as métricas em paralelo
        // Removido getTotalDownloads() pois vamos usar o valor acumulativo dos dados mensais
        // Removido getFileDownloads() pois o endpoint retorna erro 500
        const [
          datasetsResult,
          filesResult,
          monthlyDownloadsResult,
        ] = await Promise.allSettled([
          getTotalDatasets(),
          getTotalFiles(),
          getMonthlyDownloads(),
        ]);

        // Processar resultados com validação
        if (datasetsResult.status === 'fulfilled') {
          const value = datasetsResult.value;
          if (value && typeof value.count === 'number') {
            setTotalDatasets(value.count);
          }
        } else {
          console.warn('Erro ao buscar total de datasets:', datasetsResult.status === 'rejected' ? datasetsResult.reason : 'unknown');
        }

        // Não usar mais o valor da API /downloads
        // O total de downloads será definido pelo último valor acumulativo dos dados mensais
        // if (downloadsResult.status === 'fulfilled') {
        //   const value = downloadsResult.value;
        //   if (value && typeof value.count === 'number') {
        //     setTotalDownloads(value.count);
        //   } else {
        //     console.warn('Valor de downloads inválido:', value);
        //   }
        // } else {
        //   console.warn('Erro ao buscar total de downloads:', downloadsResult.status === 'rejected' ? downloadsResult.reason : 'unknown');
        // }

        if (filesResult.status === 'fulfilled') {
          const value = filesResult.value;
          if (value && typeof value.count === 'number') {
            setTotalFiles(value.count);
          }
        } else {
          console.warn('Erro ao buscar total de arquivos:', filesResult.status === 'rejected' ? filesResult.reason : 'unknown');
        }

        if (monthlyDownloadsResult.status === 'fulfilled') {
          const value = monthlyDownloadsResult.value;
          // Verificar se é um array
          if (Array.isArray(value)) {
            setMonthlyDownloads(value);
            // Usar o último valor acumulativo dos dados mensais como total de downloads
            if (value.length > 0) {
              const lastMonthValue = value[value.length - 1].count;
              setTotalDownloads(lastMonthValue);
            }
          } else {
            console.warn('monthlyDownloads não é um array:', value);
            setMonthlyDownloads([]);
          }
        }

      } catch (err) {
        console.error('Erro ao buscar métricas:', err);
        setError('Não foi possível carregar as métricas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Calcular métricas derivadas
  const avgDownloadsPerDataset = totalDatasets > 0 ? Math.round(totalDownloads / totalDatasets) : 0;
  const avgFilesPerDataset = totalDatasets > 0 ? (totalFiles / totalDatasets).toFixed(1) : '0';

  return (
    <HeroPageLayout title="MÉTRICAS DO SOLIDDATA">
      {/* Descrição */}
      <div className="mb-8 md:mb-12">
        <p className="text-base text-gray-500 leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", fontSize: '16px' }}>
          Estatísticas e métricas do repositório SoilData em tempo real. Acompanhe o crescimento do repositório, 
          downloads, datasets e muito mais.
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
          Visão Geral
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
              <div className="stat-title" style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280' }}>Total de Datasets</div>
              <div className="stat-value" style={{ fontFamily: "'Lato', sans-serif", color: '#C55B28', fontSize: '2.5rem' }}>{totalDatasets.toLocaleString('pt-BR')}</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure" style={{ color: '#C55B28' }}>
                <Download className="w-8 h-8" />
              </div>
              <div className="stat-title" style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280' }}>Total de Downloads</div>
              <div className="stat-value" style={{ fontFamily: "'Lato', sans-serif", color: '#C55B28', fontSize: '2.5rem' }}>
                {totalDownloads.toLocaleString('pt-BR')}
              </div>
            </div>
            
            <div className="stat">
              <div className="stat-figure" style={{ color: '#C55B28' }}>
                <FileText className="w-8 h-8" />
              </div>
              <div className="stat-title" style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280' }}>Total de Arquivos</div>
              <div className="stat-value" style={{ fontFamily: "'Lato', sans-serif", color: '#C55B28', fontSize: '2.5rem' }}>{totalFiles.toLocaleString('pt-BR')}</div>
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
              <div className="stat-title" style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280' }}>Média de Downloads por Dataset</div>
              <div className="stat-value" style={{ fontFamily: "'Lato', sans-serif", fontSize: '2rem', color: '#374151' }}>{avgDownloadsPerDataset.toLocaleString('pt-BR')}</div>
            </div>
            <div className="stat">
              <div className="stat-figure" style={{ color: '#C55B28' }}>
                <FileText className="w-6 h-6" />
              </div>
              <div className="stat-title" style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280' }}>Média de Arquivos por Dataset</div>
              <div className="stat-value" style={{ fontFamily: "'Lato', sans-serif", fontSize: '2rem', color: '#374151' }}>{avgFilesPerDataset}</div>
            </div>
          </div>
        )}
      </div>

      {/* Seção: Downloads Mensais */}
      <div className="mb-8 md:mb-12">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6 md:mb-8 text-gray-700" style={{ fontFamily: "'Lato', sans-serif" }}>
          Downloads ao Longo do Tempo
        </h2>
        <div className="w-full overflow-x-auto">
          <MetricsChart
            data={monthlyDownloads}
            loading={loading}
            className="w-full"
          />
        </div>
      </div>

    </HeroPageLayout>
  );
}
