export interface GranulometryRecord {
  datasetId: string;
  observationId: string;
  longitude: number;
  latitude: number;
  layerId: number;
  depthInitial: number;
  depthFinal: number;
  coarseFraction: number;
  clayFraction: number;
  siltFraction: number;
  sandFraction: number;
  biome: string | null;
  state: string | null;
  region: string | null;
  municipality: string | null;
}

export interface GranulometryQuery {
  datasetId?: string;
  biome?: string;
  state?: string;
  region?: string;
  municipality?: string;
  layerId?: number;
  limit?: number;
  offset?: number;
  sortBy?: 'datasetId' | 'observationId' | 'longitude' | 'latitude' | 'layerId' | 'depthInitial' | 'depthFinal' | 'clayFraction' | 'siltFraction' | 'sandFraction';
  sortOrder?: 'asc' | 'desc';
  minDepth?: number;
  maxDepth?: number;
  minLatitude?: number;
  maxLatitude?: number;
  minLongitude?: number;
  maxLongitude?: number;
  minClayFraction?: number;
  maxClayFraction?: number;
  minSiltFraction?: number;
  maxSiltFraction?: number;
  minSandFraction?: number;
  maxSandFraction?: number;
}

export interface GranulometryResponse {
  success: boolean;
  total: number;
  returned: number;
  pagination: {
    limit: number;
    offset: number;
  };
  filters: {
    datasetId?: string | null;
    biome?: string | null;
    state?: string | null;
    region?: string | null;
    municipality?: string | null;
    layerId?: number | null;
    minDepth?: number | null;
    maxDepth?: number | null;
    minLatitude?: number | null;
    maxLatitude?: number | null;
    minLongitude?: number | null;
    maxLongitude?: number | null;
    minClayFraction?: number | null;
    maxClayFraction?: number | null;
    minSiltFraction?: number | null;
    maxSiltFraction?: number | null;
    minSandFraction?: number | null;
    maxSandFraction?: number | null;
  };
  sorting: {
    sortBy?: string | null;
    sortOrder?: string | null;
  };
  data: GranulometryRecord[];
}

export interface GranulometrySummary {
  total: number;
  datasets: number;
  biomes: number;
  states: number;
  regions: number;
  municipalities: number;
  layers: number;
  availableFilters: {
    biomes: string[];
    states: string[];
    regions: string[];
    municipalities: string[];
    datasets: string[];
    layers: number[];
  };
}

export interface GranulometrySummaryResponse {
  success: boolean;
  total: number;
  datasets: number;
  biomes: number;
  states: number;
  regions: number;
  municipalities: number;
  layers: number;
  availableFilters: {
    biomes: string[];
    states: string[];
    regions: string[];
    municipalities: string[];
    datasets: string[];
    layers: number[];
  };
}

export interface GranulometryFractionQuery {
  fraction: 'clay' | 'silt' | 'sand' | 'coarse';
  biome?: string;
  region?: string;
  state?: string;
  municipality?: string;
  limit?: number;
  offset?: number;
}

export interface GranulometryFractionResponse {
  success: boolean;
  fraction: string;
  label: string;
  total: number;
  returned: number;
  pagination?: {
    limit: number;
    offset: number;
  };
  statistics: {
    min: number;
    max: number;
    mean: number;
    median: number;
    stdDev: number;
    q25: number;
    q75: number;
  };
  data: GranulometryRecord[];
}

export interface GranulometryFiltersResponse {
  success: boolean;
  filters: {
    biomes: string[];
    states: string[];
    regions: string[];
    municipalities: string[];
    datasets: string[];
    layers: number[];
  };
}

