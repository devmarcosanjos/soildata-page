import { useState, useMemo, useEffect, useRef } from 'react';
import { Checkbox } from '@mapbiomas/ui';
import { ChevronRight } from 'lucide-react';
import type { TerritoryResult } from './TerritorySelector';
import {
  getGranulometryFilters,
} from '@/services/granulometryApi';

interface TerritorySearchBarProps {
  onSelectTerritory: (territory: TerritoryResult | null) => void;
  selectedTerritory: TerritoryResult | null;
}

export function TerritorySearchBar({
  onSelectTerritory,
  selectedTerritory,
}: TerritorySearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Country');
  const [tempSelected, setTempSelected] = useState<TerritoryResult | null>(selectedTerritory);
  const [territoriesData, setTerritoriesData] = useState<{
    biomes?: string[];
    estados?: string[];
    municipios?: string[];
    regioes?: string[];
    loading: boolean;
  }>({ loading: false });
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

  // Carregar todos os territórios da API quando o dropdown for aberto
  useEffect(() => {
    if (isOpen && !territoriesData.loading && (!territoriesData.biomes || !territoriesData.municipios)) {
      setTerritoriesData(prev => ({ ...prev, loading: true }));
      
      console.log('🔄 [TerritorySearchBar] Carregando todos os territórios da API...');
      
      getGranulometryFilters()
        .then(response => {
          if (response.success && response.filters) {
            console.log('✅ [TerritorySearchBar] Territórios carregados:', {
              biomes: response.filters.biomes?.length || 0,
              estados: response.filters.states?.length || 0,
              regioes: response.filters.regions?.length || 0,
              municipios: response.filters.municipalities?.length || 0,
            });
            
            setTerritoriesData({
              biomes: response.filters.biomes || [],
              estados: response.filters.states || [],
              regioes: response.filters.regions || [],
              municipios: response.filters.municipalities || [],
              loading: false,
            });
          } else {
            console.error('❌ [TerritorySearchBar] Resposta inválida da API:', response);
            setTerritoriesData(prev => ({ ...prev, loading: false }));
          }
        })
        .catch(err => {
          console.error('❌ [TerritorySearchBar] Erro ao carregar territórios da API:', err);
          setTerritoriesData(prev => ({ ...prev, loading: false }));
        });
    }
  }, [isOpen, territoriesData.loading, territoriesData.biomes, territoriesData.municipios]);

  // Flatten and index data for searching
  const allTerritories = useMemo(() => {
    const results: TerritoryResult[] = [];

    // País (Brasil)
    results.push({
      id: 'country-Brasil',
      name: 'Brasil',
      type: 'Country',
      feature: null,
    });

    // Biomas da API
    if (territoriesData.biomes) {
      territoriesData.biomes.forEach((biome) => {
        results.push({
          id: `biome-${biome}`,
          name: biome,
          type: 'Biome',
          feature: null,
        });
      });
    }

    // Regiões da API
    if (territoriesData.regioes) {
      territoriesData.regioes.forEach((regiao) => {
        results.push({
          id: `region-${regiao}`,
          name: regiao,
          type: 'Region',
          feature: null,
        });
      });
    }

    // Estados da API
    if (territoriesData.estados) {
      territoriesData.estados.forEach((estado) => {
        results.push({
          id: `state-${estado}`,
          name: estado,
          type: 'State',
          feature: null,
        });
      });
    }

    // Municípios da API (carregados sob demanda)
    if (territoriesData.municipios) {
      territoriesData.municipios.forEach((municipio) => {
        results.push({
          id: `muni-${municipio}`,
          name: municipio,
          type: 'Municipality',
          feature: null,
        });
      });
    }

    return results;
  }, [territoriesData]);

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
    { id: 'Country', label: 'País', count: groupedResults['Country']?.length || 0 },
    { id: 'Biome', label: 'Bioma', count: groupedResults['Biome']?.length || 0 },
    { id: 'Region', label: 'Região', count: groupedResults['Region']?.length || 0 },
    { id: 'State', label: 'Estado', count: groupedResults['State']?.length || 0 },
    { id: 'Municipality', label: 'Município', count: groupedResults['Municipality']?.length || 0 },
  ];

  const displayedItems = useMemo(() => {
    return groupedResults[activeCategory] || [];
  }, [activeCategory, groupedResults]);

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
    <div className="flex items-center justify-start w-full max-w-[800px]" ref={containerRef}>
      {/* Search Input */}
      <div className="relative w-full">
        <div className="relative" onFocus={() => setIsOpen(true)}>
          <input
            key={selectedTerritory?.id || 'search-input'}
            type="text"
            placeholder="Pesquise um ou mais territórios"
            defaultValue={selectedTerritory?.name || searchQuery}
            onChange={(event) => {
              const value = event.target.value;
              setSearchQuery(value);
              if (!isOpen) setIsOpen(true);
            }}
            className="w-full text-left bg-white shadow-none rounded-full border border-[#D1D5DB] px-5 py-2 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C55B28]/40 focus:border-[#C55B28]"
            aria-label="Buscar territórios (biomas, estados, municípios ou regiões)"
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-[90vw] z-500 overflow-hidden flex flex-col font-sans">
            <div className="flex h-[500px]">
              {/* Sidebar Categories */}
              <div className="w-64 shrink-0 border-r border-gray-100 overflow-y-auto bg-white py-2">
                <div className="px-2 space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      aria-label={`Filtrar por ${cat.label}`}
                      aria-pressed={activeCategory === cat.id}
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
                          {cat.count > 9999 
                            ? `${Math.floor(cat.count / 1000)}k+` 
                            : cat.count.toLocaleString('pt-BR')}
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
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={true}
                        onChange={() => setTempSelected(null)}
                        className="text-[#C55B28] focus:ring-[#C55B28]"
                        aria-label={`Desmarcar seleção de ${tempSelected.name}`}
                      />
                      <span className="text-base font-medium text-gray-900">{tempSelected.name}</span>
                      <span className="text-xs bg-[#FED7AA] text-[#C55B28] px-2 py-1 rounded font-medium">
                        {tempSelected.type}
                      </span>
                    </label>
                  </div>
                )}

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 bg-gray-100 px-2 py-1 rounded">
                    {activeCategory}
                  </div>
                  
                  <div className="space-y-2">
                    {territoriesData.loading ? (
                      <div className="p-8 text-center text-gray-400 text-sm">
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C55B28]"></div>
                          <span>Carregando territórios...</span>
                        </div>
                      </div>
                    ) : displayedItems.length > 0 ? (
                      displayedItems.map((item) => {
                        const isSelected = tempSelected?.id === item.id;
                        const itemId = `territory-item-${item.id}`;
                        return (
                          <label
                            key={item.id}
                            id={itemId}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer group"
                          >
                            <Checkbox
                              checked={isSelected}
                              onChange={() => toggleSelection(item)}
                              className={`w-5 h-5 rounded border-gray-300 text-[#C55B28] focus:ring-[#C55B28] ${
                                isSelected
                                ? 'bg-[#C55B28] border-[#C55B28]' 
                                : ''
                              }`}
                              aria-labelledby={itemId}
                            />
                            <span className="text-base text-gray-700 font-medium group-hover:text-gray-900">{item.name}</span>
                          </label>
                        );
                      })
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
                    aria-label={tempSelected ? `Aplicar seleção de ${tempSelected.name}` : 'Aplicar seleção (nenhum território selecionado)'}
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
