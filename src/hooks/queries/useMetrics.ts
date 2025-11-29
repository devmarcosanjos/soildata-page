import { useQuery } from '@tanstack/react-query';
import {
  getTotalDatasets,
  getTotalFiles,
  getTotalDownloads,
  getMonthlyDownloads,
  getMonthlyDatasets,
  getMonthlyFiles,
  getDownloadsPastDays,
  getDatasetsPastDays,
  getDatasetsBySubject,
  getDataversesByCategory,
  getMonthlyFileDownloads,
  getDataverseTree,
} from '@/services/metricsApi';
import type { MetricsApiParams } from '@/types/metrics';
import type {
  MetricCount,
  MonthlyMetric,
  DatasetBySubject,
  DatasetByCategory,
  MonthlyFileDownload,
  TreeDataverse,
} from '@/types/metrics';

export function useTotalDatasets(params?: MetricsApiParams) {
  return useQuery<MetricCount>({
    queryKey: ['metrics', 'totalDatasets', params],
    queryFn: () => getTotalDatasets(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTotalFiles(params?: MetricsApiParams) {
  return useQuery<MetricCount>({
    queryKey: ['metrics', 'totalFiles', params],
    queryFn: () => getTotalFiles(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTotalDownloads(params?: MetricsApiParams) {
  return useQuery<MetricCount>({
    queryKey: ['metrics', 'totalDownloads', params],
    queryFn: () => getTotalDownloads(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMonthlyDownloads(params?: MetricsApiParams) {
  return useQuery<MonthlyMetric[]>({
    queryKey: ['metrics', 'monthlyDownloads', params],
    queryFn: () => getMonthlyDownloads(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMonthlyDatasets(params?: MetricsApiParams) {
  return useQuery<MonthlyMetric[]>({
    queryKey: ['metrics', 'monthlyDatasets', params],
    queryFn: () => getMonthlyDatasets(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMonthlyFiles(params?: MetricsApiParams) {
  return useQuery<MonthlyMetric[]>({
    queryKey: ['metrics', 'monthlyFiles', params],
    queryFn: () => getMonthlyFiles(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDownloadsPastDays(days: number, params?: MetricsApiParams) {
  return useQuery<MetricCount>({
    queryKey: ['metrics', 'downloadsPastDays', days, params],
    queryFn: () => getDownloadsPastDays(days, params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDatasetsPastDays(days: number, params?: MetricsApiParams) {
  return useQuery<MetricCount>({
    queryKey: ['metrics', 'datasetsPastDays', days, params],
    queryFn: () => getDatasetsPastDays(days, params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDatasetsBySubject(params?: MetricsApiParams) {
  return useQuery<DatasetBySubject[]>({
    queryKey: ['metrics', 'datasetsBySubject', params],
    queryFn: () => getDatasetsBySubject(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDataversesByCategory(params?: MetricsApiParams) {
  return useQuery<DatasetByCategory[]>({
    queryKey: ['metrics', 'dataversesByCategory', params],
    queryFn: () => getDataversesByCategory(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMonthlyFileDownloads(params?: MetricsApiParams) {
  return useQuery<MonthlyFileDownload[]>({
    queryKey: ['metrics', 'monthlyFileDownloads', params],
    queryFn: () => getMonthlyFileDownloads(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDataverseTree(params?: MetricsApiParams) {
  return useQuery<TreeDataverse[]>({
    queryKey: ['metrics', 'dataverseTree', params],
    queryFn: () => getDataverseTree(params),
    staleTime: 5 * 60 * 1000,
  });
}

