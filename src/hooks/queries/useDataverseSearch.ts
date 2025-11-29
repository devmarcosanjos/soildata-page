import { useQuery } from '@tanstack/react-query';
import { searchDatasetInfo } from '@/features/platform/data/dataverseSearch';

interface DataverseSearchResult {
  title: string;
  doi: string | null;
}

export function useDataverseSearch(datasetCode: string | null) {
  return useQuery<DataverseSearchResult | null>({
    queryKey: ['dataverseSearch', datasetCode],
    queryFn: () => (datasetCode ? searchDatasetInfo(datasetCode) : Promise.resolve(null)),
    enabled: !!datasetCode && datasetCode.trim().length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutos - dados de busca mudam menos frequentemente
  });
}

