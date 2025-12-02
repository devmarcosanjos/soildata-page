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
  getAllGranulometryData,
  getGranulometryByBiome,
  getGranulometryByState,
  getGranulometryByMunicipality,
  getGranulometryByRegion,
} from '@/services/granulometryApi';
import { mapGranulometryRecordsToSoloPoints } from './granulometryDataMapper';
import type { TerritoryResult } from '@/features/platform/components/TerritorySelector';

export const GRANULOMETRY_DATASET_ID = 'granulometry-dataset';

const loadGranulometryDatasetPoints: SoloDatasetLoader = async () => {
  try {
    console.log('🔄 [Granulometry] Carregando dados da API...');
    const response = await getAllGranulometryData();
    
    console.log('📋 [Granulometry] Resposta completa:', {
      success: response.success,
      total: response.total,
      returned: response.returned,
      dataIsArray: Array.isArray(response.data),
      dataLength: response.data?.length || 0,
      firstRecord: response.data?.[0] || null,
    });
    
    if (!response.success) {
      console.error('❌ [Granulometry] Resposta não foi bem-sucedida:', response);
      return [];
    }
    
    if (!Array.isArray(response.data)) {
      console.error('❌ [Granulometry] Resposta inválida da API - data não é um array:', typeof response.data, response.data);
      return [];
    }
    
    if (response.data.length === 0) {
      console.warn('⚠️ [Granulometry] Nenhum registro retornado pela API');
      return [];
    }
    
    console.log(`✅ [Granulometry] ${response.data.length} registros recebidos`);
    const points = mapGranulometryRecordsToSoloPoints(response.data);
    console.log(`✅ [Granulometry] ${points.length} pontos mapeados`);
    
    if (points.length === 0) {
      console.warn('⚠️ [Granulometry] Nenhum ponto foi mapeado após conversão');
    }
    
    return points;
  } catch (error) {
    console.error('❌ [Granulometry] Erro ao buscar dados:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('   Erro de rede - API pode estar indisponível ou bloqueada por CORS');
      console.error('   Verifique se a API está rodando em http://localhost:3000');
    }
    return [];
  }
};

/**
 * Loader dinâmico que aceita filtros baseados em território selecionado
 */
export async function loadGranulometryWithFilters(territory: TerritoryResult | null): Promise<SoloDatasetPoint[]> {
  try {
    let response;
    
    if (!territory) {
      console.log('🔄 [Granulometry] Carregando todos os dados...');
      response = await getAllGranulometryData();
    } else {
      console.log(`🔄 [Granulometry] Carregando dados filtrados por ${territory.type}: ${territory.name}`);
      
      switch (territory.type) {
        case 'Biome':
          response = await getGranulometryByBiome(territory.name);
          break;
        case 'State':
          console.log(`🔍 [Granulometry] Filtrando por estado: "${territory.name}"`);
          response = await getGranulometryByState(territory.name);
          console.log(`✅ [Granulometry] Resposta recebida: ${response.success ? 'sucesso' : 'erro'}, ${response.total || 0} registros`);
          break;
        case 'Municipality':
          response = await getGranulometryByMunicipality(territory.name);
          break;
        case 'Region':
          response = await getGranulometryByRegion(territory.name);
          break;
        default:
          console.warn(`⚠️ [Granulometry] Tipo de território não suportado: ${territory.type}`);
          response = await getAllGranulometryData();
      }
    }
    
    if (!response.success || !Array.isArray(response.data)) {
      console.error('❌ [Granulometry] Resposta inválida da API');
      return [];
    }
    
    console.log(`✅ [Granulometry] ${response.data.length} registros recebidos`);
    
    // Verificar se os dados recebidos têm o bioma correto (para debug)
    if (territory?.type === 'Biome' && response.data.length > 0) {
      const biomesCount = response.data.reduce((acc: Record<string, number>, r: any) => {
        const biome = r.biome || 'null';
        acc[biome] = (acc[biome] || 0) + 1;
        return acc;
      }, {});
      console.log(`🔍 [Granulometry] Distribuição de biomas nos dados recebidos:`, biomesCount);
      
      const normalize = (v: string) => v.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
      const wrongBiomes = Object.keys(biomesCount).filter(b => {
        return normalize(b) !== normalize(territory.name);
      });
      if (wrongBiomes.length > 0) {
        console.warn(`⚠️ [Granulometry] Dados com biomas incorretos encontrados:`, wrongBiomes);
        console.warn(`   Esperado: "${territory.name}", Recebido:`, Object.keys(biomesCount));
      }
    }
    
    const points = mapGranulometryRecordsToSoloPoints(response.data);
    console.log(`✅ [Granulometry] ${points.length} pontos mapeados`);
    
    return points;
  } catch (error) {
    console.error('❌ [Granulometry] Erro ao buscar dados:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('   Erro de rede - API pode estar indisponível ou bloqueada por CORS');
    }
    return [];
  }
}

const soloDatasetDefinitions: SoloDatasetDefinition[] = [
  {
    id: GRANULOMETRY_DATASET_ID,
    label: 'Pontos Soildata',
    loader: loadGranulometryDatasetPoints,
    description: 'Dados de granulometria de solo com informações de bioma, estado, município e região',
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
