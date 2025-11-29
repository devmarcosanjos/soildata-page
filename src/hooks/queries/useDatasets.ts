import { useQuery } from '@tanstack/react-query';
import { getLatestDatasets, getDatasets, searchDatasets } from '@/services/datasetsApi';
import type { Dataset } from '@/types/dataset';
import type { DatasetsQuery, DatasetsResponse } from '@/services/datasetsApi';

export function useLatestDatasets(limit: number = 6) {
  return useQuery<Dataset[]>({
    queryKey: ['datasets', 'latest', limit],
    queryFn: () => getLatestDatasets(limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useDatasets(params: DatasetsQuery = {}) {
  return useQuery<DatasetsResponse>({
    queryKey: ['datasets', 'list', params],
    queryFn: () => getDatasets(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useSearchDatasets(
  query: string,
  params: Omit<DatasetsQuery, 'q'> = {},
  enabled: boolean = true
) {
  return useQuery<DatasetsResponse>({
    queryKey: ['datasets', 'search', query, params],
    queryFn: () => searchDatasets(query, params),
    enabled: enabled && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

