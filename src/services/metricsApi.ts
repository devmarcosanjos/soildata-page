import type {
  MetricCount,
  MonthlyMetric,
  DatasetBySubject,
  DatasetByCategory,
  FileDownload,
  MonthlyFileDownload,
  TreeDataverse,
  MetricsApiParams,
  ApiResponse,
} from '@/types/metrics';

const API_BASE_URL = 'https://soildata.mapbiomas.org/api/info/metrics';

function buildUrl(endpoint: string, params?: MetricsApiParams): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  if (params) {
    if (params.parentAlias) {
      url.searchParams.set('parentAlias', params.parentAlias);
    }
    if (params.dataLocation) {
      url.searchParams.set('dataLocation', params.dataLocation);
    }
    if (params.country) {
      url.searchParams.set('country', params.country);
    }
  }
  
  return url.toString();
}

async function fetchWithCache<T>(
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
      // Para erros 4xx e 5xx, logar apenas se não for 500 (erro do servidor)
      // Erros 500 são esperados em alguns endpoints e não precisam poluir o console
      if (response.status !== 500) {
        console.warn(`HTTP error fetching ${url}: status ${response.status}`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    // A API retorna {status: "OK", data: {...}}
    // Extrair apenas o campo 'data' se existir
    const data = (responseData as ApiResponse<T>).data ?? responseData;
    
    return data as T;
  } catch (error) {
    // Não logar erros 500 (erro do servidor)
    // Erros 500 são esperados em alguns endpoints e não precisam poluir o console
    if (error instanceof Error && error.message.includes('status: 500')) {
      // Silenciosamente ignorar erros 500 - não logar nada
      throw error;
    }
    // Logar apenas outros erros (não 500)
    if (!(error instanceof Error && error.message.includes('status: 500'))) {
      console.error(`Error fetching ${url}:`, error);
    }
    throw error;
  }
}

// Métricas totais
export async function getTotalDatasets(params?: MetricsApiParams): Promise<MetricCount> {
  const url = buildUrl('/datasets', params);
  return fetchWithCache<MetricCount>(url);
}

export async function getTotalDownloads(params?: MetricsApiParams): Promise<MetricCount> {
  const url = buildUrl('/downloads', params);
  return fetchWithCache<MetricCount>(url);
}

export async function getTotalFiles(params?: MetricsApiParams): Promise<MetricCount> {
  const url = buildUrl('/files', params);
  return fetchWithCache<MetricCount>(url);
}

export async function getTotalDataverses(params?: MetricsApiParams): Promise<MetricCount> {
  const url = buildUrl('/dataverses', params);
  return fetchWithCache<MetricCount>(url);
}

// Métricas mensais
export async function getMonthlyDownloads(params?: MetricsApiParams): Promise<MonthlyMetric[]> {
  const url = buildUrl('/downloads/monthly', params);
  return fetchWithCache<MonthlyMetric[]>(url);
}

export async function getMonthlyDatasets(params?: MetricsApiParams): Promise<MonthlyMetric[]> {
  const url = buildUrl('/datasets/monthly', params);
  return fetchWithCache<MonthlyMetric[]>(url);
}

export async function getMonthlyFiles(params?: MetricsApiParams): Promise<MonthlyMetric[]> {
  const url = buildUrl('/files/monthly', params);
  return fetchWithCache<MonthlyMetric[]>(url);
}

// Métricas por período
export async function getDownloadsPastDays(days: number, params?: MetricsApiParams): Promise<MetricCount> {
  const url = buildUrl(`/downloads/pastDays/${days}`, params);
  return fetchWithCache<MetricCount>(url);
}

export async function getDatasetsPastDays(days: number, params?: MetricsApiParams): Promise<MetricCount> {
  const url = buildUrl(`/datasets/pastDays/${days}`, params);
  return fetchWithCache<MetricCount>(url);
}

// Distribuições
export async function getDatasetsBySubject(params?: MetricsApiParams): Promise<DatasetBySubject[]> {
  const url = buildUrl('/datasets/bySubject', params);
  return fetchWithCache<DatasetBySubject[]>(url);
}

export async function getDataversesByCategory(params?: MetricsApiParams): Promise<DatasetByCategory[]> {
  const url = buildUrl('/dataverses/byCategory', params);
  return fetchWithCache<DatasetByCategory[]>(url);
}

// Downloads por arquivo
// Nota: Este endpoint retorna erro 500 do servidor, então silenciosamente retornamos array vazio
export async function getFileDownloads(params?: MetricsApiParams): Promise<FileDownload[]> {
  try {
    const url = buildUrl('/filedownloads', params);
    return await fetchWithCache<FileDownload[]>(url);
  } catch {
    // Silenciosamente retornar array vazio se houver erro (especialmente 500)
    // Não logar nada para não poluir o console
    return [];
  }
}

export async function getMonthlyFileDownloads(params?: MetricsApiParams): Promise<MonthlyFileDownload[]> {
  const url = buildUrl('/filedownloads/monthly', params);
  return fetchWithCache<MonthlyFileDownload[]>(url);
}

// Árvore de dataverses
export async function getDataverseTree(params?: MetricsApiParams): Promise<TreeDataverse[]> {
  const url = buildUrl('/tree', params);
  return fetchWithCache<TreeDataverse[]>(url);
}

