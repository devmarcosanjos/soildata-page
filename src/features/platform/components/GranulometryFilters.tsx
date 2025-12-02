import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Accordion, RadioGroup } from '@mapbiomas/ui';
import { FilterIcon } from 'lucide-react';
import { usePlatformStore } from '@/stores/platformStore';
import { GRANULOMETRY_DATASET_ID } from '@/features/platform/data/soloDatasets';

export function GranulometryFilters() {
  const { selectedSoloDataset } = usePlatformStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Ler fração da URL ao montar
  const fractionFromUrl = searchParams.get('fraction') as 'clay' | 'silt' | 'sand' | 'coarse' | null;
  const [selectedFraction, setSelectedFraction] = useState<'clay' | 'silt' | 'sand' | 'coarse' | null>(
    fractionFromUrl || null
  );

  // Sincronizar com a URL quando a fração mudar
  useEffect(() => {
    if (selectedFraction) {
      searchParams.set('fraction', selectedFraction);
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.delete('fraction');
      setSearchParams(searchParams, { replace: true });
    }
  }, [selectedFraction, searchParams, setSearchParams]);

  // Ler da URL quando a URL mudar (ex: navegação do browser)
  useEffect(() => {
    const urlFraction = searchParams.get('fraction') as 'clay' | 'silt' | 'sand' | 'coarse' | null;
    if (urlFraction !== selectedFraction) {
      setSelectedFraction(urlFraction);
    }
  }, [searchParams, selectedFraction]);

  // Só mostrar filtros se o dataset de granulometria estiver selecionado
  if (selectedSoloDataset !== GRANULOMETRY_DATASET_ID) {
    return null;
  }

  return (
    <Accordion
      title="Granulometria"
      icon={
        <div style={{ 
          width: '28px', 
          height: '28px', 
          borderRadius: '50%', 
          backgroundColor: '#C55B28',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <FilterIcon size={16} color="#FFFFFF" />
        </div>
      }
      initialExpanded={false}
      hasPlusMinusIcon={true}
      type="theme"
      color="#EA580C"
    >
      <div 
        className="selecao-dados-soildata"
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 'var(--spacing-size-medium)',
          paddingTop: 'var(--spacing-size-small)',
        }}
      >
        {/* Seleção de Fração */}
        <RadioGroup
          options={[
            { label: 'Fração argila (g/kg)', value: 'clay' },
            { label: 'Fração silte (g/kg)', value: 'silt' },
            { label: 'Fração areia (g/kg)', value: 'sand' },
            { label: 'Fração grossa (g/kg)', value: 'coarse' },
          ]}
          value={selectedFraction || ''}
          onChange={(value) => {
            setSelectedFraction(value as 'clay' | 'silt' | 'sand' | 'coarse' | null);
          }}
          orientation="vertical"
          size="large"
          aria-label="Seleção de fração de granulometria"
        />
      </div>
    </Accordion>
  );
}

