import { useEffect, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLayout, CompassControl, ZoomControl } from '@mapbiomas/ui';
import { soloDatasetLoaders, PSD_PLATFORM_DATASET_ID, loadPSDPlatformWithFilters } from '@/features/platform/data/soloDatasets';
import type { SoloDatasetPoint } from '@/features/platform/data/soloDatasets';
import { TerritorySearchBar } from './TerritorySearchBar';
import type { TerritoryResult } from './TerritorySelector';
import { MarkerPopup } from './MarkerPopup';
import { usePlatformStore } from '@/stores/platformStore';
import { VectorTileLayer } from './VectorTileLayer';
// import { LayerControls } from './LayerControls'; // Oculto - camada controlada automaticamente
import { getTerritoryGeoJSON } from '@/services/psdPlatformApi';
import bbox from '@turf/bbox';
import { points } from '@turf/helpers';


// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = (L as any).icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

(L as any).Marker.prototype.options.icon = DefaultIcon;

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

// Component to expose the map instance to the parent
function MapController() {
  const map = useMap();
  const { setMap } = usePlatformStore();
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
  return null;
}

// Mapeamento de groupingValue para divisionCategoryId do MapBiomas
const GROUPING_TO_DIVISION_CATEGORY: Record<string, number> = {
  'biomas': 4,
  'estados': 3,
  'municipios': 95,
};

export function PlatformMap({ selectedDatasetId, onStatisticsChange }: PlatformMapProps) {
  const {
    map,
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

  // State para armazenar GeoJSON do território selecionado
  const [territoryGeoJSON, setTerritoryGeoJSON] = useState<any | null>(null);


  // Os pontos já vêm filtrados da API quando selectedTerritory está definido
  // O groupingValue é usado apenas para exibir a camada de vector tiles correspondente
  const displayPoints = useMemo(() => {
    // Quando há um território selecionado, os dados já vêm filtrados da API
    // Não precisamos filtrar novamente aqui
    // Limitar quantidade de pontos para melhor performance (cluster já ajuda, mas isso é extra)
    return datasetPoints;
  }, [datasetPoints]);

  // Determina qual divisionCategoryId usar baseado no groupingValue
  // Se groupingValue for 'pais', não mostra nenhuma camada
  const divisionCategoryId = useMemo(() => {
    if (groupingValue === 'pais') return null;
    return GROUPING_TO_DIVISION_CATEGORY[groupingValue] || null;
  }, [groupingValue]);

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

    // Se for PSD Platform, usar loader com filtros baseado em selectedTerritory
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
      // Para outros datasets, usar loader padrão
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
    if (!selectedTerritory) {
      setTerritoryGeoJSON(null);
      return;
    }

    // Buscar GeoJSON apenas para State, Biome ou Municipality
    if (selectedTerritory.type === 'State' || selectedTerritory.type === 'Biome' || selectedTerritory.type === 'Municipality') {
      getTerritoryGeoJSON(selectedTerritory.type, selectedTerritory.name)
        .then((geoJSON) => {
          if (geoJSON && map) {
            setTerritoryGeoJSON(geoJSON);
            
            // Fazer zoom para o território usando o GeoJSON
            try {
              const geoJsonLayer = (L as any).geoJSON(geoJSON as any);
              const bounds = geoJsonLayer.getBounds();
              map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 12,
              });
            } catch (error) {
              console.error('Failed to fit bounds from GeoJSON:', error);
              // Fallback: usar bounding box dos pontos se GeoJSON não funcionar
              if (datasetPoints.length > 0) {
                try {
                  const pointsCollection = points(
                    datasetPoints.map(p => [p.longitude, p.latitude])
                  );
                  const bounds = bbox(pointsCollection);
                  const boundsArray: [[number, number], [number, number]] = [
                    [bounds[1], bounds[0]],
                    [bounds[3], bounds[2]],
                  ];
                  map.fitBounds(boundsArray, {
                    padding: [50, 50],
                    maxZoom: 12,
                  });
                } catch (err) {
                  console.error('Failed to calculate bounds from points:', err);
                }
              }
            }
          } else {
            setTerritoryGeoJSON(null);
            // Fallback: usar bounding box dos pontos
            if (map && datasetPoints.length > 0 && !isDatasetLoading) {
              try {
                const pointsCollection = points(
                  datasetPoints.map(p => [p.longitude, p.latitude])
                );
                const bounds = bbox(pointsCollection);
                const boundsArray: [[number, number], [number, number]] = [
                  [bounds[1], bounds[0]],
                  [bounds[3], bounds[2]],
                ];
                map.fitBounds(boundsArray, {
                  padding: [50, 50],
                  maxZoom: 12,
                });
              } catch (err) {
                console.error('Failed to calculate bounds from points:', err);
              }
            }
          }
        })
        .catch((error) => {
          console.error('Failed to fetch territory GeoJSON:', error);
          setTerritoryGeoJSON(null);
        });
    } else {
      setTerritoryGeoJSON(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTerritory, map]);

  // Handle territory selection - memoizado para evitar re-renders
  const handleTerritorySelect = useCallback((territory: TerritoryResult | null) => {
    setSelectedTerritory(territory);
    setTerritoryGeoJSON(null); // Reset GeoJSON when territory changes
    
    // Atualiza a camada de vector tiles baseado no tipo de território selecionado
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
          // Para País e Região, manter a camada atual ou usar biomas como padrão
          if (groupingValue === 'pais') {
            setGroupingValue('biomas');
          }
          break;
      }
    } else {
      // Quando nenhum território está selecionado, manter a camada atual
      // ou voltar para biomas se estiver em 'pais'
      if (groupingValue === 'pais') {
        setGroupingValue('biomas');
      }
    }
    
    // Quando um território é selecionado, os dados serão recarregados automaticamente
    // via useEffect que depende de selectedTerritory
    // O zoom será ajustado automaticamente quando os dados forem carregados
    if (!territory && map) {
      // Reset to Brazil view quando nenhum território está selecionado
      map.setView([-15.7801, -55.9292], 3.5);
    }
  }, [map, groupingValue]);

  // Calculate and emit statistics whenever data or territory changes
  useEffect(() => {
    if (!onStatisticsChange) return;

    const stats: MapStatistics = {
      totalDatasets: selectedDatasetId ? 1 : 0,
      totalSamples: datasetPoints.length,
      totalLocations: new Set(datasetPoints.map(p => `${p.latitude},${p.longitude}`)).size,
      totalProperties: datasetPoints.length > 0 ? Object.keys(datasetPoints[0]).length - 2 : 0, // -2 for lat/lng
      territoryName: selectedTerritory?.name || 'Brasil',
    };

    onStatisticsChange(stats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetPoints, selectedTerritory, selectedDatasetId]);


  const showEmptyState =
    !isDatasetLoading && !datasetError && !!selectedDatasetId && datasetPoints.length === 0;

  return (
    <div className="h-full w-full relative z-0">
      {/* Enhanced Loading Overlay */}
      {isDatasetLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-2000">
          <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-2xl border border-orange-100">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-orange-500 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-orange-600 mb-1">
                Carregando dados do solo
              </p>
              {datasetPoints.length > 0 && (
                <p className="text-sm text-gray-600">
                  {datasetPoints.length.toLocaleString('pt-BR')} pontos carregados
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error and Empty States */}
      {(datasetError || showEmptyState) && (
        <div className="absolute left-4 top-4 z-1000 max-w-xs">
          <div
            className="rounded-xl bg-white/95 p-3 text-sm text-neutral-900 shadow-lg border"
            style={{ borderColor: 'rgba(197,91,40,0.3)' }}
          >
            {datasetError && <p className="text-red-600">{datasetError}</p>}
            {showEmptyState && <p>Nenhum ponto disponível para este conjunto de dados.</p>}
          </div>
        </div>
      )}
      
      {/* @ts-ignore */}
      <MapContainer 
        // @ts-ignore
        center={[-15.7801, -55.9292] as [number, number]} 
        // @ts-ignore
        zoom={3.5} 
        // @ts-ignore
        style={{ height: '100%', width: '100%' }} 
        // @ts-ignore
        zoomControl={false}
        // @ts-ignore
        attributionControl={false}
      >
        <MapController />
        {/* @ts-ignore */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          // @ts-ignore
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Vector Tiles do MapBiomas baseado no grouping */}
        {divisionCategoryId && (
          <VectorTileLayer
            divisionCategoryId={divisionCategoryId}
            style={
              groupingValue === 'estados'
                ? {
                    color: '#D97706', // Amber-600
                    weight: 1,
                    fillColor: '#FEF3C7', // Amber-100
                    fillOpacity: 0.2,
                  }
                : groupingValue === 'biomas'
                ? {
                    color: '#059669', // Emerald-600
                    weight: 1,
                    fillColor: '#D1FAE5', // Emerald-100
                    fillOpacity: 0.2,
                  }
                : groupingValue === 'municipios'
                ? {
                    color: '#2563EB', // Blue-600
                    weight: 0.5,
                    fillColor: '#DBEAFE', // Blue-100
                    fillOpacity: 0.2,
                  }
                : {
                    weight: 1,
                    color: '#00ff00',
                    fill: false,
                  }
            }
            interactive={true}
            maxNativeZoom={14}
          />
        )}

        <MarkerClusterGroup 
          chunkedLoading
          maxClusterRadius={50}
          disableClusteringAtZoom={15}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          chunkDelay={100}
          chunkInterval={200}
          removeOutsideVisibleBounds={true}
        >
          {displayPoints.map((point: SoloDatasetPoint) => (
            <Marker 
              key={`${point.id}-${point.latitude}-${point.longitude}-${point.depth ?? 'no-depth'}`} 
              position={[point.latitude, point.longitude]}
            >
              {/* @ts-ignore - react-leaflet types */}
              <Popup maxWidth={360} minWidth={260}>
                <MarkerPopup point={point} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        
        {/* Highlight selected territory - GeoJSON do território real */}
        {selectedTerritory && territoryGeoJSON && (
          <GeoJSON
            key={selectedTerritory.id}
            data={territoryGeoJSON as any}
            pathOptions={{
              color: '#C55B28',
              weight: 2,
              fillColor: '#FED7AA',
              fillOpacity: 0.2,
            }}
          />
        )}

      </MapContainer>

      {/* Territory Search Bar - Positioned absolutely over the map */}
      <div className="absolute top-4 left-4 z-[500]">
        <TerritorySearchBar
          onSelectTerritory={handleTerritorySelect}
          selectedTerritory={selectedTerritory}
        />
      </div>

      {/* Layer Controls - Oculto pois a camada é controlada automaticamente pelo tipo de território selecionado */}
      {/* A camada de vector tiles é atualizada automaticamente quando um território é selecionado */}

      <MapLayout>
        <MapLayout.TopLeft />

        <MapLayout.BottomRight>
          <CompassControl
            bearing={0}
            pitch={0}
            reset={() => {}}
            className="opacity-50 cursor-not-allowed"
          />
          <ZoomControl
            onZoomIn={() => map?.zoomIn()}
            onZoomOut={() => map?.zoomOut()}
          />
        </MapLayout.BottomRight>
      </MapLayout>




    </div>
  );
}
