export interface SoloDatasetPoint {
  id: string;
  latitude: number;
  longitude: number;
  depth?: number | null;
  logClaySand?: number | null;
  logSiltSand?: number | null;
  datasetCode: string;
  
  // Enriched fields (pre-computed)
  state?: string | null;
  municipality?: string | null;
  biome?: string | null;
  title?: string;
  doi?: string | null;
  datasetUrl?: string;
  csvDataUri?: string;
}

export type SoloDatasetLoader = () => Promise<SoloDatasetPoint[]>;

export interface SoloDatasetDefinition {
  id: string;
  label: string;
  loader: SoloDatasetLoader;
  description?: string;
}

export const BRAZILIAN_SOIL_DATASET_ID = 'brazilian-soil-dataset';

const loadBrazilianSoilDatasetPoints: SoloDatasetLoader = async () => {
  const enrichedData = await import('@/data/enriched-soil-data.json');
  const compactPoints = (enrichedData.default as any).points;
  
  // Map compact field names to descriptive names
  return compactPoints.map((p: any) => ({
    id: p.id,
    latitude: p.lat,
    longitude: p.lon,
    depth: p.d,
    logClaySand: p.lcs,
    logSiltSand: p.lss,
    datasetCode: p.dc,
    state: p.st,
    municipality: p.mu,
    biome: p.bi,
    title: p.ti,
    doi: p.doi,
    datasetUrl: p.url,
    csvDataUri: p.csv,
  })) as SoloDatasetPoint[];
};

const emptyLoader: SoloDatasetLoader = async () => [];

const soloDatasetDefinitions: SoloDatasetDefinition[] = [
  {
    id: BRAZILIAN_SOIL_DATASET_ID,
    label: 'Brazilian Soil Dataset',
    loader: loadBrazilianSoilDatasetPoints,
  },
  {
    id: 'estoque-carbono-organico',
    label: 'Estoque de carbono orgânico',
    loader: emptyLoader,
  },
  {
    id: 'fracao-grossa',
    label: 'Fração grossa',
    loader: emptyLoader,
  },
  {
    id: 'fracao-areia',
    label: 'Fração areia',
    loader: emptyLoader,
  },
  {
    id: 'fracao-silte',
    label: 'Fração silte',
    loader: emptyLoader,
  },
  {
    id: 'fracao-argila',
    label: 'Fração argila',
    loader: emptyLoader,
  },
];

export const soloDatasetOptions = soloDatasetDefinitions.map(({ id, label }) => ({
  label,
  value: id,
}));

export const soloDatasetLoaders = soloDatasetDefinitions.reduce<Record<string, SoloDatasetLoader>>(
  (acc, dataset) => {
    acc[dataset.id] = dataset.loader;
    return acc;
  },
  {},
);
