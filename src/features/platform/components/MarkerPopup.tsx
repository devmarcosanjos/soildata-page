import { memo } from 'react';
import type { SoloDatasetPoint } from '@/features/platform/data/soloDatasets';

interface MarkerPopupProps {
  point: SoloDatasetPoint;
}

/**
 * Componente memoizado para o popup do marcador
 * Evita re-renders desnecessários quando outros marcadores são atualizados
 */
export const MarkerPopup = memo(function MarkerPopup({ point }: MarkerPopupProps) {
  return (
    <div className="flex flex-col gap-4 p-1">
      <div>
        <div className="text-lg font-bold mb-2" style={{ color: '#C55B28' }}>
          {point.id}
        </div>
        <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#C55B28' }}>
          Título do projeto
        </div>
        <div className="text-sm text-base-content leading-relaxed" style={{ lineHeight: 1.6 }}>
          {point.title || point.datasetCode.toUpperCase()}
        </div>
        {point.doi && (
          <div className="text-xs font-semibold mt-2" style={{ color: '#C55B28' }}>
            <a 
              href={`https://soildata.mapbiomas.org/dataset.xhtml?persistentId=${point.doi}`}
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#C55B28', textDecoration: 'underline' }}
            >
              DOI: {point.doi}
            </a>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <a
          className="btn btn-sm text-white border-none hover:opacity-90"
          style={{ backgroundColor: '#C55B28', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          href={point.datasetUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Acessar trabalho de origem
        </a>
        {point.csvDataUri && (
          <a
            className="btn btn-sm btn-outline hover:bg-orange-50"
            style={{ borderColor: '#C55B28', color: '#C55B28', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            href={point.csvDataUri}
            download={`${point.id}.csv`}
          >
            Descarregar dados do ponto
          </a>
        )}
      </div>
    </div>
  );
});

