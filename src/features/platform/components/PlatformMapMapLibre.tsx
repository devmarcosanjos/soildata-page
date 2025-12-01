import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Map, { Source, Layer, Popup } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapLayout, CompassControl, ZoomControl, Button } from '@mapbiomas/ui';
import { MountainIcon } from 'lucide-react';
import { TooltipTrigger, Tooltip } from 'react-aria-components';
import { soloDatasetLoaders, PSD_PLATFORM_DATASET_ID, loadPSDPlatformWithFilters } from '@/features/platform/data/soloDatasets';
import type { SoloDatasetPoint } from '@/features/platform/data/soloDatasets';
import { TerritorySearchBar } from './TerritorySearchBar';
import type { TerritoryResult } from './TerritorySelector';
import { MarkerPopup } from './MarkerPopup';
import { usePlatformStore } from '@/stores/platformStore';
import { getTerritoryGeoJSON } from '@/services/psdPlatformApi';
import bbox from '@turf/bbox';
import { points, featureCollection } from '@turf/helpers';
import type { FeatureCollection, Feature, Geometry, Point } from 'geojson';

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
        beforeId="points"
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
    
    // Se for FeatureCollection válido
    if ('type' in geoJSON && geoJSON.type === 'FeatureCollection' && 'features' in geoJSON && Array.isArray(geoJSON.features) && geoJSON.features.length > 0) {
      console.log(`✅ [GeoJSON Highlight] FeatureCollection válido com ${geoJSON.features.length} features`);
      return geoJSON as FeatureCollection;
    }
    
    // Se for um único Feature, converter para FeatureCollection
    if ('type' in geoJSON && geoJSON.type === 'Feature' && 'geometry' in geoJSON) {
      console.log('🔄 [GeoJSON Highlight] Convertendo Feature para FeatureCollection');
      return {
        type: 'FeatureCollection',
        features: [geoJSON as Feature]
      } as FeatureCollection;
    }
    
    // Se tiver geometry diretamente, converter para Feature
    if ('geometry' in geoJSON && geoJSON.geometry && typeof geoJSON.geometry === 'object' && 'type' in geoJSON.geometry) {
      console.log('🔄 [GeoJSON Highlight] Convertendo geometry para Feature');
      return {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: geoJSON.geometry as Geometry,
          properties: ('properties' in geoJSON && geoJSON.properties) ? geoJSON.properties : {}
        }]
      } as FeatureCollection;
    }
    
    // Se for um array de features
    if (Array.isArray(geoJSON) && geoJSON.length > 0) {
      console.log('🔄 [GeoJSON Highlight] Convertendo array para FeatureCollection');
      return {
        type: 'FeatureCollection',
        features: geoJSON as Feature[]
      } as FeatureCollection;
    }
    
    console.warn('⚠️ [GeoJSON Highlight] Formato de GeoJSON não reconhecido:', geoJSON);
    return null;
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
  const [popupInfo, setPopupInfo] = useState<{ point: SoloDatasetPoint; lngLat: [number, number] } | null>(null);
  const [bearing, setBearing] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [exaggerationActive, setExaggerationActive] = useState(false);

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
          
          if (geoJSON && mapRef.current) {
            console.log('🔍 [Territory Highlight] Validando GeoJSON recebido...');
            console.log('🔍 [Territory Highlight] Tipo:', geoJSON.type);
            const isFeatureCollection = geoJSON.type === 'FeatureCollection' && 'features' in geoJSON;
            console.log('🔍 [Territory Highlight] Tem features?', isFeatureCollection, isFeatureCollection && Array.isArray(geoJSON.features));
            console.log('🔍 [Territory Highlight] Tem geometry?', 'geometry' in geoJSON);
            
            // Validar formato do GeoJSON - ser mais flexível
            const hasValidStructure = 
              (geoJSON.type === 'FeatureCollection' && 'features' in geoJSON) ||
              (geoJSON.type === 'Feature' && 'geometry' in geoJSON) ||
              (geoJSON.type === 'GeometryCollection') ||
              ('geometry' in geoJSON && geoJSON.type === 'Feature' && geoJSON.geometry !== undefined);
            
            console.log('🔍 [Territory Highlight] GeoJSON tem estrutura válida?', hasValidStructure);
            
            if (!hasValidStructure) {
              console.warn('⚠️ [Territory Highlight] GeoJSON em formato inválido:', geoJSON);
              console.warn('⚠️ [Territory Highlight] Estrutura:', Object.keys(geoJSON));
              setTerritoryGeoJSON(null);
              return;
            }
            
            console.log('✅ [Territory Highlight] GeoJSON válido, definindo no state');
            const featuresCount = isFeatureCollection ? geoJSON.features?.length ?? 0 : 0;
            console.log('✅ [Territory Highlight] GeoJSON será renderizado:', {
              type: geoJSON.type,
              hasFeatures: isFeatureCollection,
              featuresCount,
              hasGeometry: 'geometry' in geoJSON
            });
            setTerritoryGeoJSON(geoJSON);

            try {
              // Calcular bounds do GeoJSON usando função helper
              fitMapToBounds(geoJSON as FeatureCollection);
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
            console.warn('⚠️ [Territory Highlight] GeoJSON vazio ou mapa não disponível');
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
    return featureCollection(
      filteredPoints.map(point => ({
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
  }, [filteredPoints]);

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
          const mapInstance = mapRef.current?.getMap();
          if (!mapInstance) return;
          
          const features = mapInstance.queryRenderedFeatures(e.point, {
            layers: ['all-points'],
          });

          if (features.length > 0) {
            const feature = features[0];
            const pointData = feature.properties as SoloDatasetPoint;
            const geometry = feature.geometry as Point;
            setPopupInfo({
              point: pointData,
              lngLat: geometry.coordinates as [number, number],
            });
          } else {
            setPopupInfo(null);
          }
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
              paint={{
                'fill-color': groupingValue === 'estados' ? '#FEF3C7' : groupingValue === 'biomas' ? '#D1FAE5' : '#DBEAFE',
                'fill-opacity': 0.15, // Reduzido para dar mais destaque ao território selecionado
              }}
            />
            <Layer
              id="territories-outline"
              type="line"
              paint={{
                'line-color': groupingValue === 'estados' ? '#D97706' : groupingValue === 'biomas' ? '#059669' : '#2563EB',
                'line-width': groupingValue === 'municipios' ? 0.5 : 1,
                'line-opacity': 0.6, // Reduzido para dar mais destaque ao território selecionado
              }}
            />
          </Source>
        )}

        {/* Marcadores dos pontos - SEM agrupamento, todos os pontos renderizados */}
        <Source id="points" type="geojson" data={pointsGeoJSON}>
          <Layer
            id="all-points"
            type="circle"
            paint={{
              'circle-color': '#C55B28',
              'circle-radius': 6,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
              'circle-opacity': 0.9,
            }}
          />
        </Source>

        {/* Popup para marcadores */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.lngLat[0]}
            latitude={popupInfo.lngLat[1]}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
            maxWidth="360px"
            closeButton={true}
            closeOnClick={false}
          >
            <MarkerPopup point={popupInfo.point} />
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

      {/* Territory Search Bar */}
      <div className="absolute top-4 left-4 z-500">
        <TerritorySearchBar
          onSelectTerritory={handleTerritorySelect}
          selectedTerritory={selectedTerritory}
        />
      </div>

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
