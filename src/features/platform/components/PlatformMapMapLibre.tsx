import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapLayout, CompassControl, ZoomControl, Button, Switch } from '@mapbiomas/ui';
import { MountainIcon } from 'lucide-react';
import { TooltipTrigger, Tooltip } from 'react-aria-components';
import { soloDatasetLoaders, PSD_PLATFORM_DATASET_ID, loadPSDPlatformWithFilters } from '@/features/platform/data/soloDatasets';
import type { SoloDatasetPoint } from '@/features/platform/data/soloDatasets';
import { TerritorySearchBar } from './TerritorySearchBar';
import type { TerritoryResult } from './TerritorySelector';
import { MarkerPopup } from './MarkerPopup';
import { usePlatformStore } from '@/stores/platformStore';
import {
  getTerritoryGeoJSON,
  getPropertiesByPoint,
  getTerritoriesByPoint,
  getPixelHistoryByPoint,
  type MapBiomasPixelHistoryItem,
  type MapBiomasPropertyAtPoint,
  type MapBiomasTerritoryAtPoint,
} from '@/services/psdPlatformApi';
import bbox from '@turf/bbox';
import { points, featureCollection } from '@turf/helpers';
import type { FeatureCollection, Feature, Geometry, Point } from 'geojson';
import { searchDatasets } from '@/services/datasetsApi';
import type { Dataset } from '@/types/dataset';

interface ClickInfoState {
  lngLat: [number, number];
  datasetPoint?: SoloDatasetPoint | null;
  relatedSamples?: SoloDatasetPoint[];
  datasetDetails?: Dataset | null;
  datasetDetailsLoading?: boolean;
  datasetDetailsError?: string | null;
  properties?: MapBiomasPropertyAtPoint[];
  territories?: MapBiomasTerritoryAtPoint[];
  pixelHistory?: MapBiomasPixelHistoryItem[];
  isLoading: boolean;
  error?: string | null;
}

// Normaliza respostas diversas da API MapBiomas para um FeatureCollection válido
function normalizeTerritoryFeatureCollection(
  geoJSON: any
): FeatureCollection | null {
  if (!geoJSON) return null;

  // Desembrulhar se vier aninhado em data/bounds
  if (geoJSON.data) {
    return normalizeTerritoryFeatureCollection(geoJSON.data);
  }

  if (geoJSON.bounds) {
    return normalizeTerritoryFeatureCollection(geoJSON.bounds);
  }

  // FeatureCollection direto
  if (
    geoJSON.type === 'FeatureCollection' &&
    Array.isArray(geoJSON.features) &&
    geoJSON.features.length > 0
  ) {
    return geoJSON as FeatureCollection;
  }

  // Feature único
  if (geoJSON.type === 'Feature' && geoJSON.geometry) {
    return {
      type: 'FeatureCollection',
      features: [geoJSON as Feature],
    };
  }

  // Geometry direto (Polygon, MultiPolygon, etc.)
  if (
    typeof geoJSON.type === 'string' &&
    Array.isArray(geoJSON.coordinates)
  ) {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: geoJSON as Geometry,
          properties: {},
        },
      ],
    };
  }

  // Objeto com geometry interno
  if (
    geoJSON.geometry &&
    typeof geoJSON.geometry === 'object' &&
    typeof geoJSON.geometry.type === 'string' &&
    Array.isArray(geoJSON.geometry.coordinates)
  ) {
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: geoJSON.geometry as Geometry,
          properties: geoJSON.properties || {},
        },
      ],
    };
  }

  // Array de features
  if (Array.isArray(geoJSON) && geoJSON.length > 0) {
    return {
      type: 'FeatureCollection',
      features: geoJSON as Feature[],
    };
  }

  console.warn(
    '⚠️ [GeoJSON Normalize] Formato de GeoJSON não reconhecido:',
    geoJSON
  );
  return null;
}

// MapStatistics exportado para compatibilidade
export interface MapStatistics {
  totalDatasets: number;
  totalSamples: number;
  totalLocations: number;
  totalProperties: number;
  territoryName: string;
}

interface PlatformMapProps {
  selectedDatasetId: string;
  onStatisticsChange?: (stats: MapStatistics) => void;
}

// Mapeamento de groupingValue para divisionCategoryId do MapBiomas
const GROUPING_TO_DIVISION_CATEGORY: Record<string, number> = {
  'biomas': 4,
  'estados': 3,
  'municipios': 95,
};

// Paleta de cores por bioma (tonalidades SoloData)
// Nomes baseados nos atributos "name", "Name" ou "NM_BIOMA" dos tiles de bioma
const BIOME_FILL_EXPRESSION: any = [
  'case',
  [
    'any',
    ['==', ['get', 'name'], 'Amazônia'],
    ['==', ['get', 'Name'], 'Amazônia'],
    ['==', ['get', 'NM_BIOMA'], 'Amazônia'],
  ],
  '#FFE8D6', // Amazônia - laranja muito claro
  [
    'any',
    ['==', ['get', 'name'], 'Cerrado'],
    ['==', ['get', 'Name'], 'Cerrado'],
    ['==', ['get', 'NM_BIOMA'], 'Cerrado'],
  ],
  '#FED7AA', // Cerrado
  [
    'any',
    ['==', ['get', 'name'], 'Mata Atlântica'],
    ['==', ['get', 'Name'], 'Mata Atlântica'],
    ['==', ['get', 'NM_BIOMA'], 'Mata Atlântica'],
  ],
  '#FFE4CF', // Mata Atlântica
  [
    'any',
    ['==', ['get', 'name'], 'Caatinga'],
    ['==', ['get', 'Name'], 'Caatinga'],
    ['==', ['get', 'NM_BIOMA'], 'Caatinga'],
  ],
  '#FECACA', // Caatinga
  [
    'any',
    ['==', ['get', 'name'], 'Pampa'],
    ['==', ['get', 'Name'], 'Pampa'],
    ['==', ['get', 'NM_BIOMA'], 'Pampa'],
  ],
  '#E5E7EB', // Pampa
  [
    'any',
    ['==', ['get', 'name'], 'Pantanal'],
    ['==', ['get', 'Name'], 'Pantanal'],
    ['==', ['get', 'NM_BIOMA'], 'Pantanal'],
  ],
  '#FDE68A', // Pantanal
  '#F3F4F6', // Cor padrão para biomas desconhecidos
];

// Componente para renderizar highlight do território usando Vector Tiles do MapBiomas
function TerritoryHighlightVectorTiles({ 
  territory, 
  divisionCategoryId,
  mapRef
}: { 
  territory: TerritoryResult; 
  divisionCategoryId: number | null;
  mapRef: React.RefObject<MapRef>;
}) {
  const [territoryId, setTerritoryId] = useState<number | null>(null);

  // Efeito para inspecionar as propriedades dos vector tiles e encontrar o ID do território
  useEffect(() => {
    if (!mapRef.current || !divisionCategoryId) return;
    const mapInstance = mapRef.current.getMap();
    const territoryName = territory.name;

    console.log(`🔍 [Vector Tiles Highlight] Procurando território: "${territoryName}"`);

    // Função para inspecionar features e encontrar o território
    const findTerritory = () => {
      try {
        // Tentar usar o source base primeiro (já existe)
        let source = mapInstance.getSource('mapbiomas-territories');
        let sourceId = 'mapbiomas-territories';
        
        // Se não existir, tentar o source do highlight
        if (!source) {
          source = mapInstance.getSource('territory-highlight-vectortiles');
          sourceId = 'territory-highlight-vectortiles';
        }
        
        if (!source) {
          console.log('⚠️ [Vector Tiles Highlight] Nenhum source encontrado ainda');
          return;
        }

        // Tentar encontrar o território consultando features do source
        const features = mapInstance.querySourceFeatures(sourceId, {
          sourceLayer: 'default',
        });

        console.log(`📋 [Vector Tiles Highlight] Total de features encontradas: ${features.length}`);

        // Procurar o território pelo nome nas propriedades
        for (const feature of features) {
          const props = feature.properties || {};
          const propsKeys = Object.keys(props);
          
          // Log das primeiras features para debug
          if (features.indexOf(feature) < 3) {
            console.log(`📋 [Vector Tiles Highlight] Exemplo de propriedades:`, props);
            console.log(`📋 [Vector Tiles Highlight] Chaves disponíveis:`, propsKeys);
          }

          // Tentar diferentes propriedades para encontrar o nome
          const nameMatches = 
            props.name === territoryName ||
            props.Name === territoryName ||
            props.NM_UF === territoryName ||
            props.NM_MUN === territoryName ||
            props.nome === territoryName ||
            props.NOME === territoryName ||
            (props.name && props.name.toLowerCase() === territoryName.toLowerCase()) ||
            (props.Name && props.Name.toLowerCase() === territoryName.toLowerCase());

          if (nameMatches) {
            console.log(`✅ [Vector Tiles Highlight] Território encontrado! ID: ${feature.id}, Propriedades:`, props);
            setTerritoryId(feature.id as number);
            return;
          }
        }

        console.warn(`⚠️ [Vector Tiles Highlight] Território "${territoryName}" não encontrado nas features`);
      } catch (error) {
        console.warn('⚠️ [Vector Tiles Highlight] Erro ao inspecionar features:', error);
      }
    };

    // Aguardar o source carregar
    const checkSource = () => {
      const source1 = mapInstance.getSource('mapbiomas-territories');
      const source2 = mapInstance.getSource('territory-highlight-vectortiles');
      if (source1 || source2) {
        // Aguardar um pouco para os tiles carregarem
        setTimeout(findTerritory, 1000);
      }
    };

    // Verificar periodicamente se o source está disponível
    const interval = setInterval(checkSource, 200);
    setTimeout(() => clearInterval(interval), 5000);

    // Também tentar quando o mapa carregar dados
    mapInstance.on('sourcedata', findTerritory);
    
    return () => {
      clearInterval(interval);
      mapInstance.off('sourcedata', findTerritory);
    };
  }, [mapRef, divisionCategoryId, territory.name]);

  // Quando encontrarmos o ID do território via vector tiles,
  // buscar os bounds oficiais da API MapBiomas e aplicar fitBounds no mapa
  useEffect(() => {
    if (!mapRef.current || territoryId === null) return;

    const mapInstance = mapRef.current.getMap();
    const territoryName = territory.name;
    const id = territoryId;

    const fetchAndFitBounds = async () => {
      try {
        const url = `https://prd.plataforma.mapbiomas.org/api/v1/brazil/territories/bounds?territoryId=${id}`;
        console.log(`🌐 [Vector Tiles Highlight] Buscando bounds do território ID=${id} (${territoryName}): ${url}`);

        const response = await fetch(url, {
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          console.warn(
            `⚠️ [Vector Tiles Highlight] HTTP ${response.status} ao buscar bounds para território ID=${id} (${territoryName})`
          );
          return;
        }

        const data = await response.json();

        if (!data || !data.bounds) {
          console.warn(
            '⚠️ [Vector Tiles Highlight] Resposta de bounds não possui propriedade "bounds":',
            data
          );
          return;
        }

        const geometry = data.bounds as Geometry;

        const bounds = bbox({
          type: 'Feature',
          geometry,
          properties: {},
        } as Feature);

        console.log(
          `✅ [Vector Tiles Highlight] Bounds recebidos para território ID=${id} (${territoryName}):`,
          bounds
        );

        mapInstance.fitBounds(
          [
            [bounds[0], bounds[1]],
            [bounds[2], bounds[3]],
          ] as [[number, number], [number, number]],
          {
            padding: 50,
            maxZoom: 12,
            duration: 1200,
          }
        );
      } catch (error) {
        console.error(
          `❌ [Vector Tiles Highlight] Erro ao buscar/aplicar bounds para território ID=${id} (${territoryName})`,
          error
        );
      }
    };

    fetchAndFitBounds();
  }, [territoryId, mapRef, territory.name]);

  if (!divisionCategoryId) {
    console.log('⚠️ [Vector Tiles Highlight] divisionCategoryId não disponível');
    return null;
  }

  console.log(`🗺️ [Vector Tiles Highlight] Criando highlight para ${territory.type}: ${territory.name} com divisionCategoryId: ${divisionCategoryId}`);

  // Se encontramos o ID, usar filtro por ID (mais confiável)
  // Caso contrário, tentar filtrar por nome
  const territoryName = territory.name;
  const filterExpression = territoryId !== null
    ? ['==', '$id', territoryId] // Filtrar por ID se encontrado
    : [
        'any',
        ['==', ['get', 'name'], territoryName],
        ['==', ['get', 'Name'], territoryName],
        ['==', ['get', 'NM_UF'], territoryName],
        ['==', ['get', 'NM_MUN'], territoryName],
        ['==', ['get', 'nome'], territoryName],
        ['==', ['get', 'NOME'], territoryName],
        ['==', ['downcase', ['get', 'name']], territoryName.toLowerCase()],
        ['==', ['downcase', ['get', 'Name']], territoryName.toLowerCase()],
      ] as unknown as maplibregl.FilterSpecification;

  console.log(`🎨 [Vector Tiles Highlight] Filtro aplicado:`, filterExpression);
  console.log(`🎨 [Vector Tiles Highlight] Usando ID: ${territoryId !== null ? territoryId : 'não encontrado'}`);

  return (
    <Source
      id="territory-highlight-vectortiles"
      type="vector"
      tiles={[`https://prd.plataforma.mapbiomas.org/api/v1/brazil/territories/tiles/{z}/{x}/{y}.mvt?divisionCategoryId=${divisionCategoryId}`]}
      minzoom={0}
      maxzoom={14}
    >
      {/* Camada de preenchimento do território selecionado */}
      <Layer
        id="territory-highlight-fill"
        type="fill"
        source-layer="default"
        filter={filterExpression as maplibregl.FilterSpecification}
        beforeId="all-points"
        paint={{
          'fill-color': '#F97316', // Laranja vibrante
          'fill-opacity': 0.7, // Opacidade alta para destaque máximo
        }}
      />
      {/* Contorno do território selecionado */}
      <Layer
        id="territory-highlight-outline"
        type="line"
        source-layer="default"
        filter={filterExpression as maplibregl.FilterSpecification}
        beforeId="territory-highlight-fill"
        paint={{
          'line-color': '#C55B28', // Cor laranja escura do tema
          'line-width': 6, // Largura grande para destaque máximo
          'line-opacity': 1.0, // Opacidade total
        }}
      />
    </Source>
  );
}

// Componente para renderizar highlight do território usando GeoJSON (método principal)
function TerritoryHighlightGeoJSON({ 
  territory, 
  geoJSON 
}: { 
  territory: TerritoryResult; 
  geoJSON: FeatureCollection | Feature | Geometry | null;
}) {
  // Normalizar GeoJSON se necessário
  const normalizedGeoJSON = useMemo(() => {
    console.log('🎨 [GeoJSON Highlight] Renderizando highlight para:', territory.name);
    console.log('🎨 [GeoJSON Highlight] GeoJSON recebido:', geoJSON);
    
    if (!geoJSON) {
      console.warn('⚠️ [GeoJSON Highlight] GeoJSON é null ou undefined');
      return null;
    }

    const normalized = normalizeTerritoryFeatureCollection(geoJSON);
    if (!normalized) {
      console.warn('⚠️ [GeoJSON Highlight] Não foi possível normalizar o GeoJSON');
      return null;
    }

    console.log(
      '✅ [GeoJSON Highlight] GeoJSON normalizado para FeatureCollection',
      {
        type: normalized.type,
        featuresCount: normalized.features?.length ?? 0,
      }
    );

    return normalized;
  }, [geoJSON, territory.name]);

  if (!normalizedGeoJSON) {
    console.warn('⚠️ [GeoJSON Highlight] Não foi possível normalizar o GeoJSON');
    return null;
  }

  console.log('✅ [GeoJSON Highlight] GeoJSON normalizado, renderizando camadas');
  console.log('📊 [GeoJSON Highlight] Dados normalizados:', {
    type: normalizedGeoJSON.type,
    featuresCount: normalizedGeoJSON.features?.length || 0,
    firstFeature: normalizedGeoJSON.features?.[0] ? {
      type: normalizedGeoJSON.features[0].type,
      geometryType: normalizedGeoJSON.features[0].geometry?.type
    } : null
  });

  return (
    <Source 
      id="territory-highlight-geojson" 
      type="geojson" 
      data={normalizedGeoJSON as FeatureCollection}
    >
      {/* Camada de preenchimento principal - cor vibrante e opaca */}
      <Layer
        id="territory-geojson-fill"
        type="fill"
        beforeId="all-points" // Renderizar antes dos pontos para garantir visibilidade
        paint={{
          'fill-color': '#F97316', // Laranja vibrante
          'fill-opacity': 0.8, // Aumentado para 0.8 para máximo destaque
        }}
      />
      {/* Contorno externo grosso para destaque máximo */}
      <Layer
        id="territory-geojson-outline"
        type="line"
        paint={{
          'line-color': '#C55B28', // Cor laranja escura do tema
          'line-width': 8, // Aumentado para 8 para máximo destaque
          'line-opacity': 1.0, // Opacidade total
        }}
      />
    </Source>
  );
}

function ClickInfoPopupContent({ info }: { info: ClickInfoState }) {
  const {
    lngLat,
    datasetPoint,
    relatedSamples,
    datasetDetails,
    datasetDetailsLoading,
    datasetDetailsError,
    properties,
    territories,
    pixelHistory,
    isLoading,
    error,
  } = info;

  const [activeTab, setActiveTab] = useState<'soildata' | 'context'>('soildata');

  const formatLat = lngLat[1].toFixed(5);
  const formatLng = lngLat[0].toFixed(5);

  const municipality = territories?.find(
    (t) =>
      t.category?.id === 95 ||
      t.category?.name?.['pt-BR']?.toLowerCase() === 'município' ||
      t.category?.name?.['pt-BR']?.toLowerCase() === 'municipio'
  );

  const biome = territories?.find(
    (t) =>
      t.category?.id === 4 ||
      t.category?.name?.['pt-BR']?.toLowerCase() === 'bioma'
  );

  const region = territories?.find(
    (t) =>
      t.category?.id === 2 ||
      t.category?.name?.['pt-BR']?.toLowerCase() === 'região' ||
      t.category?.name?.['pt-BR']?.toLowerCase() === 'regiao'
  );

  const samplesForPoint = (() => {
    if (!datasetPoint) return [];
    if (Array.isArray(relatedSamples) && relatedSamples.length > 0) {
      return relatedSamples;
    }
    return [datasetPoint];
  })();

  const depthLayers = samplesForPoint
    .filter((p) => typeof p.depth === 'number' && p.depth !== null)
    .sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0));

  const maxDepth = depthLayers.reduce(
    (max, p) => Math.max(max, p.depth ?? 0),
    0
  );

  const displayTitle =
    datasetDetails?.title ||
    datasetPoint?.title ||
    datasetPoint?.datasetCode?.toUpperCase();

  const displayDoi =
    datasetDetails?.doi || datasetPoint?.doi || undefined;

  const datasetLink =
    datasetDetails?.url ||
    datasetPoint?.datasetUrl ||
    (displayDoi
      ? `https://soildata.mapbiomas.org/dataset.xhtml?persistentId=${displayDoi}`
      : '#');

  const pixelSummary = useMemo(() => {
    if (!pixelHistory || pixelHistory.length === 0) return null;

    const sorted = [...pixelHistory].sort((a, b) => a.year - b.year);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    let firstChangeYear: number | null = null;
    let previousValue = first.pixelValue;

    for (let i = 1; i < sorted.length; i += 1) {
      const current = sorted[i];
      if (current.pixelValue !== previousValue) {
        firstChangeYear = current.year;
        break;
      }
      previousValue = current.pixelValue;
    }

    return {
      firstYear: first.year,
      lastYear: last.year,
      firstValue: first.pixelValue,
      lastValue: last.pixelValue,
      firstChangeYear,
    };
  }, [pixelHistory]);

  const selectedPointBlock = (
    <div className="pt-3 border-t border-gray-100 mt-2">
      <div className="text-[11px] md:text-xs uppercase tracking-wide text-gray-500">
        Ponto selecionado
      </div>
      <div className="text-sm md:text-base font-mono text-gray-900">
        lat {formatLat}, lng {formatLng}
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col gap-4 text-sm md:text-base max-w-lg p-4 md:p-5"
      onClick={(event) => {
        // Evita que cliques nas abas ou conteúdo sejam interpretados como clique no mapa
        event.stopPropagation();
      }}
    >
      {/* Tabs */}
      <div className="flex rounded-full bg-gray-100 p-1 text-xs md:text-sm font-semibold border border-gray-200 mr-9 md:mr-10 mt-1">
        <button
          type="button"
          className={`flex-1 py-1.5 md:py-2 rounded-full transition-colors ${
            activeTab === 'soildata'
              ? 'bg-white text-[#C55B28] shadow-sm'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('soildata')}
        >
          Descrição
        </button>
        <button
          type="button"
          className={`flex-1 py-1.5 md:py-2 rounded-full transition-colors ${
            activeTab === 'context'
              ? 'bg-white text-[#C55B28] shadow-sm'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('context')}
        >
          Contexto territorial
        </button>
      </div>

      {activeTab === 'soildata' && (
        <div className="flex flex-col gap-3">
          {datasetPoint ? (
            <>
              <div className="border border-orange-100 rounded-2xl p-4 bg-orange-50/70">
                <div className="text-[11px] md:text-xs uppercase tracking-wide text-[#C55B28] mb-0.5 font-semibold">
                  Título do projeto
                </div>
                <div className="text-sm text-gray-900 mb-2">
                  {displayTitle}
                </div>
                {displayDoi && (
                  <div className="text-xs text-[#C55B28] mb-2">
                    DOI:{' '}
                    <a
                      href={`https://soildata.mapbiomas.org/dataset.xhtml?persistentId=${displayDoi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {displayDoi}
                    </a>
                  </div>
                )}
                {datasetDetailsLoading && (
                  <div className="text-[11px] text-gray-500 mb-1">
                    Carregando detalhes do trabalho no SoilData…
                  </div>
                )}
                {datasetDetailsError && (
                  <div className="text-[11px] text-red-600 mb-1">
                    {datasetDetailsError}
                  </div>
                )}
                <div className="flex">
                  <a
                    className="btn btn-sm md:btn-md text-white border-none flex-1 justify-center"
                    style={{ backgroundColor: '#C55B28' }}
                    href={datasetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Acessar trabalho de origem
                  </a>
                </div>
              </div>

              <div>
                <div className="text-xs md:text-sm uppercase tracking-wide text-gray-700 mb-1.5">
                  Quantidade de amostras por camada
                </div>
                {depthLayers.length === 0 ? (
                  <div className="text-sm text-gray-600">
                    Não há informação de profundidade disponível para este ponto.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1">
                    {depthLayers.map((sample, index) => {
                      const depthValue = sample.depth ?? 0;
                      const widthPercent =
                        maxDepth > 0 ? Math.max(15, (depthValue / maxDepth) * 100) : 50;

                      return (
                        <div
                          key={`${sample.id}-${index}`}
                          className="flex items-center gap-3"
                        >
                          <div className="w-16 text-xs text-gray-600">
                            {depthValue > 0
                              ? `${Math.round(depthValue)} cm`
                              : 'Prof. N/D'}
                          </div>
                          <div className="flex-1 bg-orange-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${widthPercent}%`,
                                backgroundColor: '#C55B28',
                              }}
                            />
                          </div>
                          <div className="w-8 text-right text-xs text-gray-600">
                            1
                          </div>
                        </div>
                      );
                    })}
                    <div className="text-[11px] text-gray-500 mt-1">
                      Cada barra representa uma camada amostrada neste ponto.
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-sm text-gray-600">
              Nenhum ponto de solo associado a este clique.
            </div>
          )}
          {selectedPointBlock}
        </div>
      )}

      {activeTab === 'context' && (
        <div className="flex flex-col gap-3">
          {isLoading && (
            <div className="text-sm text-gray-500">
              Carregando CAR, territórios e histórico do pixel…
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          {!isLoading && properties && (
            <div>
              <div className="text-xs md:text-sm uppercase tracking-wide text-gray-700 mb-1.5">
                CAR no ponto (properties/point)
              </div>
              {properties.length === 0 ? (
                <div className="text-sm text-gray-600">
                  Nenhum CAR encontrado na coordenada.
                </div>
              ) : (
                <ul className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {properties.slice(0, 5).map((p) => (
                    <li
                      key={p.propertyCode}
                      className="text-xs font-mono text-gray-900 break-all"
                    >
                      {p.propertyCode}
                    </li>
                  ))}
                  {properties.length > 5 && (
                    <li className="text-xs text-gray-500">
                      +{properties.length - 5} outros códigos…
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}

          {!isLoading && territories && (
            <div>
              <div className="text-xs md:text-sm uppercase tracking-wide text-gray-700 mb-1.5">
                Territórios no ponto (territories/point)
              </div>
              {(municipality || biome || region) && (
                <div className="mb-2 text-xs text-gray-700">
                  {municipality && (
                    <div>
                      <span className="font-semibold">Município: </span>
                      {municipality.name}
                    </div>
                  )}
                  {biome && (
                    <div>
                      <span className="font-semibold">Bioma: </span>
                      {biome.name}
                    </div>
                  )}
                  {region && (
                    <div>
                      <span className="font-semibold">Região: </span>
                      {region.name}
                    </div>
                  )}
                </div>
              )}
              <ul className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {territories.map((t) => (
                  <li key={t.id} className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {t.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {t.category?.name?.['pt-BR'] || 'Categoria'}{' '}
                      {t.nameFormatted ? `· ${t.nameFormatted}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
              {municipality && (
                <div className="mt-1 text-xs text-emerald-700">
                  Município detectado automaticamente:{' '}
                  <span className="font-semibold">{municipality.name}</span>
                </div>
              )}
            </div>
          )}

          {!isLoading && pixelHistory && pixelHistory.length > 0 && (
            <div>
              <div className="text-xs md:text-sm uppercase tracking-wide text-gray-700 mb-1.5">
                Histórico de uso do solo (pixel-history)
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-gray-900 max-h-32 overflow-y-auto pr-1">
                {pixelHistory.map((item) => (
                  <div key={item.year} className="flex justify-between">
                    <span>{item.year}</span>
                    <span className="font-mono">{item.pixelValue}</span>
                  </div>
                ))}
              </div>
              {pixelSummary && (
                <div className="mt-2 text-xs text-gray-700">
                  <div>
                    <span className="font-semibold">Classe inicial: </span>
                    {pixelSummary.firstValue} ({pixelSummary.firstYear})
                  </div>
                  <div>
                    <span className="font-semibold">Classe atual: </span>
                    {pixelSummary.lastValue} ({pixelSummary.lastYear})
                  </div>
                  {pixelSummary.firstChangeYear && (
                    <div>
                      <span className="font-semibold">Primeira mudança detectada em: </span>
                      {pixelSummary.firstChangeYear}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function PlatformMapMapLibre({ selectedDatasetId, onStatisticsChange }: PlatformMapProps) {
  const {
    datasetPoints,
    setDatasetPoints,
    isDatasetLoading,
    setIsDatasetLoading,
    datasetError,
    setDatasetError,
    groupingValue,
    setGroupingValue,
    selectedTerritory,
    setSelectedTerritory,
    aggregateByBiome,
    setAggregateByBiome,
  } = usePlatformStore();

  const mapRef = useRef<MapRef>(null);
  const [territoryGeoJSON, setTerritoryGeoJSON] = useState<FeatureCollection | Feature | Geometry | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -55.9292,
    latitude: -15.7801,
    zoom: 3.5,
    pitch: 0,
    bearing: 0,
  });
  const [clickInfo, setClickInfo] = useState<ClickInfoState | null>(null);
  const [bearing, setBearing] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [exaggerationActive, setExaggerationActive] = useState(false);
  const [hoveredBiomeName, setHoveredBiomeName] = useState<string | null>(null);

  const { setMap } = usePlatformStore();

  // Helper para aplicar fitBounds usando Turf.js a partir de diferentes formatos de GeoJSON
  const fitMapToBounds = useCallback(
    (
      geo: FeatureCollection | Feature | Geometry,
      options?: { padding?: number; maxZoom?: number; duration?: number }
    ) => {
      if (!mapRef.current) {
        throw new Error('[fitMapToBounds] Mapa não disponível');
      }

      const isFeatureCollection = (geo as any).type === 'FeatureCollection';
      const isFeature = (geo as any).type === 'Feature';

      const featureLike: FeatureCollection | Feature =
        isFeatureCollection || isFeature
          ? (geo as FeatureCollection | Feature)
          : ({
              type: 'Feature',
              geometry: geo as Geometry,
              properties: {},
            } as Feature);

      const bounds = bbox(featureLike as any);

      const mapInstance = mapRef.current.getMap();
      mapInstance.fitBounds(
        [
          [bounds[0], bounds[1]],
          [bounds[2], bounds[3]],
        ] as [[number, number], [number, number]],
        {
          padding: options?.padding ?? 50,
          maxZoom: options?.maxZoom ?? 12,
          duration: options?.duration ?? 1200,
        }
      );
    },
    [mapRef]
  );

  // Atualizar referência do mapa no store
  useEffect(() => {
    if (mapRef.current) {
      setMap(mapRef.current.getMap() as unknown as maplibregl.Map);
    }
  }, [setMap]);

  // Cursor de pointer apenas sobre os pontos de dados de solo
  useEffect(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;

    const handleMouseEnter = () => {
      mapInstance.getCanvas().style.cursor = 'pointer';
    };

    const handleMouseLeave = () => {
      mapInstance.getCanvas().style.cursor = '';
    };

    // Eventos atrelados à camada de pontos
    mapInstance.on('mouseenter', 'all-points', handleMouseEnter);
    mapInstance.on('mouseleave', 'all-points', handleMouseLeave);

    return () => {
      mapInstance.off('mouseenter', 'all-points', handleMouseEnter);
      mapInstance.off('mouseleave', 'all-points', handleMouseLeave);
      mapInstance.getCanvas().style.cursor = '';
    };
  }, []);

  // Hover de biomas: destacar bioma sob o mouse quando visualizando biomas em modo agregado
  useEffect(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;

    // Apenas quando o agrupamento atual é por biomas E estamos em modo agregado
    if (!aggregateByBiome || groupingValue !== 'biomas') {
      setHoveredBiomeName(null);
      return;
    }

    const handleMove = (e: maplibregl.MapLayerMouseEvent) => {
      try {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ['territories-fill'],
        });

        if (!features.length) {
          setHoveredBiomeName(null);
          return;
        }

        const feature = features[0];
        const props = feature.properties as any;
        const name =
          (props?.name as string) ||
          (props?.Name as string) ||
          (props?.NM_BIOMA as string) ||
          null;

        if (name && typeof name === 'string') {
          setHoveredBiomeName(name);
        } else {
          setHoveredBiomeName(null);
        }
      } catch {
        setHoveredBiomeName(null);
      }
    };

    const handleLeave = () => {
      setHoveredBiomeName(null);
    };

    mapInstance.on('mousemove', 'territories-fill', handleMove);
    mapInstance.on('mouseleave', 'territories-fill', handleLeave);

    return () => {
      mapInstance.off('mousemove', 'territories-fill', handleMove);
      mapInstance.off('mouseleave', 'territories-fill', handleLeave);
      setHoveredBiomeName(null);
    };
  }, [aggregateByBiome, groupingValue]);

  // Configurar projeção Globe e Terreno 3D após o mapa carregar
  useEffect(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;
    
    const handleStyleLoad = () => {
      // Configurar projeção globe
      mapInstance.setProjection({ type: 'globe' });

      // Adicionar fonte de terreno se não existir
      if (!mapInstance.getSource('terrainSource')) {
        mapInstance.addSource('terrainSource', {
          type: 'raster-dem',
          url: 'https://demotiles.maplibre.org/terrain-tiles/tiles.json',
        });
      }

      // Configurar terreno inicial com exagero 0
      mapInstance.setTerrain({ source: 'terrainSource', exaggeration: 0 });
    };

    // Se o estilo já carregou, configurar imediatamente
    if (mapInstance.isStyleLoaded()) {
      handleStyleLoad();
    } else {
      mapInstance.once('style.load', handleStyleLoad);
    }

    return () => {
      mapInstance.off('style.load', handleStyleLoad);
    };
  }, []);

  // Sincronizar pitch e bearing com viewState e estados locais
  useEffect(() => {
    const mapInstance = mapRef.current?.getMap();
    if (!mapInstance) return;

    const handleMove = () => {
      const currentBearing = mapInstance.getBearing();
      const currentPitch = mapInstance.getPitch();
      const currentZoom = mapInstance.getZoom();
      const center = mapInstance.getCenter();

      setBearing(currentBearing);
      setPitch(currentPitch);
      
      setViewState(prev => ({
        ...prev,
        longitude: center.lng,
        latitude: center.lat,
        zoom: currentZoom,
        pitch: currentPitch,
        bearing: currentBearing,
      }));
    };

    mapInstance.on('move', handleMove);

    return () => {
      mapInstance.off('move', handleMove);
    };
  }, []);

  // Determina qual divisionCategoryId usar baseado no groupingValue
  const divisionCategoryId = useMemo(() => {
    if (groupingValue === 'pais') return null;
    return GROUPING_TO_DIVISION_CATEGORY[groupingValue] || null;
  }, [groupingValue]);

  // Filtrar pontos no frontend como fallback caso a API retorne todos os registros
  const filteredPoints = useMemo(() => {
    if (!selectedTerritory || selectedDatasetId !== PSD_PLATFORM_DATASET_ID) {
      return datasetPoints;
    }

    const normalize = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const targetName = normalize(selectedTerritory.name);

    return datasetPoints.filter((point) => {
      if (!point) return false;

      switch (selectedTerritory.type) {
        case 'State':
          return point.state ? normalize(point.state) === targetName : false;
        case 'Biome':
          return point.biome ? normalize(point.biome) === targetName : false;
        case 'Municipality':
          return point.municipality ? normalize(point.municipality) === targetName : false;
        case 'Region':
          return point.region ? normalize(point.region) === targetName : false;
        default:
          return true;
      }
    });
  }, [datasetPoints, selectedTerritory, selectedDatasetId]);

  // Pontos agregados por bioma para visão resumida
  const aggregatedBiomePoints = useMemo(() => {
    const groups: Record<string, {
      biomeLabel: string;
      latSum: number;
      lngSum: number;
      count: number;
    }> = {};

    filteredPoints.forEach((point) => {
      const biomeName = point.biome || 'Sem bioma';
      const key = biomeName;

      if (!groups[key]) {
        groups[key] = {
          biomeLabel: biomeName,
          latSum: 0,
          lngSum: 0,
          count: 0,
        };
      }

      groups[key].latSum += point.latitude;
      groups[key].lngSum += point.longitude;
      groups[key].count += 1;
    });

    return Object.values(groups).map((group) => ({
      id: group.biomeLabel,
      latitude: group.latSum / group.count,
      longitude: group.lngSum / group.count,
      biome: group.biomeLabel,
      samplesCount: group.count,
    }));
  }, [filteredPoints]);

  const hoveredBiomeInfo = useMemo(() => {
    if (!aggregateByBiome || !hoveredBiomeName) return null;

    const normalize = (value: string) =>
      value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const target = normalize(hoveredBiomeName);

    const match = aggregatedBiomePoints.find((item) => {
      const label = item.biome || item.id;
      return normalize(label) === target;
    });

    if (!match) return null;

    return {
      biomeName: match.biome,
      count: match.samplesCount,
      lngLat: [match.longitude, match.latitude] as [number, number],
    };
  }, [aggregateByBiome, hoveredBiomeName, aggregatedBiomePoints]);

  // Carregar dados do dataset
  useEffect(() => {
    let isCancelled = false;

    if (!selectedDatasetId) {
      setDatasetPoints([]);
      setDatasetError(null);
      setIsDatasetLoading(false);
      return;
    }

    setIsDatasetLoading(true);
    setDatasetError(null);

    if (selectedDatasetId === PSD_PLATFORM_DATASET_ID) {
      loadPSDPlatformWithFilters(selectedTerritory)
        .then((points) => {
          if (isCancelled) return;
          setDatasetPoints(points);
        })
        .catch((error) => {
          console.error('Falha ao carregar pontos do PSD Platform', error);
          if (isCancelled) return;
          setDatasetPoints([]);
          setDatasetError('Não foi possível carregar os pontos deste conjunto de dados.');
        })
        .finally(() => {
          if (isCancelled) return;
          setIsDatasetLoading(false);
        });
    } else {
      const loader = soloDatasetLoaders[selectedDatasetId];
      if (!loader) {
        setDatasetPoints([]);
        setDatasetError('Dataset não configurado.');
        setIsDatasetLoading(false);
        return;
      }

      loader()
        .then((points) => {
          if (isCancelled) return;
          setDatasetPoints(points);
        })
        .catch((error) => {
          console.error('Falha ao carregar pontos do dataset', error);
          if (isCancelled) return;
          setDatasetPoints([]);
          setDatasetError('Não foi possível carregar os pontos deste conjunto de dados.');
        })
        .finally(() => {
          if (isCancelled) return;
          setIsDatasetLoading(false);
        });
    }

    return () => { 
      isCancelled = true; 
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDatasetId, selectedTerritory]);

  // Buscar GeoJSON do território selecionado e fazer zoom
  useEffect(() => {
    if (!selectedTerritory || !mapRef.current) {
      console.log('🔍 [Territory Highlight] Nenhum território selecionado ou mapa não disponível');
      setTerritoryGeoJSON(null);
      return;
    }

    console.log(`🔍 [Territory Highlight] Buscando GeoJSON para ${selectedTerritory.type}: ${selectedTerritory.name}`);

    // Buscar GeoJSON para State, Biome, Municipality ou Region
    if (selectedTerritory.type === 'State' || selectedTerritory.type === 'Biome' || selectedTerritory.type === 'Municipality' || selectedTerritory.type === 'Region') {
      getTerritoryGeoJSON(selectedTerritory.type, selectedTerritory.name)
        .then((geoJSON) => {
          console.log(`📦 [Territory Highlight] GeoJSON recebido:`, geoJSON);
          console.log(`📦 [Territory Highlight] Tipo do GeoJSON:`, geoJSON?.type, geoJSON?.features ? `(${geoJSON.features?.length} features)` : '');
          const normalized = normalizeTerritoryFeatureCollection(geoJSON);

          if (normalized && mapRef.current) {
            console.log('✅ [Territory Highlight] GeoJSON normalizado, definindo no state', {
              type: normalized.type,
              featuresCount: normalized.features?.length ?? 0,
            });
            setTerritoryGeoJSON(normalized);

            try {
              fitMapToBounds(normalized);
            } catch (error) {
              console.error('Failed to fit bounds from GeoJSON:', error);
              if (filteredPoints.length > 0) {
                try {
                  const pointsCollection = points(
                    filteredPoints.map(p => [p.longitude, p.latitude])
                  );
                  fitMapToBounds(pointsCollection);
                } catch (err) {
                  console.error('Failed to calculate bounds from points:', err);
                }
              }
            }
          } else {
            console.warn('⚠️ [Territory Highlight] GeoJSON vazio ou inválido ou mapa não disponível');
            setTerritoryGeoJSON(null);
            if (mapRef.current && filteredPoints.length > 0 && !isDatasetLoading) {
              try {
                const pointsCollection = points(
                  filteredPoints.map(p => [p.longitude, p.latitude])
                );
                fitMapToBounds(pointsCollection);
              } catch (err) {
                console.error('Failed to calculate bounds from points:', err);
              }
            }
          }
        })
        .catch((error) => {
          console.error('❌ [Territory Highlight] Erro ao buscar GeoJSON:', error);
          setTerritoryGeoJSON(null);
        });
    } else {
      console.log(`⚠️ [Territory Highlight] Tipo de território não suportado para highlight: ${selectedTerritory.type}`);
      setTerritoryGeoJSON(null);
    }
  }, [selectedTerritory, filteredPoints, isDatasetLoading, fitMapToBounds]);

  // Handle territory selection
  const handleTerritorySelect = useCallback((territory: TerritoryResult | null) => {
    setSelectedTerritory(territory);
    setTerritoryGeoJSON(null);
    
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
      if (mapRef.current) {
        const mapInstance = mapRef.current.getMap();
        mapInstance.flyTo({
          center: [-55.9292, -15.7801],
          zoom: 3.5,
        });
      }
    }
  }, [setSelectedTerritory, setGroupingValue, groupingValue]);

  // Calculate and emit statistics
  useEffect(() => {
    if (!onStatisticsChange) return;

    const stats: MapStatistics = {
      totalDatasets: selectedDatasetId ? 1 : 0,
      totalSamples: filteredPoints.length,
      totalLocations: new Set(filteredPoints.map(p => `${p.latitude},${p.longitude}`)).size,
      totalProperties: filteredPoints.length > 0 ? Object.keys(filteredPoints[0]).length - 2 : 0,
      territoryName: selectedTerritory?.name || 'Brasil',
    };

    onStatisticsChange(stats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPoints, selectedTerritory, selectedDatasetId]);

  // Converter pontos para GeoJSON para clustering
  const pointsGeoJSON = useMemo<FeatureCollection<Point>>(() => {
    const basePoints = aggregateByBiome ? aggregatedBiomePoints : filteredPoints;

    return featureCollection(
      basePoints.map((point: any) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [point.longitude, point.latitude],
        },
        properties: {
          ...point,
        },
      }))
    );
  }, [filteredPoints, aggregatedBiomePoints, aggregateByBiome]);

  const showEmptyState = !isDatasetLoading && !datasetError && !!selectedDatasetId && filteredPoints.length === 0;

  return (
    <div className="h-full w-full relative z-0">
      {/* Loading Overlay */}
      {isDatasetLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-1000 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-2xl p-6 flex flex-col items-center gap-4 min-w-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C55B28]"></div>
            <div className="text-center">
              <p className="text-lg font-semibold text-[#C55B28] mb-1">Carregando dados do solo</p>
              <p className="text-sm text-gray-600">{filteredPoints.length.toLocaleString('pt-BR')} pontos carregados</p>
            </div>
          </div>
        </div>
      )}

      {/* Error and Empty States */}
      {(datasetError || showEmptyState) && (
        <div className="absolute left-4 top-4 z-1000 max-w-xs">
          <div className="rounded-xl bg-white/95 p-3 text-sm text-neutral-900 shadow-lg border" style={{ borderColor: 'rgba(197,91,40,0.3)' }}>
            {datasetError && <p className="text-red-600">{datasetError}</p>}
            {showEmptyState && <p>Nenhum ponto disponível para este conjunto de dados.</p>}
          </div>
        </div>
      )}
      
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        attributionControl={false}
        projection="globe"
        onClick={(e) => {
          // Em modo agregado por bioma, não abrimos popup de ponto individual
          if (aggregateByBiome) {
            return;
          }

          const mapInstance = mapRef.current?.getMap();
          if (!mapInstance) return;

        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ['all-points'],
        });

          // Só abrimos popup e consultamos APIs quando o clique cai em um ponto de dados de solo
          if (features.length === 0) {
            setClickInfo(null);
            return;
          }

          const feature = features[0];
          const datasetPoint = feature.properties as SoloDatasetPoint;
          const geometry = feature.geometry as Point | undefined;

          // Todas as amostras (camadas) do mesmo ponto (mesmo dataset, lat e lon)
          const relatedSamples =
            filteredPoints.filter((p) => {
              const sameDataset = p.datasetCode === datasetPoint.datasetCode;
              const sameLat =
                Math.abs(p.latitude - datasetPoint.latitude) < 1e-6;
              const sameLng =
              Math.abs(p.longitude - datasetPoint.longitude) < 1e-6;
              return sameDataset && sameLat && sameLng;
            }) || [];

          const lngLat: [number, number] =
            geometry && geometry.type === 'Point' && Array.isArray(geometry.coordinates)
              ? [geometry.coordinates[0], geometry.coordinates[1]]
              : [e.lngLat.lng, e.lngLat.lat];

          // Ajustar o mapa para garantir que o popup fique totalmente visível,
          // posicionando o ponto um pouco abaixo do centro da tela e aplicando um zoom mínimo.
          try {
            const canvas = mapInstance.getCanvas();
            const mapHeight = canvas?.clientHeight ?? 0;

            if (mapHeight > 0) {
              const currentPixel = mapInstance.project({
                lng: lngLat[0],
                lat: lngLat[1],
              });

              const targetY = mapHeight * 0.65; // ponto mais próximo da parte inferior
              const targetPixel = {
                x: currentPixel.x,
                y: targetY,
              };

              const targetCenter = mapInstance.unproject(
                targetPixel as maplibregl.PointLike
              );

              const currentZoom = mapInstance.getZoom();
              const targetZoom = currentZoom < 6 ? 6 : currentZoom;

              mapInstance.easeTo({
                center: targetCenter,
                zoom: targetZoom,
                duration: 700,
              });
            }
          } catch (zoomError) {
            console.warn(
              '⚠️ [Map Click] Não foi possível ajustar o zoom/centro para o popup:',
              zoomError
            );
          }

          // Estado inicial do popup ao clicar
          setClickInfo({
            lngLat,
            datasetPoint,
            relatedSamples,
            datasetDetails: undefined,
            datasetDetailsLoading: true,
            datasetDetailsError: null,
            properties: undefined,
            territories: undefined,
            pixelHistory: undefined,
            isLoading: true,
            error: null,
          });

          (async () => {
            try {
              const [properties, territories, pixelHistory, datasetsResponse] = await Promise.all([
                getPropertiesByPoint(lngLat[0], lngLat[1]).catch(() => []),
                getTerritoriesByPoint(lngLat[0], lngLat[1]).catch(() => []),
                getPixelHistoryByPoint(lngLat[0], lngLat[1], {
                  subthemeKey: 'coverage_lclu',
                  legendId: 'default',
                }).catch(() => []),
                (async () => {
                  try {
                    const query =
                      datasetPoint.doi && datasetPoint.doi.trim().length > 0
                        ? datasetPoint.doi.trim()
                        : datasetPoint.datasetCode || '';

                    if (!query) {
                      return null;
                    }

                    return await searchDatasets(query, { limit: 1 }).catch(() => null);
                  } catch {
                    return null;
                  }
                })(),
              ]);

              const datasetDetails =
                datasetsResponse && Array.isArray(datasetsResponse.data) && datasetsResponse.data.length > 0
                  ? datasetsResponse.data[0]
                  : null;

              // Selecionar automaticamente o município para highlight, quando existir
              const municipality = territories.find(
                (t) =>
                  t.category?.id === 95 ||
                  t.category?.name?.['pt-BR']?.toLowerCase() === 'município' ||
                  t.category?.name?.['pt-BR']?.toLowerCase() === 'municipio'
              );

              if (municipality) {
                setSelectedTerritory({
                  id: municipality.id,
                  name: municipality.name,
                  type: 'Municipality',
                  feature: null,
                });
                setGroupingValue('municipios');
              }

              setClickInfo((current) => {
                if (!current) return current;
                // Garante que atualizamos apenas o último clique
                if (
                  current.lngLat[0] !== lngLat[0] ||
                  current.lngLat[1] !== lngLat[1]
                ) {
                  return current;
                }

                return {
                  ...current,
                  properties,
                  territories,
                  pixelHistory,
                  datasetDetails,
                  datasetDetailsLoading: false,
                  datasetDetailsError: null,
                  isLoading: false,
                  error: null,
                };
              });
            } catch (err) {
              console.error('❌ [Map Click] Erro ao carregar informações do ponto:', err);
              setClickInfo((current) => {
                if (!current) return current;
                if (
                  current.lngLat[0] !== lngLat[0] ||
                  current.lngLat[1] !== lngLat[1]
                ) {
                  return current;
                }

                return {
                  ...current,
                  isLoading: false,
                  datasetDetailsLoading: false,
                  datasetDetailsError: 'Não foi possível carregar os detalhes do trabalho no SoilData.',
                  error: 'Não foi possível carregar as informações deste ponto.',
                };
              });
            }
          })();
        }}
      >
        {/* Vector Tiles do MapBiomas - Camada base de territórios */}
        {divisionCategoryId && (
          <Source
            id="mapbiomas-territories"
            type="vector"
            tiles={[`https://prd.plataforma.mapbiomas.org/api/v1/brazil/territories/tiles/{z}/{x}/{y}.mvt?divisionCategoryId=${divisionCategoryId}`]}
            minzoom={0}
            maxzoom={14}
          >
            <Layer
              id="territories-fill"
              type="fill"
              source-layer="default"
              paint={{
                'fill-color':
                  groupingValue === 'biomas'
                    ? BIOME_FILL_EXPRESSION
                    : groupingValue === 'estados'
                    ? '#FEF3C7'
                    : '#DBEAFE',
                'fill-opacity': 0.15, // Reduzido para dar mais destaque ao território selecionado
              }}
            />
            <Layer
              id="territories-outline"
              type="line"
              source-layer="default"
              paint={{
                'line-color':
                  groupingValue === 'biomas'
                    ? '#C55B28' // borda biomas com cor SoloData
                    : groupingValue === 'estados'
                    ? '#D97706'
                    : '#2563EB',
                'line-width': groupingValue === 'municipios' ? 0.5 : 1,
                'line-opacity': 0.6, // Reduzido para dar mais destaque ao território selecionado
              }}
            />
            {/* Hover highlight de bioma em modo agregado */}
            {aggregateByBiome && groupingValue === 'biomas' && hoveredBiomeName && (
              <>
                <Layer
                  id="biome-hover-fill"
                  type="fill"
                  source-layer="default"
                  filter={
                    [
                      'any',
                      ['==', ['get', 'name'], hoveredBiomeName],
                      ['==', ['get', 'Name'], hoveredBiomeName],
                      ['==', ['get', 'NM_BIOMA'], hoveredBiomeName],
                    ] as any
                  }
                  paint={{
                    'fill-color': '#FED7AA',
                    'fill-opacity': 0.35,
                  }}
                />
                <Layer
                  id="biome-hover-outline"
                  type="line"
                  source-layer="default"
                  filter={
                    [
                      'any',
                      ['==', ['get', 'name'], hoveredBiomeName],
                      ['==', ['get', 'Name'], hoveredBiomeName],
                      ['==', ['get', 'NM_BIOMA'], hoveredBiomeName],
                    ] as any
                  }
                  paint={{
                    'line-color': '#C2410C',
                    'line-width': 2,
                    'line-opacity': 0.9,
                  }}
                />
              </>
            )}
          </Source>
        )}

        {/* Marcadores dos pontos - SEM agrupamento, todos os pontos renderizados */}
        <Source id="points" type="geojson" data={pointsGeoJSON}>
          <Layer
            id="all-points"
            type="circle"
            paint={{
              // Cor principal alinhada ao tema SoloData
              'circle-color': '#D65A2A', // laranja solo mais vivo
              // Raio responsivo ao zoom; em modo agregado (features com samplesCount),
              // os círculos ficam maiores para maior destaque, usando uma única expressão de zoom
              'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                3,
                ['case', ['has', 'samplesCount'], 6, 4],
                6,
                ['case', ['has', 'samplesCount'], 8, 5.5],
                9,
                ['case', ['has', 'samplesCount'], 10, 7],
                12,
                ['case', ['has', 'samplesCount'], 12, 8.5],
                15,
                ['case', ['has', 'samplesCount'], 14, 10],
              ],
              // Borda clara para destacar sobre qualquer fundo
              'circle-stroke-width': [
                'case',
                ['has', 'samplesCount'],
                2.25,
                1.75,
              ],
              'circle-stroke-color': '#FEF3E6',
              // Sombra leve para sensação de profundidade
              'circle-blur': 0.08,
              'circle-opacity': 0.97,
              'circle-stroke-opacity': 0.97,
            }}
          />
          {aggregateByBiome && (
            <Layer
              id="biome-count-labels"
              type="symbol"
              layout={{
                'text-field': ['to-string', ['get', 'samplesCount']],
                'text-size': 12,
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 1.6],
                'text-allow-overlap': true,
              }}
              paint={{
                'text-color': '#C55B28',
                'text-halo-color': 'rgba(255, 255, 255, 0.98)',
                'text-halo-width': 1.6,
              }}
            />
          )}
        </Source>

        {/* Popup com quantidade de pontos do bioma em hover */}
        {aggregateByBiome && groupingValue === 'biomas' && hoveredBiomeInfo && (
          <Popup
            longitude={hoveredBiomeInfo.lngLat[0]}
            latitude={hoveredBiomeInfo.lngLat[1]}
            anchor="center"
            closeButton={false}
            closeOnClick={false}
            maxWidth="260px"
          >
            <div className="px-3 py-2 rounded-2xl bg-white/95 shadow-lg border border-orange-100 text-xs md:text-sm text-gray-800">
              <div className="font-semibold text-[#C55B28] mb-0.5 text-sm md:text-base">
                {hoveredBiomeInfo.biomeName}
              </div>
              <div className="text-[11px] md:text-xs text-gray-700">
                {hoveredBiomeInfo.count.toLocaleString('pt-BR')} pontos
              </div>
            </div>
          </Popup>
        )}

        {/* Popup com informações completas do clique (CAR, territórios, pixel history + ponto SoloData) */}
        {clickInfo && (
          <Popup
            longitude={clickInfo.lngLat[0]}
            latitude={clickInfo.lngLat[1]}
            anchor="bottom"
            onClose={() => setClickInfo(null)}
            maxWidth="560px"
            closeButton={true}
            closeOnClick={false}
          >
            <ClickInfoPopupContent info={clickInfo} />
          </Popup>
        )}

        {/* Highlight selected territory - Priorizar GeoJSON (mais confiável) */}
        {selectedTerritory && territoryGeoJSON && (
          <>
            {console.log('🎯 [Map Render] Renderizando highlight para:', selectedTerritory.name, 'com GeoJSON:', !!territoryGeoJSON)}
            <TerritoryHighlightGeoJSON 
              territory={selectedTerritory}
              geoJSON={territoryGeoJSON}
            />
          </>
        )}
        
        {/* Debug: Mostrar quando não há highlight */}
        {selectedTerritory && !territoryGeoJSON && (
          <>
            {console.warn('⚠️ [Map Render] Território selecionado mas sem GeoJSON:', selectedTerritory.name, 'Tipo:', selectedTerritory.type)}
          </>
        )}

        {/* Fallback: Highlight usando Vector Tiles se GeoJSON não estiver disponível */}
        {selectedTerritory && divisionCategoryId && !territoryGeoJSON && (
          <TerritoryHighlightVectorTiles 
            territory={selectedTerritory}
            divisionCategoryId={divisionCategoryId}
            mapRef={mapRef}
          />
        )}

      </Map>

      {/* Map Controls */}
      <MapLayout>
        <MapLayout.TopLeft />
        <MapLayout.BottomRight>
          <CompassControl
            bearing={bearing}
            pitch={pitch}
            reset={() => {
              const mapInstance = mapRef.current?.getMap();
              if (mapInstance) {
                mapInstance.easeTo({ bearing: 0, pitch: 0 });
              }
            }}
          />
          <ZoomControl
            onZoomIn={() => mapRef.current?.getMap().zoomIn()}
            onZoomOut={() => mapRef.current?.getMap().zoomOut()}
          />
          <TooltipTrigger delay={0} closeDelay={0}>
            <Button
              hierarchy="primary"
              type="icon"
              aria-label={
                exaggerationActive
                  ? 'Desativar exagero vertical do relevo'
                  : 'Ativar exagero vertical do relevo'
              }
              onClick={() => {
                const mapInstance = mapRef.current?.getMap();
                if (!mapInstance) return;

                const newPitch = exaggerationActive ? 0 : 60;
                mapInstance.easeTo({ pitch: newPitch, duration: 1000 });

                setExaggerationActive((prev) => !prev);

                if (exaggerationActive) {
                  mapInstance.setTerrain({ source: 'terrainSource', exaggeration: 0 });
                } else {
                  mapInstance.setTerrain({ source: 'terrainSource', exaggeration: 100 });
                }
              }}
            >
              <MountainIcon />
            </Button>
            <Tooltip placement="left">
              {exaggerationActive ? 'Desativar' : 'Ativar'} exagero vertical do relevo
            </Tooltip>
          </TooltipTrigger>
        </MapLayout.BottomRight>
      </MapLayout>
    </div>
  );
}
