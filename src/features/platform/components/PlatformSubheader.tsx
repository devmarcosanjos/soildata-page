import { TerritorySearchBar } from './TerritorySearchBar';
import { usePlatformStore } from '@/stores/platformStore';
import type { TerritoryResult } from './TerritorySelector';

export function PlatformSubheader() {
  const {
    selectedTerritory,
    setSelectedTerritory,
    groupingValue,
    setGroupingValue,
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
    <div className="w-full">
      <TerritorySearchBar
        onSelectTerritory={handleTerritorySelect}
        selectedTerritory={selectedTerritory}
      />
    </div>
  );
}
