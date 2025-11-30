import { create } from 'zustand';
import type { SoloDatasetPoint } from '@/features/platform/data/soloDatasets';
import type { MapStatistics } from '@/features/platform/components/PlatformMap';
import type { TerritoryResult } from '@/features/platform/components/TerritorySelector';
import { PSD_PLATFORM_DATASET_ID } from '@/features/platform/data/soloDatasets';

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
  map: any;
  setMap: (map: any) => void;

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
}));

