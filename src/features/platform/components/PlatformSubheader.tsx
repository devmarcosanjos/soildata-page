import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TerritorySearchBar } from './TerritorySearchBar';
import { Switch } from '@mapbiomas/ui';
import { usePlatformStore } from '@/stores/platformStore';
import type { TerritoryResult } from './TerritorySelector';

export function PlatformSubheader() {
  const {
    selectedTerritory,
    setSelectedTerritory,
    groupingValue,
    setGroupingValue,
    aggregateByBiome,
    setAggregateByBiome,
  } = usePlatformStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Ler território da URL sempre que a URL mudar (URL é a fonte de verdade)
  useEffect(() => {
    const territoryType = searchParams.get('territoryType');
    // URLSearchParams.get() já retorna o valor decodificado
    const territoryName = searchParams.get('territoryName');
    
    if (territoryType && territoryName) {
      // Sempre atualizar se a URL mudou (comparar com o que está no store)
      const currentTerritoryKey = selectedTerritory ? `${selectedTerritory.type}-${selectedTerritory.name}` : null;
      const urlTerritoryKey = `${territoryType}-${territoryName}`;
      
      if (currentTerritoryKey !== urlTerritoryKey) {
        console.log(`🔄 [PlatformSubheader] Atualizando território da URL: ${territoryType} - ${territoryName}`);
        const territory: TerritoryResult = {
          id: `${territoryType.toLowerCase()}-${territoryName}`,
          name: territoryName,
          type: territoryType as TerritoryResult['type'],
          feature: null,
        };
        setSelectedTerritory(territory);
      }
    } else {
      // Se não há parâmetros na URL, garantir que Brasil está selecionado
      if (!selectedTerritory || selectedTerritory.type !== 'Country' || selectedTerritory.name !== 'Brasil') {
        const brasilTerritory: TerritoryResult = {
          id: 'country-Brasil',
          name: 'Brasil',
          type: 'Country',
          feature: null,
        };
        setSelectedTerritory(brasilTerritory);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Apenas searchParams como dependência - selectedTerritory é usado apenas para comparação

  // Sincronizar com a URL quando o território mudar
  useEffect(() => {
    if (selectedTerritory) {
      searchParams.set('territoryType', selectedTerritory.type);
      // URLSearchParams.set() já codifica automaticamente, não precisa encodeURIComponent
      searchParams.set('territoryName', selectedTerritory.name);
      setSearchParams(searchParams, { replace: true });
    } else {
      searchParams.delete('territoryType');
      searchParams.delete('territoryName');
      setSearchParams(searchParams, { replace: true });
    }
  }, [selectedTerritory, searchParams, setSearchParams]);

  const handleTerritorySelect = (territory: TerritoryResult | null) => {
    setSelectedTerritory(territory);

    if (territory) {
      switch (territory.type) {
        case 'State':
          setGroupingValue('estados');
          break;
        case 'Biome':
          setGroupingValue('biomas');
          break;
        case 'Municipality':
          setGroupingValue('municipios');
          break;
        case 'Country':
        case 'Region':
        default:
          if (groupingValue === 'pais') {
            setGroupingValue('biomas');
          }
          break;
      }
    } else {
      if (groupingValue === 'pais') {
        setGroupingValue('biomas');
      }
    }
  };

  return (
    <div className="w-full space-y-3">
      <TerritorySearchBar
        onSelectTerritory={handleTerritorySelect}
        selectedTerritory={selectedTerritory}
      />
      <div className="flex justify-end pr-2">
        <div className="bg-white/95 rounded-full shadow-sm px-4 py-1.5 flex items-center gap-3 border border-gray-200">
          <span className="text-xs font-medium text-gray-700">
            Agregar pontos por bioma
          </span>
          <Switch
            aria-label="Alternar visualização agregada por bioma"
            checked={aggregateByBiome}
            onChange={(value: boolean) => {
              setAggregateByBiome(value);
              // Quando desativar agregação, voltar a mostrar todos os pontos (Brasil inteiro)
              if (!value) {
                setSelectedTerritory(null);
                setGroupingValue('biomas');
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
