import { useQuery } from '@tanstack/react-query';
import { getLatestDatasets } from '@/services/latestDatasetsApi';
import type { Dataset } from '@/types/dataset';

export function useLatestDatasets(limit: number = 6) {
  return useQuery<Dataset[]>({
    queryKey: ['datasets', 'latest', limit],
    queryFn: () => getLatestDatasets(limit),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

