import { useTranslation } from 'react-i18next';
import { SummaryCard } from '@mapbiomas/ui';
import { Database, Layers, MapPin, FlaskConical } from 'lucide-react';
import type { MapStatistics } from './PlatformMapMapLibre';

interface PlatformStatisticsProps {
  statistics?: MapStatistics;
}

export function PlatformStatistics({ statistics }: PlatformStatisticsProps) {
  const { t, i18n } = useTranslation('platform');
  const locale = i18n.language.split('-')[0] || 'pt';
  
  const summaryData = [
    { 
      icon: <Database size={20} />, 
      label: t('datasets'), 
      value: statistics?.totalDatasets ? `${statistics.totalDatasets}` : '0'
    },
    { 
      icon: <Layers size={20} />, 
      label: t('samples'), 
      value: statistics?.totalSamples ? statistics.totalSamples.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR') : '0'
    },
    { 
      icon: <MapPin size={20} />, 
      label: t('locations'), 
      value: statistics?.totalLocations ? statistics.totalLocations.toLocaleString(locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR') : '0'
    },
    { 
      icon: <FlaskConical size={20} />, 
      label: t('properties'), 
      value: statistics?.totalProperties ? `${statistics.totalProperties}` : '0'
    },
  ];

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-size-large)',
        padding: 'var(--spacing-size-large)',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-size-medium)',
        }}
      >
        <div style={{ font: 'var(--heading-medium)', color: '#1E293B' }}>
          {t('statistics')}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-size-medium)',
        }}
      >
        {summaryData.map((card) => (
          <SummaryCard
            key={card.label}
            icon={card.icon}
            iconColor="#C55B28"
            label={card.label}
            value={card.value}
            rate={0}
          />
        ))}
      </div>
    </div>
  );
}
