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
          {/* @ts-ignore - Switch typing from @mapbiomas/ui */}
          <Switch
            size="small"
            aria-label="Alternar visualização agregada por bioma"
            isSelected={aggregateByBiome}
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
