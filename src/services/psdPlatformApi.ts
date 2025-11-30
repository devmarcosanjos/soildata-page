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
        'Accept': 'application/json',
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
  
  return fetchPSDPlatform<PSDPlatformResponse>(url);
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

