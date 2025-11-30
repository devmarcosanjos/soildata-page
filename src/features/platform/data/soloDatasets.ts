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
  region?: string | null;
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

import { 
  getAllPSDPlatformData,
  getPSDByBiome,
  getPSDByEstado,
  getPSDByMunicipio,
  getPSDByRegiao,
} from '@/services/psdPlatformApi';
import { mapPSDRecordsToSoloPoints } from './psdDataMapper';
import type { TerritoryResult } from '@/features/platform/components/TerritorySelector';

export const PSD_PLATFORM_DATASET_ID = 'psd-platform-dataset';

const loadPSDPlatformDatasetPoints: SoloDatasetLoader = async () => {
  try {
    console.log('🔄 [PSD Platform] Carregando dados da API...');
    const response = await getAllPSDPlatformData();
    
    if (!response.success || !Array.isArray(response.data)) {
      console.error('❌ [PSD Platform] Resposta inválida da API');
      return [];
    }
    
    console.log(`✅ [PSD Platform] ${response.data.length} registros recebidos`);
    const points = mapPSDRecordsToSoloPoints(response.data);
    console.log(`✅ [PSD Platform] ${points.length} pontos mapeados`);
    
    return points;
  } catch (error) {
    console.error('❌ [PSD Platform] Erro ao buscar dados:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('   Erro de rede - API pode estar indisponível ou bloqueada por CORS');
    }
    return [];
  }
};

/**
 * Loader dinâmico que aceita filtros baseados em território selecionado
 */
export async function loadPSDPlatformWithFilters(territory: TerritoryResult | null): Promise<SoloDatasetPoint[]> {
  try {
    let response;
    
    if (!territory) {
      console.log('🔄 [PSD Platform] Carregando todos os dados...');
      response = await getAllPSDPlatformData();
    } else {
      console.log(`🔄 [PSD Platform] Carregando dados filtrados por ${territory.type}: ${territory.name}`);
      
      switch (territory.type) {
        case 'Biome':
          response = await getPSDByBiome(territory.name);
          break;
        case 'State':
          // A API aceita tanto nome completo quanto sigla
          console.log(`🔍 [PSD Platform] Filtrando por estado: "${territory.name}"`);
          response = await getPSDByEstado(territory.name);
          console.log(`✅ [PSD Platform] Resposta recebida: ${response.success ? 'sucesso' : 'erro'}, ${response.data?.length || 0} registros`);
          break;
        case 'Municipality':
          response = await getPSDByMunicipio(territory.name);
          break;
        case 'Region':
          response = await getPSDByRegiao(territory.name);
          break;
        default:
          console.warn(`⚠️ [PSD Platform] Tipo de território não suportado: ${territory.type}`);
          response = await getAllPSDPlatformData();
      }
    }
    
    if (!response.success || !Array.isArray(response.data)) {
      console.error('❌ [PSD Platform] Resposta inválida da API');
      return [];
    }
    
    console.log(`✅ [PSD Platform] ${response.data.length} registros recebidos`);
    const points = mapPSDRecordsToSoloPoints(response.data);
    console.log(`✅ [PSD Platform] ${points.length} pontos mapeados`);
    
    return points;
  } catch (error) {
    console.error('❌ [PSD Platform] Erro ao buscar dados:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('   Erro de rede - API pode estar indisponível ou bloqueada por CORS');
    }
    return [];
  }
}

const soloDatasetDefinitions: SoloDatasetDefinition[] = [
  {
    id: PSD_PLATFORM_DATASET_ID,
    label: 'Pontos Soildata',
    loader: loadPSDPlatformDatasetPoints,
    description: 'Dados de granulometria de solo (41.925 amostras) com informações de bioma, estado, município e região',
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
