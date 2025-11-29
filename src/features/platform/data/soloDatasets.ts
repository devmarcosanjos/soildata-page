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
  try {
    // Buscar dados da API local
    const { apiUrl } = await import('@/lib/api-config');
    const response = await fetch(apiUrl('api/soil-data'), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = `Falha ao buscar dados de solo da API: ${response.status} ${response.statusText}`;
      console.warn('⚠️ [Solo Datasets]', errorMessage);
      console.warn('   Tentando fallback local...');
      
      if (response.status === 0 || response.status === 500) {
        console.warn('   Possível problema de CORS ou servidor indisponível');
      }
      
      // Fallback para import local se a API não estiver disponível
      const enrichedData = await import('@/data/enriched-soil-data.json');
      const compactPoints = (enrichedData.default as any).points;
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
    }

    const payload = await response.json();
    
    if (payload.success && Array.isArray(payload.data)) {
      // Map compact field names to descriptive names
      return payload.data.map((p: any) => ({
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
    }

    return [];
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('❌ [Solo Datasets] Erro de rede - API pode estar indisponível ou bloqueada por CORS');
      console.error('   Usando fallback local...');
    } else {
      console.error('❌ [Solo Datasets] Erro ao buscar dados de solo:', error);
    }
    // Fallback para import local em caso de erro
    try {
      const enrichedData = await import('@/data/enriched-soil-data.json');
      const compactPoints = (enrichedData.default as any).points;
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
    } catch {
      return [];
    }
  }
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

export const soloDatasetOptions = soloDatasetDefinitions.map(({ id, label }, index) => ({
  id: id || `option-${index}`, // Garantir ID único
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
