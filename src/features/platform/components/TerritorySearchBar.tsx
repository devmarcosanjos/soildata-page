import { useState, useMemo, useEffect, useRef } from 'react';
import { SearchInput, Checkbox } from '@mapbiomas/ui';
import { ChevronRight } from 'lucide-react';
import type { TerritoryResult } from './TerritorySelector';

interface TerritorySearchBarProps {
  onSelectTerritory: (territory: TerritoryResult | null) => void;
  selectedTerritory: TerritoryResult | null;
}

const BRAZIL_REGIONS = {
  'Norte': ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'],
  'Nordeste': ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
  'Centro-Oeste': ['DF', 'GO', 'MT', 'MS'],
  'Sudeste': ['ES', 'MG', 'RJ', 'SP'],
  'Sul': ['PR', 'RS', 'SC']
};

export function TerritorySearchBar({
  onSelectTerritory,
  selectedTerritory,
}: TerritorySearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('General result');
  const [tempSelected, setTempSelected] = useState<TerritoryResult | null>(selectedTerritory);
  const [geoJsonData, setGeoJsonData] = useState<{
    country?: any;
    states?: any;
    biomes?: any;
    municipalities?: any;
  }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync temp selection when prop changes
  useEffect(() => {
    setTempSelected(selectedTerritory);
  }, [selectedTerritory]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Carregar GeoJSON apenas quando necessário (para busca de territórios)
  useEffect(() => {
    if (isOpen && Object.keys(geoJsonData).length === 0) {
      import('@/features/platform/data/geoJsonData').then(({ 
        getCountryGeoJson, 
        getStatesGeoJson, 
        getBiomesGeoJson 
      }) => {
        setGeoJsonData({
          country: getCountryGeoJson(),
          states: getStatesGeoJson(),
          biomes: getBiomesGeoJson(),
        });
      }).catch(err => console.error('Failed to load GeoJSON:', err));
    }
  }, [isOpen, geoJsonData]);

  // Lazy load municipalities only when needed
  useEffect(() => {
    if (isOpen && activeCategory === 'Municipality' && !geoJsonData.municipalities) {
      import('@/features/platform/data/geoJsonData').then(({ getMunicipalitiesGeoJson }) => {
        getMunicipalitiesGeoJson()
          .then(data => setGeoJsonData(prev => ({ ...prev, municipalities: data })))
          .catch(err => console.error('Failed to load Municipalities GeoJSON:', err));
      });
    }
  }, [isOpen, activeCategory, geoJsonData.municipalities]);

  // Flatten and index data for searching
  const allTerritories = useMemo(() => {
    const results: TerritoryResult[] = [];

    if (geoJsonData.country?.features) {
      geoJsonData.country.features.forEach((f: any) => {
        const name = f.properties?.name || 'Brasil';
        if (name !== 'Unknown') {
          results.push({
            id: `country-${name}`,
            name: name,
            type: 'Country',
            feature: f,
          });
        }
      });
    }

    if (geoJsonData.biomes?.features) {
      geoJsonData.biomes.features.forEach((f: any) => {
        const name = f.properties?.name || f.properties?.Name;
        if (name && name !== 'Unknown') {
          results.push({
            id: `biome-${name}`,
            name: name,
            type: 'Biome',
            feature: f,
          });
        }
      });
    }

    // Add Regions (Macro-regions)
    Object.keys(BRAZIL_REGIONS).forEach((regionName) => {
      results.push({
        id: `region-${regionName}`,
        name: regionName,
        type: 'Region',
        feature: null
      });
    });

    if (geoJsonData.states?.features) {
      geoJsonData.states.features.forEach((f: any) => {
        const name = f.properties?.name || f.properties?.NM_UF;
        if (name && name !== 'Unknown') {
          results.push({
            id: `state-${name}`,
            name: name,
            type: 'State',
            feature: f,
          });
        }
      });
    }

    if (geoJsonData.municipalities?.features) {
      geoJsonData.municipalities.features.forEach((f: any) => {
        const name = f.properties?.name || f.properties?.NM_MUN;
        if (name && name !== 'Unknown') {
          results.push({
            id: `muni-${name}`,
            name: name,
            type: 'Municipality',
            feature: f,
          });
        }
      });
    }

    return results;
  }, [geoJsonData]);

  // Filter results based on search query
  const filteredResults = useMemo(() => {
    let results = allTerritories;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      results = allTerritories.filter((t) =>
        t.name.toLowerCase().includes(lowerQuery)
      );
    }
    return results.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, allTerritories]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: Record<string, TerritoryResult[]> = {
      Country: [],
      Biome: [],
      Region: [],
      State: [],
      Municipality: [],
    };

    filteredResults.forEach((r) => {
      if (groups[r.type]) {
        groups[r.type].push(r);
      }
    });

    return groups;
  }, [filteredResults]);

  const categories = [
    { id: 'General result', label: 'Resultado geral', count: filteredResults.length },
    { id: 'Country', label: 'País', count: groupedResults['Country']?.length || 0 },
    { id: 'Biome', label: 'Bioma', count: groupedResults['Biome']?.length || 0 },
    { id: 'Region', label: 'Região', count: groupedResults['Region']?.length || 0 },
    { id: 'State', label: 'Estado', count: groupedResults['State']?.length || 0 },
    { id: 'Municipality', label: 'Município', count: groupedResults['Municipality']?.length || 0 },
  ];

  const displayedItems = useMemo(() => {
    if (activeCategory === 'General result') {
      return filteredResults.slice(0, 100);
    }
    return groupedResults[activeCategory] || [];
  }, [activeCategory, filteredResults, groupedResults]);

  const handleApply = () => {
    onSelectTerritory(tempSelected);
    setIsOpen(false);
  };

  const toggleSelection = (item: TerritoryResult) => {
    if (tempSelected?.id === item.id) {
      setTempSelected(null);
    } else {
      setTempSelected(item);
    }
  };



  return (
    <div className="flex items-center gap-4" ref={containerRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative" onFocus={() => setIsOpen(true)}>
          <SearchInput
            key={selectedTerritory?.id || 'search-input'}
            placeholder="Buscar um ou mais territórios"
            defaultValue={selectedTerritory?.name || searchQuery}
            onChange={(value: string) => {
              setSearchQuery(value);
              if (!isOpen) setIsOpen(true);
            }}
            className="w-[320px] bg-white shadow-sm"
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 w-[800px] max-w-[90vw] z-[500] overflow-hidden flex flex-col font-sans">
            <div className="flex h-[500px]">
              {/* Sidebar Categories */}
              <div className="w-64 flex-shrink-0 border-r border-gray-100 overflow-y-auto bg-white py-2">
                <div className="px-2 space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm transition-all ${
                        activeCategory === cat.id
                          ? 'bg-[#FED7AA] text-[#1F2937] font-bold border border-[#C55B28] border-opacity-20'
                          : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                          activeCategory === cat.id ? 'bg-[#C55B28] text-white' : 'bg-[#4B5563] text-white'
                        }`}>
                          {cat.count > 999 ? '9,999+' : cat.count}
                        </span>
                        <ChevronRight className={`w-4 h-4 ${activeCategory === cat.id ? 'text-[#C55B28]' : 'text-gray-300'}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col min-w-0 bg-white">
                {/* Selection Summary */}
                {tempSelected && (
                  <div className="p-4 bg-[#F3F4F6] border-b border-gray-100 mx-4 mt-4 rounded-lg">
                    <div className="text-xs font-bold text-gray-700 mb-2">
                      Seleção (1)
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={true}
                        onChange={() => setTempSelected(null)}
                        className="text-[#C55B28] focus:ring-[#C55B28]"
                      />
                      <span className="text-base font-medium text-gray-900">{tempSelected.name}</span>
                      <span className="text-xs bg-[#FED7AA] text-[#C55B28] px-2 py-1 rounded font-medium">
                        {tempSelected.type}
                      </span>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 bg-gray-100 px-2 py-1 rounded">
                    {activeCategory}
                  </div>
                  
                  <div className="space-y-2">
                    {displayedItems.length > 0 ? (
                      displayedItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer group"
                          onClick={() => toggleSelection(item)}
                        >
                          <Checkbox
                            checked={tempSelected?.id === item.id}
                            onChange={() => toggleSelection(item)}
                            className={`w-5 h-5 rounded border-gray-300 text-[#C55B28] focus:ring-[#C55B28] ${
                              tempSelected?.id === item.id
                              ? 'bg-[#C55B28] border-[#C55B28]' 
                              : ''
                            }`}
                          />
                          <span className="text-base text-gray-700 font-medium group-hover:text-gray-900">{item.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-400 text-sm">
                        Nenhum território encontrado
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white">
                  <div className="text-xs text-gray-500 max-w-xs">
                    {tempSelected 
                      ? 'Ao selecionar um território de uma categoria diferente, você perderá os territórios selecionados anteriormente.' 
                      : 'Selecione um território para continuar.'}
                  </div>
                  <button
                    onClick={handleApply}
                    disabled={!tempSelected}
                    className={`px-8 py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-sm ${
                      tempSelected
                        ? 'bg-[#C55B28] hover:bg-[#A04820] shadow-md'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
