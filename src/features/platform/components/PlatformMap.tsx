import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapLayout, CompassControl, ZoomControl } from '@mapbiomas/ui';
import { soloDatasetLoaders } from '@/features/platform/data/soloDatasets';
import type { SoloDatasetPoint } from '@/features/platform/data/soloDatasets';
import { TerritorySearchBar } from './TerritorySearchBar';
import type { TerritoryResult } from './TerritorySelector';
import bbox from '@turf/bbox';


// Fix for default Leaflet marker icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface GeoJSONFeature {
  type: string;
  properties?: {
    NAME?: string;
    name?: string;
    ISO_A3?: string;
    ISO_A2?: string;
    [key: string]: unknown;
  };
  geometry: {
    type: string;
    coordinates: unknown;
  };
}

interface GeoJSONData {
  type: string;
  features?: GeoJSONFeature[];
}

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

const groupingOptions = [
  { id: 'pais', name: 'Brasil' },
  { id: 'estados', name: 'Agrupar por Estados' },
  { id: 'municipios', name: 'Agrupar por Municípios' },
  { id: 'biomas', name: 'Agrupar por Biomas' },
];



// Component to expose the map instance to the parent
function MapController({ setMap }: { setMap: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    setMap(map);
  }, [map, setMap]);
  return null;
}

export function PlatformMap({ selectedDatasetId, onStatisticsChange }: PlatformMapProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  const [datasetPoints, setDatasetPoints] = useState<SoloDatasetPoint[]>([]);
  const [isDatasetLoading, setIsDatasetLoading] = useState(false);
  const [datasetError, setDatasetError] = useState<string | null>(null);

  const [groupingValue] = useState(groupingOptions[0].id);
  const [countryGeoJson, setCountryGeoJson] = useState<GeoJSONData | null>(null);
  const [brazilGeoJson, setBrazilGeoJson] = useState<GeoJSONData | null>(null);
  const [biomesGeoJson, setBiomesGeoJson] = useState<GeoJSONData | null>(null);
  const [municipalitiesGeoJson, setMunicipalitiesGeoJson] = useState<GeoJSONData | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryResult | null>(null);


  // Use filtered points if filters are active, otherwise use grouping filter
  // Use grouping filter
  const displayPoints = useMemo(() => {
    if (groupingValue === 'pais') return datasetPoints;
    if (groupingValue === 'estados') return datasetPoints.filter(p => p.state);
    if (groupingValue === 'municipios') return datasetPoints.filter(p => p.municipality);
    if (groupingValue === 'biomas') return datasetPoints.filter(p => p.biome);
    
    return datasetPoints;
  }, [datasetPoints, groupingValue]);

  // Load GeoJSONs - now using local files for better performance
  useEffect(() => {
    // Import local GeoJSON files
    import('@/features/platform/data/geoJsonData').then(({ getCountryGeoJson, getStatesGeoJson, getBiomesGeoJson }) => {
      setCountryGeoJson(getCountryGeoJson() as GeoJSONData);
      setBrazilGeoJson(getStatesGeoJson() as GeoJSONData);
      setBiomesGeoJson(getBiomesGeoJson() as GeoJSONData);
    }).catch(err => console.error('Failed to load GeoJSON:', err));
  }, []);

  // Lazy load municipalities only when needed
  useEffect(() => {
    if (groupingValue === 'municipios' && !municipalitiesGeoJson) {
      import('@/features/platform/data/geoJsonData').then(({ getMunicipalitiesGeoJson }) => {
        getMunicipalitiesGeoJson()
          .then(data => setMunicipalitiesGeoJson(data as GeoJSONData))
          .catch(err => console.error('Failed to load Municipalities GeoJSON:', err));
      });
    }
  }, [groupingValue, municipalitiesGeoJson]);

  useEffect(() => {
    let isCancelled = false;

    if (!selectedDatasetId) {
      setDatasetPoints([]);
      setDatasetError(null);
      return () => { isCancelled = true; };
    }

    const loader = soloDatasetLoaders[selectedDatasetId];
    if (!loader) {
      setDatasetPoints([]);
      setDatasetError('Dataset não configurado.');
      return () => { isCancelled = true; };
    }

    setIsDatasetLoading(true);
    setDatasetError(null);

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

    return () => { isCancelled = true; };
  }, [selectedDatasetId]);

  // Handle territory selection and zoom to bounds
  const handleTerritorySelect = (territory: TerritoryResult | null) => {
    setSelectedTerritory(territory);
    
    if (territory?.feature && map) {
      try {
        const bounds = bbox(territory.feature);
        map.fitBounds([
          [bounds[1], bounds[0]],
          [bounds[3], bounds[2]]
        ], { padding: [50, 50] });
      } catch (error) {
        console.error('Failed to zoom to territory:', error);
      }
    } else if (!territory && map) {
      // Reset to Brazil view
      map.setView([-15.7801, -55.9292], 3.5);
    }
  };

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
  }, [datasetPoints, selectedTerritory, selectedDatasetId, onStatisticsChange]);


  const showEmptyState =
    !isDatasetLoading && !datasetError && !!selectedDatasetId && datasetPoints.length === 0;

  return (
    <div className="h-full w-full relative z-0">
      {/* Enhanced Loading Overlay */}
      {isDatasetLoading && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-[2000]">
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
        <div className="absolute left-4 top-4 z-[1000] max-w-xs">
          <div
            className="rounded-xl bg-white/95 p-3 text-sm text-neutral-900 shadow-lg border"
            style={{ borderColor: 'rgba(197,91,40,0.3)' }}
          >
            {datasetError && <p className="text-red-600">{datasetError}</p>}
            {showEmptyState && <p>Nenhum ponto disponível para este conjunto de dados.</p>}
          </div>
        </div>
      )}
      
      <MapContainer 
        center={[-15.7801, -55.9292]} 
        zoom={3.5} 
        style={{ height: '100%', width: '100%' }} 
        zoomControl={false}
        attributionControl={false}
      >
        <MapController setMap={setMap} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Layers based on grouping */}

        {/* 1. States */}
        {groupingValue === 'estados' && brazilGeoJson && (
          <GeoJSON
            data={brazilGeoJson as any}
            style={{
              color: '#D97706', // Amber-600
              weight: 1,
              fillColor: '#FEF3C7', // Amber-100
              fillOpacity: 0.2,
            }}
          />
        )}

        {/* 2. Biomes */}
        {groupingValue === 'biomas' && biomesGeoJson && (
          <GeoJSON
            data={biomesGeoJson as any}
            style={{
              color: '#059669', // Emerald-600
              weight: 1,
              fillColor: '#D1FAE5', // Emerald-100
              fillOpacity: 0.2,
            }}
          />
        )}

        {/* 3. Municipalities */}
        {groupingValue === 'municipios' && municipalitiesGeoJson && (
          <GeoJSON
            data={municipalitiesGeoJson as any}
            style={{
              color: '#2563EB', // Blue-600
              weight: 0.5,
              fillColor: '#DBEAFE', // Blue-100
              fillOpacity: 0.2,
            }}
          />
        )}

        <MarkerClusterGroup 
          chunkedLoading
          maxClusterRadius={50}
          disableClusteringAtZoom={15}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={true}
          removeOutsideVisibleBounds={true}
        >
          {displayPoints.map((point: SoloDatasetPoint) => (
            <Marker 
              key={point.id} 
              position={[point.latitude, point.longitude]}
            >
              <Popup maxWidth={360} minWidth={260}>
                <div className="flex flex-col gap-4 p-1">
                  <div>
                    <div className="text-lg font-bold mb-2" style={{ color: '#C55B28' }}>
                      {point.id}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#C55B28' }}>
                      Título do projeto
                    </div>
                    <div className="text-sm text-base-content leading-relaxed" style={{ lineHeight: 1.6 }}>
                      {point.title || point.datasetCode.toUpperCase()}
                    </div>
                    {point.doi && (
                      <div className="text-xs font-semibold mt-2" style={{ color: '#C55B28' }}>
                        <a 
                          href={`https://soildata.mapbiomas.org/dataset.xhtml?persistentId=${point.doi}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#C55B28', textDecoration: 'underline' }}
                        >
                          DOI: {point.doi}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      className="btn btn-sm text-white border-none hover:opacity-90"
                      style={{ backgroundColor: '#C55B28', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      href={point.datasetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Acessar trabalho de origem
                    </a>
                    <a
                      className="btn btn-sm btn-outline hover:bg-orange-50"
                      style={{ borderColor: '#C55B28', color: '#C55B28', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      href={point.csvDataUri}
                      download={`${point.id}.csv`}
                    >
                      Descarregar dados do ponto
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        
        {/* Highlight selected territory */}
        {selectedTerritory?.feature && (
          <GeoJSON
            key={selectedTerritory.id}
            data={selectedTerritory.feature as any}
            style={{
              color: '#C55B28',
              weight: 2,
              fillColor: '#FED7AA',
              fillOpacity: 0.3,
            }}
          />
        )}

      </MapContainer>

      {/* Territory Search Bar - Positioned absolutely over the map */}
      <div className="absolute top-4 left-4 z-[400]">
        <TerritorySearchBar
          countryGeoJson={countryGeoJson}
          statesGeoJson={brazilGeoJson}
          biomesGeoJson={biomesGeoJson}
          municipalitiesGeoJson={municipalitiesGeoJson}
          onSelectTerritory={handleTerritorySelect}
          selectedTerritory={selectedTerritory}
        />
      </div>

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
