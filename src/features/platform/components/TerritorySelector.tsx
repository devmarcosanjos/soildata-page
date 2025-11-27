import { useState, useMemo, useEffect, useRef } from 'react';
import { SearchInput, Checkbox } from '@mapbiomas/ui';
import { ChevronRight } from 'lucide-react';

// Define the structure of our search results
export interface TerritoryResult {
  id: string;
  name: string;
  type: 'Country' | 'Biome' | 'Region' | 'State' | 'Municipality';
  feature: any; // Using any to avoid geojson type issues for now
}

interface TerritorySelectorProps {
  countryGeoJson: any;
  statesGeoJson: any;
  biomesGeoJson: any;
  municipalitiesGeoJson: any;
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

export function TerritorySelector({
  countryGeoJson,
  statesGeoJson,
  biomesGeoJson,
  municipalitiesGeoJson,
  onSelectTerritory,
  selectedTerritory,
}: TerritorySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('General result');
  const [tempSelected, setTempSelected] = useState<TerritoryResult | null>(selectedTerritory);
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

  // Flatten and index data for searching
  const allTerritories = useMemo(() => {
    const results: TerritoryResult[] = [];

    if (countryGeoJson?.features) {
      countryGeoJson.features.forEach((f: any) => {
        results.push({
          id: `country-${f.properties?.name || 'Brasil'}`,
          name: f.properties?.name || 'Brasil',
          type: 'Country',
          feature: f,
        });
      });
    }

    if (biomesGeoJson?.features) {
      biomesGeoJson.features.forEach((f: any) => {
        results.push({
          id: `biome-${f.properties?.name || f.properties?.Name || 'Unknown'}`,
          name: f.properties?.name || f.properties?.Name || 'Unknown',
          type: 'Biome',
          feature: f,
        });
      });
    }

    // Add Regions (Macro-regions)
    Object.keys(BRAZIL_REGIONS).forEach((regionName) => {
        results.push({
            id: `region-${regionName}`,
            name: regionName,
            type: 'Region',
            feature: null // We don't have direct geometry for regions yet, would need to merge states
        });
    });

    if (statesGeoJson?.features) {
      statesGeoJson.features.forEach((f: any) => {
        results.push({
          id: `state-${f.properties?.name || f.properties?.NM_UF || 'Unknown'}`,
          name: f.properties?.name || f.properties?.NM_UF || 'Unknown',
          type: 'State',
          feature: f,
        });
      });
    }

    if (municipalitiesGeoJson?.features) {
      municipalitiesGeoJson.features.forEach((f: any) => {
        results.push({
          id: `muni-${f.properties?.name || f.properties?.NM_MUN || 'Unknown'}`,
          name: f.properties?.name || f.properties?.NM_MUN || 'Unknown',
          type: 'Municipality',
          feature: f,
        });
      });
    }

    return results;
  }, [countryGeoJson, statesGeoJson, biomesGeoJson, municipalitiesGeoJson]);

  // Filter results based on search query
  const filteredResults = useMemo(() => {
    let results = allTerritories;
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      results = allTerritories.filter((t) =>
        t.name.toLowerCase().includes(lowerQuery)
      );
    }
    // Sort alphabetically
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
    { id: 'General result', label: 'General result', count: filteredResults.length },
    { id: 'Country', label: 'Country', count: groupedResults['Country']?.length || 0 },
    { id: 'Biome', label: 'Biome', count: groupedResults['Biome']?.length || 0 },
    { id: 'Region', label: 'Region', count: groupedResults['Region']?.length || 0 },
    { id: 'State', label: 'State', count: groupedResults['State']?.length || 0 },
    { id: 'Municipality', label: 'Municipality', count: groupedResults['Municipality']?.length || 0 },
  ];

  const displayedItems = useMemo(() => {
    if (activeCategory === 'General result') {
      return filteredResults.slice(0, 100); // Limit for performance
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
    <div className="relative w-full" ref={containerRef}>
      <div className="relative" onFocus={() => setIsOpen(true)}>
        <SearchInput
          key={selectedTerritory?.id || 'search-input'}
          placeholder="Search one or more territories"
          defaultValue={selectedTerritory?.name || searchQuery}
          onChange={(value: string) => {
            setSearchQuery(value);
            if (!isOpen) setIsOpen(true);
          }}
          className="w-full bg-white shadow-sm"
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 w-[800px] max-w-[90vw] z-[2000] overflow-hidden flex flex-col font-sans">
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
                        ? 'bg-[#E0F2F5] text-[#1F2937] font-bold border border-[#3B8C98] border-opacity-20'
                        : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        activeCategory === cat.id ? 'bg-[#3B8C98] text-white' : 'bg-[#4B5563] text-white'
                      }`}>
                        {cat.count > 999 ? '9,999+' : cat.count}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${activeCategory === cat.id ? 'text-[#3B8C98]' : 'text-gray-300'}`} />
                    </div>
                  </button>
                ))}
                {/* Mock Category for visual match */}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
              {/* Selection Summary */}
              {activeCategory === 'Country' ? (
                <div className="p-4 bg-[#F3F4F6] border-b border-gray-100 mx-4 mt-4 rounded-lg">
                  <div className="text-xs font-bold text-gray-700 mb-2">
                    Selection
                  </div>
                  <div className="text-sm text-gray-600">
                    By selecting all, "async.regions.1" will be visualized by "Country".
                  </div>
                </div>
              ) : (
                tempSelected && (
                  <div className="p-4 bg-[#F3F4F6] border-b border-gray-100 mx-4 mt-4 rounded-lg">
                    <div className="text-xs font-bold text-gray-700 mb-2">
                      Selection (1)
                    </div>
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={true}
                        onChange={() => setTempSelected(null)}
                        className="text-[#3B8C98] focus:ring-[#3B8C98]"
                      />
                      <span className="text-base font-medium text-gray-900">{tempSelected.name}</span>
                      <span className="text-xs bg-[#E0F2F5] text-[#3B8C98] px-2 py-1 rounded font-medium">
                        {tempSelected.type}
                      </span>
                    </div>
                  </div>
                )
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 bg-gray-100 px-2 py-1 rounded">
                  {activeCategory}
                </div>
                
                <div className="space-y-2">
                  {activeCategory === 'Country' && (
                     <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer group">
                        <Checkbox
                          checked={true} // Always checked for this specific view as per screenshot
                          onChange={() => {}}
                          className="w-5 h-5 rounded border-gray-300 text-[#C55B28] focus:ring-[#C55B28] bg-[#C55B28] border-[#C55B28]"
                        />
                        <span className="text-base text-gray-700 font-medium group-hover:text-gray-900">Select all</span>
                        <span className="text-xs bg-[#3B8C98] text-white px-2 py-0.5 rounded-full font-bold">1</span>
                     </div>
                  )}

                  {displayedItems.length > 0 ? (
                    displayedItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer group"
                        onClick={() => toggleSelection(item)}
                      >
                        <Checkbox
                          checked={tempSelected?.id === item.id || (activeCategory === 'Country' && item.name === 'Brasil')}
                          onChange={() => toggleSelection(item)}
                          className={`w-5 h-5 rounded border-gray-300 text-[#3B8C98] focus:ring-[#3B8C98] ${
                            (tempSelected?.id === item.id || (activeCategory === 'Country' && item.name === 'Brasil')) 
                            ? 'bg-[#3B8C98] border-[#3B8C98]' 
                            : ''
                          }`}
                        />
                        <span className="text-base text-gray-700 font-medium group-hover:text-gray-900">{item.name}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      No territories found
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-white">
                <div className="text-xs text-gray-500 max-w-xs">
                  {tempSelected 
                    ? 'When you select a territory from a different category, you will lose the previously selected territories.' 
                    : 'Select a territory to continue.'}
                </div>
                <button
                  onClick={handleApply}
                  disabled={!tempSelected}
                  className={`px-8 py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow-sm ${
                    tempSelected
                      ? 'bg-[#3B8C98] hover:bg-[#2A6B75] shadow-md'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
