import { apiUrl } from '@/lib/api-config';
import type {
  GranulometryQuery,
  GranulometryResponse,
  GranulometrySummaryResponse,
  GranulometryFiltersResponse,
  GranulometryFractionQuery,
  GranulometryFractionResponse,
} from '@/types/granulometry';

async function fetchGranulometry<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorMessage = `HTTP error fetching ${url}: ${response.status} ${response.statusText}`;

      if (response.status === 0 || response.status === 500) {
        console.error('❌ [Granulometry API]', errorMessage);
        console.error('   Possível problema de CORS ou servidor indisponível');
      } else if (response.status === 404) {
        console.warn('⚠️ [Granulometry API]', errorMessage);
        console.warn('   Endpoint não encontrado - verifique a URL da API');
      } else {
        console.warn('⚠️ [Granulometry API]', errorMessage);
      }

      throw new Error(errorMessage);
    }

    const responseData = await response.json();

    if (responseData.success !== undefined) {
      return responseData as T;
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error(`❌ [Granulometry API] Erro de rede ao buscar ${url}`);
      console.error('   API pode estar indisponível ou bloqueada por CORS');
      console.error('   Verifique se a API está rodando e acessível');
    } else if (error instanceof Error && !error.message.includes('status: 500')) {
      console.error(`❌ [Granulometry API] Erro ao buscar ${url}:`, error);
    }
    throw error;
  }
}

function buildQueryString(params: GranulometryQuery): string {
  const searchParams = new URLSearchParams();
  
  if (params.datasetId) searchParams.set('datasetId', params.datasetId);
  if (params.biome) searchParams.set('biome', params.biome);
  if (params.state) searchParams.set('state', params.state);
  if (params.region) searchParams.set('region', params.region);
  if (params.municipality) searchParams.set('municipality', params.municipality);
  if (params.layerId !== undefined) searchParams.set('layerId', String(params.layerId));
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params.offset !== undefined) searchParams.set('offset', String(params.offset));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  if (params.minDepth !== undefined) searchParams.set('minDepth', String(params.minDepth));
  if (params.maxDepth !== undefined) searchParams.set('maxDepth', String(params.maxDepth));
  if (params.minLatitude !== undefined) searchParams.set('minLatitude', String(params.minLatitude));
  if (params.maxLatitude !== undefined) searchParams.set('maxLatitude', String(params.maxLatitude));
  if (params.minLongitude !== undefined) searchParams.set('minLongitude', String(params.minLongitude));
  if (params.maxLongitude !== undefined) searchParams.set('maxLongitude', String(params.maxLongitude));
  if (params.minClayFraction !== undefined) searchParams.set('minClayFraction', String(params.minClayFraction));
  if (params.maxClayFraction !== undefined) searchParams.set('maxClayFraction', String(params.maxClayFraction));
  if (params.minSiltFraction !== undefined) searchParams.set('minSiltFraction', String(params.minSiltFraction));
  if (params.maxSiltFraction !== undefined) searchParams.set('maxSiltFraction', String(params.maxSiltFraction));
  if (params.minSandFraction !== undefined) searchParams.set('minSandFraction', String(params.minSandFraction));
  if (params.maxSandFraction !== undefined) searchParams.set('maxSandFraction', String(params.maxSandFraction));
  
  return searchParams.toString();
}

/**
 * Busca dados de granulometria com filtros opcionais
 */
export async function getGranulometryData(query?: GranulometryQuery): Promise<GranulometryResponse> {
  const queryString = query ? buildQueryString(query) : '';
  const url = queryString 
    ? `${apiUrl('api/granulometry')}?${queryString}`
    : apiUrl('api/granulometry');
  
  return fetchGranulometry<GranulometryResponse>(url);
}

/**
 * Busca todos os dados de granulometria (sem paginação)
 * Usa um limite alto para buscar todos os dados disponíveis
 * A API tem limite máximo de 1000, então fazemos múltiplas requisições se necessário
 */
export async function getAllGranulometryData(query?: Omit<GranulometryQuery, 'limit' | 'offset'>): Promise<GranulometryResponse> {
  // Primeiro, buscar com limite de 1000 (máximo da API)
  const queryParams: GranulometryQuery = {
    ...query,
    limit: 1000, // Limite máximo da API
    offset: 0,
  };
  const queryString = buildQueryString(queryParams);
  const url = `${apiUrl('api/granulometry')}?${queryString}`;
  
  console.log(`🌐 [Granulometry API] Buscando todos os dados -> URL: ${url}`);
  const response = await fetchGranulometry<GranulometryResponse>(url);
  console.log(`📊 [Granulometry API] Resposta: success=${response.success}, total=${response.total}, returned=${response.returned}, data.length=${response.data?.length || 0}`);
  
  // Se há mais dados do que o retornado, fazer requisições adicionais
  if (response.success && response.total > response.returned && response.returned === 1000) {
    console.log(`🔄 [Granulometry API] Há mais dados (${response.total} total). Buscando em lotes...`);
    const allData = [...response.data];
    let offset = 1000;
    
    while (offset < response.total && allData.length < 50000) { // Limite de segurança
      const nextQueryParams: GranulometryQuery = {
        ...query,
        limit: 1000,
        offset,
      };
      const nextQueryString = buildQueryString(nextQueryParams);
      const nextUrl = `${apiUrl('api/granulometry')}?${nextQueryString}`;
      
      try {
        const nextResponse = await fetchGranulometry<GranulometryResponse>(nextUrl);
        if (nextResponse.success && Array.isArray(nextResponse.data)) {
          allData.push(...nextResponse.data);
          offset += nextResponse.returned;
          console.log(`📊 [Granulometry API] Lote carregado: ${nextResponse.returned} registros. Total acumulado: ${allData.length}`);
          
          if (nextResponse.returned < 1000) {
            break; // Último lote
          }
        } else {
          break;
        }
      } catch (error) {
        console.warn(`⚠️ [Granulometry API] Erro ao buscar lote em offset ${offset}:`, error);
        break;
      }
    }
    
    return {
      ...response,
      data: allData,
      returned: allData.length,
    };
  }
  
  return response;
}

/**
 * Busca dados de granulometria filtrados por bioma
 */
export async function getGranulometryByBiome(
  biome: string,
  query?: Omit<GranulometryQuery, 'biome' | 'limit' | 'offset'>
): Promise<GranulometryResponse> {
  const queryParams: GranulometryQuery = {
    ...query,
    biome,
  };
  const queryString = buildQueryString(queryParams);
  const url = `${apiUrl('api/granulometry')}?${queryString}`;
  
  console.log(`🌐 [Granulometry API] Buscando bioma: "${biome}" -> URL: ${url}`);
  const response = await fetchGranulometry<GranulometryResponse>(url);
  console.log(`📊 [Granulometry API] Resposta: success=${response.success}, total=${response.total}, returned=${response.returned}`);
  
  return response;
}

/**
 * Busca dados de granulometria filtrados por estado
 */
export async function getGranulometryByState(
  state: string,
  query?: Omit<GranulometryQuery, 'state' | 'limit' | 'offset'>
): Promise<GranulometryResponse> {
  const queryParams: GranulometryQuery = {
    ...query,
    state,
  };
  const queryString = buildQueryString(queryParams);
  const url = `${apiUrl('api/granulometry')}?${queryString}`;
  
  console.log(`🌐 [Granulometry API] Buscando estado: "${state}" -> URL: ${url}`);
  const response = await fetchGranulometry<GranulometryResponse>(url);
  console.log(`📊 [Granulometry API] Resposta: success=${response.success}, total=${response.total}, returned=${response.returned}`);
  
  return response;
}

/**
 * Busca dados de granulometria filtrados por município
 */
export async function getGranulometryByMunicipality(
  municipality: string,
  query?: Omit<GranulometryQuery, 'municipality' | 'limit' | 'offset'>
): Promise<GranulometryResponse> {
  const queryParams: GranulometryQuery = {
    ...query,
    municipality,
  };
  const queryString = buildQueryString(queryParams);
  const url = `${apiUrl('api/granulometry')}?${queryString}`;
  
  return fetchGranulometry<GranulometryResponse>(url);
}

/**
 * Busca dados de granulometria filtrados por região
 */
export async function getGranulometryByRegion(
  region: string,
  query?: Omit<GranulometryQuery, 'region' | 'limit' | 'offset'>
): Promise<GranulometryResponse> {
  const queryParams: GranulometryQuery = {
    ...query,
    region,
  };
  const queryString = buildQueryString(queryParams);
  const url = `${apiUrl('api/granulometry')}?${queryString}`;
  
  return fetchGranulometry<GranulometryResponse>(url);
}

/**
 * Busca resumo/estatísticas de granulometria
 */
export async function getGranulometrySummary(): Promise<GranulometrySummaryResponse> {
  const url = apiUrl('api/granulometry/summary');
  return fetchGranulometry<GranulometrySummaryResponse>(url);
}

/**
 * Busca filtros disponíveis
 */
export async function getGranulometryFilters(): Promise<GranulometryFiltersResponse> {
  const url = apiUrl('api/granulometry/filters');
  return fetchGranulometry<GranulometryFiltersResponse>(url);
}

/**
 * Busca biomas disponíveis
 */
export async function getAvailableBiomes(): Promise<string[]> {
  const response = await getGranulometryFilters();
  return response.filters.biomes || [];
}

/**
 * Busca estados disponíveis
 */
export async function getAvailableStates(): Promise<string[]> {
  const response = await getGranulometryFilters();
  return response.filters.states || [];
}

/**
 * Busca municípios disponíveis
 */
export async function getAvailableMunicipalities(): Promise<string[]> {
  const response = await getGranulometryFilters();
  return response.filters.municipalities || [];
}

/**
 * Busca regiões disponíveis
 */
export async function getAvailableRegions(): Promise<string[]> {
  const response = await getGranulometryFilters();
  return response.filters.regions || [];
}

/**
 * Busca análise de frações de granulometria
 */
export async function getGranulometryFractionAnalysis(
  query: GranulometryFractionQuery
): Promise<GranulometryFractionResponse> {
  const searchParams = new URLSearchParams();
  
  searchParams.set('fraction', query.fraction);
  if (query.biome) searchParams.set('biome', query.biome);
  if (query.region) searchParams.set('region', query.region);
  if (query.state) searchParams.set('state', query.state);
  if (query.municipality) searchParams.set('municipality', query.municipality);
  if (query.limit !== undefined) searchParams.set('limit', String(query.limit));
  if (query.offset !== undefined) searchParams.set('offset', String(query.offset));
  
  const url = `${apiUrl('api/granulometry/fractions')}?${searchParams.toString()}`;
  return fetchGranulometry<GranulometryFractionResponse>(url);
}

/**
 * Normaliza nomes de biomas do SoilData para o formato esperado pela API MapBiomas
 */
function normalizeBiomeNameForMapBiomas(name: string): string {
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const n = normalize(name);

  switch (n) {
    case 'amazonia':
      // API MapBiomas costuma usar "Amazonia" (sem acento)
      return 'Amazonia';
    case 'mata atlantica':
      return 'Mata Atlantica';
    default:
      // Para outros biomas (Cerrado, Caatinga, Pampa, Pantanal),
      // normalmente o nome já é aceito como está
      return name;
  }
}

// Base URL da API pública da plataforma MapBiomas Brasil
const MAPBIOMAS_API_BASE_URL = 'https://prd.plataforma.mapbiomas.org/api/v1';

// Tipos auxiliares para as APIs de ponto da plataforma MapBiomas
export interface MapBiomasPropertyAtPoint {
  propertyCode: string;
}

export interface MapBiomasTerritoryCategory {
  id: number;
  name: Record<string, string>;
}

export interface MapBiomasTerritoryAtPoint {
  id: string;
  name: string;
  nameFormatted?: string;
  category: MapBiomasTerritoryCategory;
}

export interface MapBiomasPixelHistoryItem {
  pixelValue: number;
  year: number;
}

async function fetchMapBiomas<T>(pathAndQuery: string): Promise<T> {
  const url = `${MAPBIOMAS_API_BASE_URL}${pathAndQuery}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = `HTTP error fetching ${url}: ${response.status} ${response.statusText}`;
      console.warn('⚠️ [MapBiomas API]', errorMessage);
      throw new Error(errorMessage);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error(`❌ [MapBiomas API] Erro de rede ao buscar ${url}`);
      console.error('   API pode estar indisponível ou bloqueada por CORS');
    } else {
      console.error(`❌ [MapBiomas API] Erro ao buscar ${url}:`, error);
    }
    throw error;
  }
}

/**
 * Busca GeoJSON do território selecionado da API MapBiomas
 */
export async function getTerritoryGeoJSON(
  type: 'State' | 'Biome' | 'Municipality' | 'Region',
  name: string
): Promise<any | null> {
  try {
    const mapbiomasApiUrl = 'https://prd.plataforma.mapbiomas.org/api/v1/brazil/territories';
    let url = '';
    
    switch (type) {
      case 'State':
        url = `${mapbiomasApiUrl}/estado/${encodeURIComponent(name)}`;
        break;
      case 'Biome': {
        const apiName = normalizeBiomeNameForMapBiomas(name);
        url = `${mapbiomasApiUrl}/bioma/${encodeURIComponent(apiName)}`;
        break;
      }
      case 'Municipality':
        url = `${mapbiomasApiUrl}/municipio/${encodeURIComponent(name)}`;
        break;
      case 'Region':
        // Para regiões, vamos tentar buscar como macro-região
        // Se não funcionar, podemos construir a partir dos estados
        url = `${mapbiomasApiUrl}/regiao/${encodeURIComponent(name)}`;
        break;
      default:
        console.warn(`⚠️ [MapBiomas API] Tipo de território não suportado: ${type}`);
        return null;
    }
    
    console.log(`🌐 [MapBiomas API] Buscando GeoJSON: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn(`⚠️ [MapBiomas API] HTTP ${response.status}: Não foi possível buscar GeoJSON para ${type}: ${name}`);
      console.warn(`⚠️ [MapBiomas API] URL: ${url}`);
      
      // Para Region, pode não existir endpoint específico
      if (type === 'Region' && response.status === 404) {
        console.warn(`⚠️ [MapBiomas API] Endpoint de região não encontrado. Regiões podem precisar ser construídas a partir dos estados.`);
      }
      
      return null;
    }
    
    const data = await response.json();
    console.log(`✅ [MapBiomas API] GeoJSON recebido para ${type}: ${name}`, {
      type: data?.type,
      hasFeatures: Array.isArray(data?.features),
      featureCount: data?.features?.length,
      hasGeometry: !!data?.geometry
    });
    
    return data;
  } catch (error) {
    console.error(`❌ [MapBiomas API] Erro ao buscar GeoJSON para ${type}: ${name}`, error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('   Erro de rede - API pode estar indisponível ou bloqueada por CORS');
    }
    return null;
  }
}

/**
 * Consulta os códigos de imóvel (CAR) que interceptam um ponto.
 *
 * GET /brazil/properties/point
 */
export async function getPropertiesByPoint(
  longitude: number,
  latitude: number
): Promise<MapBiomasPropertyAtPoint[]> {
  const params = new URLSearchParams({
    longitude: String(longitude),
    latitude: String(latitude),
  });

  const data = await fetchMapBiomas<any>(`/brazil/properties/point?${params.toString()}`);

  if (Array.isArray(data)) {
    return data as MapBiomasPropertyAtPoint[];
  }

  if (Array.isArray((data as any).properties)) {
    return (data as any).properties as MapBiomasPropertyAtPoint[];
  }

  if (Array.isArray((data as any).data)) {
    return (data as any).data as MapBiomasPropertyAtPoint[];
  }

  return [];
}

/**
 * Consulta todos os recortes territoriais que contêm um ponto.
 *
 * GET /brazil/territories/point
 */
export async function getTerritoriesByPoint(
  longitude: number,
  latitude: number
): Promise<MapBiomasTerritoryAtPoint[]> {
  const params = new URLSearchParams({
    longitude: String(longitude),
    latitude: String(latitude),
  });

  const data = await fetchMapBiomas<any>(`/brazil/territories/point?${params.toString()}`);

  if (Array.isArray(data)) {
    return data as MapBiomasTerritoryAtPoint[];
  }

  if (Array.isArray((data as any).territories)) {
    return (data as any).territories as MapBiomasTerritoryAtPoint[];
  }

  if (Array.isArray((data as any).data)) {
    return (data as any).data as MapBiomasTerritoryAtPoint[];
  }

  return [];
}

/**
 * Consulta o histórico anual da classe de uso/cobertura de um pixel.
 *
 * GET /brazil/maps/pixel-history
 */
export async function getPixelHistoryByPoint(
  longitude: number,
  latitude: number,
  options?: {
    subthemeKey?: string;
    legendId?: string;
  }
): Promise<MapBiomasPixelHistoryItem[]> {
  const params = new URLSearchParams({
    longitude: String(longitude),
    latitude: String(latitude),
  });

  const subthemeKey = options?.subthemeKey ?? 'coverage_lclu';
  const legendId = options?.legendId ?? 'default';

  if (subthemeKey) params.set('subthemeKey', subthemeKey);
  if (legendId) params.set('legendId', legendId);

  const data = await fetchMapBiomas<any>(`/brazil/maps/pixel-history?${params.toString()}`);

  if (Array.isArray(data)) {
    return data as MapBiomasPixelHistoryItem[];
  }

  if (Array.isArray((data as any).history)) {
    return (data as any).history as MapBiomasPixelHistoryItem[];
  }

  if (Array.isArray((data as any).data)) {
    return (data as any).data as MapBiomasPixelHistoryItem[];
  }

  return [];
}

