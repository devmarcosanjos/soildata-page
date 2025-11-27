// Tipos para as respostas da API de métricas do Dataverse

export interface MetricCount {
  count: number;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface MonthlyMetric {
  date: string; // Formato YYYY-MM
  count: number;
}

export interface DatasetBySubject {
  subject: string;
  count: number;
}

export interface DatasetByCategory {
  category: string;
  count: number;
}

export interface FileDownload {
  id: number;
  pid?: string;
  count: number;
}

export interface MonthlyFileDownload {
  date: string;
  id: number;
  pid?: string;
  count: number;
}

export interface TreeDataverse {
  id: number;
  ownerId: number;
  alias: string;
  depth: number;
  name: string;
  children?: TreeDataverse[];
}

export type MetricsResponse<T> = T;

export interface MetricsApiParams {
  parentAlias?: string;
  dataLocation?: 'local' | 'remote' | 'all';
  country?: string;
}

