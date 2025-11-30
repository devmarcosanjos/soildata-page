import { create } from 'zustand';
import type L from 'leaflet';
import type { SoloDatasetPoint } from '@/features/platform/data/soloDatasets';
import type { MapStatistics } from '@/features/platform/components/PlatformMap';
import type { TerritoryResult } from '@/features/platform/components/TerritorySelector';
import { PSD_PLATFORM_DATASET_ID } from '@/features/platform/data/soloDatasets';

interface GeoJSONData {
  type: string;
  features?: Array<{
    type: string;
    properties?: Record<string, unknown>;
    geometry: {
      type: string;
      coordinates: unknown;
    };
  }>;
}

interface PlatformState {
  // Dataset selection
  selectedSoloDataset: string;
  setSelectedSoloDataset: (dataset: string) => void;

  // Map statistics
  mapStatistics: MapStatistics | undefined;
  setMapStatistics: (stats: MapStatistics | undefined) => void;

  // Header height
  headerHeight: number;
  setHeaderHeight: (height: number) => void;

  // Map instance
  map: L.Map | null;
  setMap: (map: L.Map | null) => void;

  // Dataset points
  datasetPoints: SoloDatasetPoint[];
  setDatasetPoints: (points: SoloDatasetPoint[]) => void;

  // Dataset loading state
  isDatasetLoading: boolean;
  setIsDatasetLoading: (loading: boolean) => void;

  // Dataset error
  datasetError: string | null;
  setDatasetError: (error: string | null) => void;

  // Grouping value
  groupingValue: string;
  setGroupingValue: (value: string) => void;

  // Selected territory
  selectedTerritory: TerritoryResult | null;
  setSelectedTerritory: (territory: TerritoryResult | null) => void;

  // GeoJSON data
  countryGeoJson: GeoJSONData | null;
  setCountryGeoJson: (geoJson: GeoJSONData | null) => void;

  brazilGeoJson: GeoJSONData | null;
  setBrazilGeoJson: (geoJson: GeoJSONData | null) => void;

  biomesGeoJson: GeoJSONData | null;
  setBiomesGeoJson: (geoJson: GeoJSONData | null) => void;

  municipalitiesGeoJson: GeoJSONData | null;
  setMunicipalitiesGeoJson: (geoJson: GeoJSONData | null) => void;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  // Initial state
  selectedSoloDataset: PSD_PLATFORM_DATASET_ID,
  mapStatistics: undefined,
  headerHeight: 65,
  map: null,
  datasetPoints: [],
  isDatasetLoading: false,
  datasetError: null,
  groupingValue: 'pais',
  selectedTerritory: null,
  countryGeoJson: null,
  brazilGeoJson: null,
  biomesGeoJson: null,
  municipalitiesGeoJson: null,

  // Actions - usando função estável para evitar re-renders
  setSelectedSoloDataset: (dataset) => set({ selectedSoloDataset: dataset }),
  setMapStatistics: (stats) => set({ mapStatistics: stats }),
  setHeaderHeight: (height) => set({ headerHeight: height }),
  setMap: (map) => set({ map }),
  setDatasetPoints: (points) => set({ datasetPoints: points }),
  setIsDatasetLoading: (loading) => set({ isDatasetLoading: loading }),
  setDatasetError: (error) => set({ datasetError: error }),
  setGroupingValue: (value) => set({ groupingValue: value }),
  setSelectedTerritory: (territory) => set({ selectedTerritory: territory }),
  setCountryGeoJson: (geoJson) => set({ countryGeoJson: geoJson }),
  setBrazilGeoJson: (geoJson) => set({ brazilGeoJson: geoJson }),
  setBiomesGeoJson: (geoJson) => set({ biomesGeoJson: geoJson }),
  setMunicipalitiesGeoJson: (geoJson) => set({ municipalitiesGeoJson: geoJson }),
}));

