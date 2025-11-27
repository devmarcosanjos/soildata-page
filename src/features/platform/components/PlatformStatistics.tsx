import { SummaryCard } from '@mapbiomas/ui';
import { Database, Layers, MapPin, FlaskConical } from 'lucide-react';
import type { MapStatistics } from './PlatformMap';

interface PlatformStatisticsProps {
  statistics?: MapStatistics;
}

export function PlatformStatistics({ statistics }: PlatformStatisticsProps) {
  const summaryData = [
    { 
      icon: <Database size={20} />, 
      label: 'Conjuntos de Dados de Solo', 
      value: statistics?.totalDatasets ? `${statistics.totalDatasets}` : '0'
    },
    { 
      icon: <Layers size={20} />, 
      label: 'Amostras de Solo', 
      value: statistics?.totalSamples ? statistics.totalSamples.toLocaleString('pt-BR') : '0'
    },
    { 
      icon: <MapPin size={20} />, 
      label: 'Locais de Coleta', 
      value: statistics?.totalLocations ? statistics.totalLocations.toLocaleString('pt-BR') : '0'
    },
    { 
      icon: <FlaskConical size={20} />, 
      label: 'Propriedades Analisadas', 
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
          Estatísticas
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
