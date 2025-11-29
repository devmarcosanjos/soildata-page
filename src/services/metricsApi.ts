import type {
  MetricCount,
  MonthlyMetric,
  DatasetBySubject,
  DatasetByCategory,
  FileDownload,
  MonthlyFileDownload,
  TreeDataverse,
  MetricsApiParams,
} from '@/types/metrics';
import { apiUrl } from '@/lib/api-config';

function buildUrl(endpoint: string, params?: MetricsApiParams): string {
  const url = new URL(apiUrl(`api/metrics${endpoint}`));
  
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
      if (response.status !== 500) {
        console.warn(`HTTP error fetching ${url}: status ${response.status}`);
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    // A API local retorna { success: true, data: {...} }
    if (responseData.success && responseData.data !== undefined) {
      return responseData.data as T;
    }
    
    // Fallback para formato antigo se necessário
    return responseData as T;
  } catch (error) {
    if (error instanceof Error && error.message.includes('status: 500')) {
      throw error;
    }
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
  const url = buildUrl('/monthly/downloads', params);
  return fetchWithCache<MonthlyMetric[]>(url);
}

export async function getMonthlyDatasets(params?: MetricsApiParams): Promise<MonthlyMetric[]> {
  const url = buildUrl('/monthly/datasets', params);
  return fetchWithCache<MonthlyMetric[]>(url);
}

export async function getMonthlyFiles(params?: MetricsApiParams): Promise<MonthlyMetric[]> {
  const url = buildUrl('/monthly/files', params);
  return fetchWithCache<MonthlyMetric[]>(url);
}

// Métricas por período
export async function getDownloadsPastDays(days: number, params?: MetricsApiParams): Promise<MetricCount> {
  const url = buildUrl(`/downloads/past-days/${days}`, params);
  return fetchWithCache<MetricCount>(url);
}

export async function getDatasetsPastDays(days: number, params?: MetricsApiParams): Promise<MetricCount> {
  const url = buildUrl(`/datasets/past-days/${days}`, params);
  return fetchWithCache<MetricCount>(url);
}

// Distribuições
export async function getDatasetsBySubject(params?: MetricsApiParams): Promise<DatasetBySubject[]> {
  const url = buildUrl('/datasets/by-subject', params);
  return fetchWithCache<DatasetBySubject[]>(url);
}

export async function getDataversesByCategory(params?: MetricsApiParams): Promise<DatasetByCategory[]> {
  const url = buildUrl('/dataverses/by-category', params);
  return fetchWithCache<DatasetByCategory[]>(url);
}

// Downloads por arquivo
export async function getFileDownloads(params?: MetricsApiParams): Promise<FileDownload[]> {
  try {
    const url = buildUrl('/file-downloads', params);
    return await fetchWithCache<FileDownload[]>(url);
  } catch {
    return [];
  }
}

export async function getMonthlyFileDownloads(params?: MetricsApiParams): Promise<MonthlyFileDownload[]> {
  const url = buildUrl('/monthly/file-downloads', params);
  return fetchWithCache<MonthlyFileDownload[]>(url);
}

// Árvore de dataverses
export async function getDataverseTree(params?: MetricsApiParams): Promise<TreeDataverse[]> {
  const url = buildUrl('/tree', params);
  return fetchWithCache<TreeDataverse[]>(url);
}

