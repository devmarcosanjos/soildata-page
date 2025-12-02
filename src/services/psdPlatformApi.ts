import { apiUrl } from '@/lib/api-config';
import type { PSDQuery, PSDPlatformResponse, PSDListResponse } from '@/types/psdPlatform';

async function fetchPSDPlatform<T>(
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
        console.error('❌ [PSD Platform API]', errorMessage);
        console.error('   Possível problema de CORS ou servidor indisponível');
      } else if (response.status === 404) {
        console.warn('⚠️ [PSD Platform API]', errorMessage);
        console.warn('   Endpoint não encontrado - verifique a URL da API');
      } else {
        console.warn('⚠️ [PSD Platform API]', errorMessage);
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
      console.error(`❌ [PSD Platform API] Erro de rede ao buscar ${url}`);
      console.error('   API pode estar indisponível ou bloqueada por CORS');
      console.error('   Verifique se a API está rodando e acessível');
    } else if (error instanceof Error && !error.message.includes('status: 500')) {
      console.error(`❌ [PSD Platform API] Erro ao buscar ${url}:`, error);
    }
    throw error;
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

function buildQueryString(params: PSDQuery): string {
  const searchParams = new URLSearchParams();
  
  if (params.dataset_id) searchParams.set('dataset_id', params.dataset_id);
  if (params.ano !== undefined) searchParams.set('ano', String(params.ano));
  if (params.biome) searchParams.set('biome', params.biome);
  if (params.estado) searchParams.set('estado', params.estado);
  if (params.municipio) searchParams.set('municipio', params.municipio);
  if (params.regiao) searchParams.set('regiao', params.regiao);
  if (params.limit !== undefined) searchParams.set('limit', String(params.limit));
  if (params.offset !== undefined) searchParams.set('offset', String(params.offset));
  
  return searchParams.toString();
}

export async function getPSDPlatformData(query?: PSDQuery): Promise<PSDPlatformResponse> {
  const queryString = query ? buildQueryString(query) : '';
  const url = queryString 
    ? `${apiUrl('api/psd-platform')}?${queryString}`
    : apiUrl('api/psd-platform');
  
  return fetchPSDPlatform<PSDPlatformResponse>(url);
}

export async function getAllPSDPlatformData(query?: Omit<PSDQuery, 'limit' | 'offset'>): Promise<PSDPlatformResponse> {
  const queryString = query ? buildQueryString(query) : '';
  const url = queryString 
    ? `${apiUrl('api/psd-platform/all')}?${queryString}`
    : apiUrl('api/psd-platform/all');
  
  return fetchPSDPlatform<PSDPlatformResponse>(url);
}

export async function getPSDByBiome(
  biome: string,
  query?: Omit<PSDQuery, 'biome' | 'limit' | 'offset'>
): Promise<PSDPlatformResponse> {
  const encodedBiome = encodeURIComponent(biome);
  const queryString = query ? buildQueryString(query) : '';
  const url = queryString
    ? `${apiUrl(`api/psd-platform/biome/${encodedBiome}`)}?${queryString}`
    : apiUrl(`api/psd-platform/biome/${encodedBiome}`);
  
  return fetchPSDPlatform<PSDPlatformResponse>(url);
}

export async function getPSDByBiomePaginated(
  biome: string,
  query?: Omit<PSDQuery, 'biome'>
): Promise<PSDPlatformResponse> {
  const encodedBiome = encodeURIComponent(biome);
  const queryString = query ? buildQueryString(query) : '';
  const url = queryString
    ? `${apiUrl(`api/psd-platform/biome/${encodedBiome}/paginated`)}?${queryString}`
    : apiUrl(`api/psd-platform/biome/${encodedBiome}/paginated`);
  
  return fetchPSDPlatform<PSDPlatformResponse>(url);
}

export async function getPSDByEstado(
  estado: string,
  query?: Omit<PSDQuery, 'estado' | 'limit' | 'offset'>
): Promise<PSDPlatformResponse> {
  const encodedEstado = encodeURIComponent(estado);
  const queryString = query ? buildQueryString(query) : '';
  const url = queryString
    ? `${apiUrl(`api/psd-platform/estado/${encodedEstado}`)}?${queryString}`
    : apiUrl(`api/psd-platform/estado/${encodedEstado}`);
  
  console.log(`🌐 [PSD Platform API] Buscando estado: "${estado}" -> URL: ${url}`);
  const response = await fetchPSDPlatform<PSDPlatformResponse>(url);
  console.log(`📊 [PSD Platform API] Resposta: success=${response.success}, total=${response.data?.length || 0} registros`);
  
  return response;
}

export async function getPSDByEstadoPaginated(
  estado: string,
  query?: Omit<PSDQuery, 'estado'>
): Promise<PSDPlatformResponse> {
  const encodedEstado = encodeURIComponent(estado);
  const queryString = query ? buildQueryString(query) : '';
  const url = queryString
    ? `${apiUrl(`api/psd-platform/estado/${encodedEstado}/paginated`)}?${queryString}`
    : apiUrl(`api/psd-platform/estado/${encodedEstado}/paginated`);
  
  return fetchPSDPlatform<PSDPlatformResponse>(url);
}

export async function getPSDByMunicipio(
  municipio: string,
  query?: Omit<PSDQuery, 'municipio' | 'limit' | 'offset'>
): Promise<PSDPlatformResponse> {
  const encodedMunicipio = encodeURIComponent(municipio);
  const queryString = query ? buildQueryString(query) : '';
  const url = queryString
    ? `${apiUrl(`api/psd-platform/municipio/${encodedMunicipio}`)}?${queryString}`
    : apiUrl(`api/psd-platform/municipio/${encodedMunicipio}`);
  
  return fetchPSDPlatform<PSDPlatformResponse>(url);
}

export async function getPSDByMunicipioPaginated(
  municipio: string,
  query?: Omit<PSDQuery, 'municipio'>
): Promise<PSDPlatformResponse> {
  const encodedMunicipio = encodeURIComponent(municipio);
  const queryString = query ? buildQueryString(query) : '';
  const url = queryString
    ? `${apiUrl(`api/psd-platform/municipio/${encodedMunicipio}/paginated`)}?${queryString}`
    : apiUrl(`api/psd-platform/municipio/${encodedMunicipio}/paginated`);
  
  return fetchPSDPlatform<PSDPlatformResponse>(url);
}

export async function getPSDByRegiao(
  regiao: string,
  query?: Omit<PSDQuery, 'regiao' | 'limit' | 'offset'>
): Promise<PSDPlatformResponse> {
  const encodedRegiao = encodeURIComponent(regiao);
  const queryString = query ? buildQueryString(query) : '';
  const url = queryString
    ? `${apiUrl(`api/psd-platform/regiao/${encodedRegiao}`)}?${queryString}`
    : apiUrl(`api/psd-platform/regiao/${encodedRegiao}`);
  
  return fetchPSDPlatform<PSDPlatformResponse>(url);
}

export async function getPSDByRegiaoPaginated(
  regiao: string,
  query?: Omit<PSDQuery, 'regiao'>
): Promise<PSDPlatformResponse> {
  const encodedRegiao = encodeURIComponent(regiao);
  const queryString = query ? buildQueryString(query) : '';
  const url = queryString
    ? `${apiUrl(`api/psd-platform/regiao/${encodedRegiao}/paginated`)}?${queryString}`
    : apiUrl(`api/psd-platform/regiao/${encodedRegiao}/paginated`);
  
  return fetchPSDPlatform<PSDPlatformResponse>(url);
}

export async function getAvailableBiomes(): Promise<string[]> {
  const url = apiUrl('api/psd-platform/biomes');
  const response = await fetchPSDPlatform<PSDListResponse>(url);
  return response.biomes || [];
}

export async function getAvailableEstados(): Promise<string[]> {
  const url = apiUrl('api/psd-platform/estados');
  const response = await fetchPSDPlatform<PSDListResponse>(url);
  return response.estados || [];
}

export async function getAvailableMunicipios(): Promise<string[]> {
  const url = apiUrl('api/psd-platform/municipios');
  const response = await fetchPSDPlatform<PSDListResponse>(url);
  return response.municipios || [];
}

export async function getAvailableRegioes(): Promise<string[]> {
  const url = apiUrl('api/psd-platform/regioes');
  const response = await fetchPSDPlatform<PSDListResponse>(url);
  return response.regioes || [];
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
