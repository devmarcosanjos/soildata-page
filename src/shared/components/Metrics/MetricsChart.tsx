import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type MonthlyMetric } from '@/types/metrics';

interface MetricsChartProps {
  data: MonthlyMetric[];
  title?: string;
  loading?: boolean;
  className?: string;
}

export function MetricsChart({
  data,
  title,
  loading = false,
  className = '',
}: MetricsChartProps) {
  const { t, i18n } = useTranslation('data');
  const locale = i18n.language.split('-')[0] || 'pt';
  const [viewMode, setViewMode] = useState<'cumulative' | 'monthly'>('cumulative');
  const [periodFilter, setPeriodFilter] = useState<'6months' | 'year' | 'all'>('all');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Validar se data é um array
  const isValidData = Array.isArray(data) && data.length > 0;

  if (loading || !isValidData) {
    return (
      <div className={`card bg-base-100 shadow-lg ${className}`}>
        <div className="card-body">
          {title && <h3 className="card-title text-xl mb-4">{title}</h3>}
          <div className="flex items-center justify-center h-64">
            {loading ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              <p className="text-base-content/70">{t('statistics.sections.monthlyDownloads.chart.noData')}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Filtrar dados baseado no período selecionado
  const filterDataByPeriod = (dataToFilter: MonthlyMetric[]): MonthlyMetric[] => {
    if (periodFilter === 'all') return dataToFilter;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (periodFilter) {
      case '6months':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return dataToFilter.filter((item) => {
      const [year, month] = item.date.split('-');
      const itemDate = new Date(parseInt(year), parseInt(month) - 1);
      return itemDate >= cutoffDate;
    });
  };

  // Converter dados cumulativos em dados mensais (diferença entre meses consecutivos)
  // IMPORTANTE: Calcular usando dados completos para ter o mês anterior correto
  const monthlyData = data.map((item, index) => {
    const previousCount = index > 0 ? data[index - 1].count : 0;
    const monthlyCount = item.count - previousCount;
    return {
      date: item.date,
      count: Math.max(0, monthlyCount), // Garantir que não seja negativo
      cumulative: item.count,
    };
  });

  // Aplicar filtro de período APÓS calcular os dados mensais
  const filteredData = filterDataByPeriod(data);
  const filteredMonthlyData = filterDataByPeriod(monthlyData);

  // Usar dados cumulativos ou mensais baseado no modo de visualização
  const displayData = viewMode === 'cumulative' ? filteredData : filteredMonthlyData;
  const maxCount = Math.max(...displayData.map((d) => d.count), 1);
  const totalCumulative = filteredData.length > 0 ? filteredData[filteredData.length - 1].count : 0;

  // Cor do SolidData: #C55B28 com maior contraste (95% de opacidade)
  const soildataColor = 'rgba(197, 91, 40, 0.95)'; // #C55B28 com 95% de opacidade para melhor contraste

  // Formatar data para exibição (MM/YY)
  const formatDate = (dateStr: string): string => {
    const [year, month] = dateStr.split('-');
    const monthNum = parseInt(month);
    const yearShort = year.slice(-2); // Últimos 2 dígitos do ano
    return `${monthNum}/${yearShort}`;
  };

  return (
    <div className={`card bg-white shadow-lg ${className}`} style={{ overflow: 'visible', minHeight: '550px' }}>
      <div className="card-body" style={{ overflow: 'visible', padding: '1.5rem', minHeight: '550px' }}>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {title && (
              <h3 className="card-title text-xl mb-0" style={{ fontFamily: "'Lato', sans-serif", color: '#374151' }}>
                {title}
              </h3>
            )}
            <div className="join">
              <button
                className={`btn btn-sm join-item ${viewMode === 'cumulative' ? 'btn-active' : 'btn-ghost'}`}
                onClick={() => setViewMode('cumulative')}
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '14px',
                  ...(viewMode === 'cumulative' 
                    ? { backgroundColor: '#C55B28', color: 'white', borderColor: '#C55B28' }
                    : { color: '#6B7280' })
                }}
              >
                {t('statistics.sections.monthlyDownloads.chart.cumulative')}
              </button>
              <button
                className={`btn btn-sm join-item ${viewMode === 'monthly' ? 'btn-active' : 'btn-ghost'}`}
                onClick={() => setViewMode('monthly')}
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '14px',
                  ...(viewMode === 'monthly' 
                    ? { backgroundColor: '#C55B28', color: 'white', borderColor: '#C55B28' }
                    : { color: '#6B7280' })
                }}
              >
                {t('statistics.sections.monthlyDownloads.chart.monthly')}
              </button>
            </div>
          </div>
          
          {/* Filtros de período */}
          <div className="flex flex-wrap gap-2">
            <span style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280', alignSelf: 'center' }}>
              {t('statistics.sections.monthlyDownloads.chart.period')}
            </span>
            <div className="join">
              <button
                className={`btn btn-sm join-item ${periodFilter === '6months' ? 'btn-active' : 'btn-ghost'}`}
                onClick={() => setPeriodFilter('6months')}
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '14px',
                  ...(periodFilter === '6months' 
                    ? { backgroundColor: '#C55B28', color: 'white', borderColor: '#C55B28' }
                    : { color: '#6B7280' })
                }}
              >
                {t('statistics.sections.monthlyDownloads.chart.6months')}
              </button>
              <button
                className={`btn btn-sm join-item ${periodFilter === 'year' ? 'btn-active' : 'btn-ghost'}`}
                onClick={() => setPeriodFilter('year')}
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '14px',
                  ...(periodFilter === 'year' 
                    ? { backgroundColor: '#C55B28', color: 'white', borderColor: '#C55B28' }
                    : { color: '#6B7280' })
                }}
              >
                {t('statistics.sections.monthlyDownloads.chart.year')}
              </button>
              <button
                className={`btn btn-sm join-item ${periodFilter === 'all' ? 'btn-active' : 'btn-ghost'}`}
                onClick={() => setPeriodFilter('all')}
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: '14px',
                  ...(periodFilter === 'all' 
                    ? { backgroundColor: '#C55B28', color: 'white', borderColor: '#C55B28' }
                    : { color: '#6B7280' })
                }}
              >
                {t('statistics.sections.monthlyDownloads.chart.all')}
              </button>
            </div>
          </div>
        </div>

        <div className="mb-2" style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', color: '#6B7280' }}>
          <span className="badge badge-ghost" style={{ fontFamily: "'Lato', sans-serif", fontSize: '12px', color: '#6B7280', backgroundColor: '#F3F4F6' }}>
            {viewMode === 'cumulative' 
              ? t('statistics.sections.monthlyDownloads.chart.cumulativeDescription')
              : t('statistics.sections.monthlyDownloads.chart.monthlyDescription')}
          </span>
        </div>

        <div className="w-full" style={{ overflowX: 'auto', overflowY: 'visible' }}>
          <div className="flex items-end gap-0.5 md:gap-1 p-4" style={{ 
            minWidth: `${Math.max(displayData.length * 30, 800)}px`, 
            paddingTop: '5rem', 
            paddingBottom: '5rem',
            minHeight: '450px',
            height: 'auto'
          }}>
            {displayData.map((item, index) => {
              // Altura máxima das barras: 350px (altura do container 450px - padding top 80px - espaço para labels 20px)
              const maxBarHeight = 350;
              const heightPx = maxCount > 0 ? (item.count / maxCount) * maxBarHeight : 0;
              const monthlyValue = viewMode === 'monthly' 
                ? item.count 
                : (index > 0 ? item.count - displayData[index - 1].count : item.count);
              const cumulativeValue = viewMode === 'cumulative' 
                ? item.count 
                : (monthlyData[index]?.cumulative ?? item.count);

              return (
                <div
                  key={`${item.date}-${index}`}
                  className="relative flex flex-col items-center flex-1 min-w-0 group"
                  style={{ overflow: 'visible' }}
                  title={
                    viewMode === 'cumulative'
                      ? t('statistics.sections.monthlyDownloads.chart.tooltipCumulative', { 
                          date: formatDate(item.date), 
                          count: item.count.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR')
                        })
                      : t('statistics.sections.monthlyDownloads.chart.tooltipMonthly', {
                          date: formatDate(item.date),
                          monthly: monthlyValue.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR'),
                          total: cumulativeValue.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR')
                        })
                  }
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="relative w-full flex items-end justify-center" style={{ overflow: 'visible', height: '100%', minHeight: `${maxBarHeight + 100}px` }}>
                    <div
                      className="rounded-t transition-all hover:opacity-90 cursor-pointer shadow-sm hover:shadow-md relative"
                      style={{ 
                        height: `${heightPx}px`, 
                        minHeight: heightPx > 0 ? '2px' : '0',
                        maxHeight: `${maxBarHeight}px`,
                        backgroundColor: soildataColor,
                        overflow: 'visible',
                        width: '70%',
                        maxWidth: '35px',
                        margin: '0 auto'
                      }}
                    />
                    {/* Tooltip que aparece acima da barra */}
                    <div 
                      className="absolute left-1/2 transform -translate-x-1/2 px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
                      style={{ 
                        zIndex: 50,
                        bottom: `${heightPx + 20}px`,
                        top: 'auto',
                        fontFamily: "'Lato', sans-serif",
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#374151',
                        backgroundColor: '#F3F4F6'
                      }}
                    >
                      {viewMode === 'cumulative' 
                        ? `${item.count.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR')} ${t('statistics.sections.monthlyDownloads.chart.accumulated')}`
                        : `${monthlyValue.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR')} ${t('statistics.sections.monthlyDownloads.chart.downloads')}`}
                    </div>
                  </div>
                  <div className="mt-4 w-full" style={{ 
                    minHeight: '60px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    position: 'relative'
                  }}>
                    <div 
                      style={{ 
                        fontFamily: "'Lato', sans-serif",
                        fontSize: '12px',
                        fontWeight: hoveredIndex === index ? '700' : '600',
                        color: hoveredIndex === index ? '#C55B28' : '#1F2937',
                        lineHeight: '1.3',
                        transition: 'color 0.2s ease, font-weight 0.2s ease',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        position: 'absolute',
                        left: '50%',
                        top: '0',
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {formatDate(item.date)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6 pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: '14px', fontWeight: '600', color: '#374151' }}>{t('statistics.sections.monthlyDownloads.chart.total')}</span>
              <span style={{ fontFamily: "'Lato', sans-serif", fontSize: '1.25rem', fontWeight: 'bold', color: '#C55B28' }}>
                {totalCumulative.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR')}
              </span>
            </div>
            {viewMode === 'monthly' && (
              <div style={{ fontFamily: "'Lato', sans-serif", fontSize: '12px', color: '#9CA3AF' }}>
                {t('statistics.sections.monthlyDownloads.chart.monthlySum')} {monthlyData.reduce((sum, item) => sum + item.count, 0).toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR')}
              </div>
            )}
          </div>
          <div style={{ fontFamily: "'Lato', sans-serif", fontSize: '12px', color: '#9CA3AF' }}>
            {filteredData.length > 0 && (
              <>
                {formatDate(filteredData[0].date)} - {formatDate(filteredData[filteredData.length - 1].date)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
