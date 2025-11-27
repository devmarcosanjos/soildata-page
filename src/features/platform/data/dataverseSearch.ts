type RawMetadataField = {
  typeName?: string;
  value?: unknown;
  fields?: RawMetadataField[];
};

interface DataverseSearchResult {
  title: string;
  doi: string | null;
}

const DATAVERSE_SEARCH_BASE = 'https://soildata.mapbiomas.org/api/search';
const cache = new Map<string, Promise<DataverseSearchResult | null>>();

export async function searchDatasetInfo(datasetCode: string): Promise<DataverseSearchResult | null> {
  const normalized = datasetCode?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  const cached = cache.get(normalized);
  if (cached) {
    return cached;
  }

  const promise = (async () => {
    try {
      const url = `${DATAVERSE_SEARCH_BASE}?q=${encodeURIComponent(normalized)}&type=dataset&per_page=1`;
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) {
        console.warn('Dataverse search failed', response.status);
        return null;
      }

      const payload = await response.json();
      const item = payload?.data?.items?.[0];

      if (!item) {
        return null;
      }

      const metadataBlocks = item.metadataBlocks ?? {};
      const collectFields = (fields: RawMetadataField[] = []) =>
        fields.reduce<RawMetadataField[]>((acc, field) => {
          acc.push(field);
          if (Array.isArray(field.fields)) {
            acc.push(...collectFields(field.fields));
          }
          return acc;
        }, []);

      const allFields = Object.values(metadataBlocks)
        .flatMap((block: any) => collectFields(block.fields ?? []));

      const extractValue = (value: unknown): string | null => {
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        if (Array.isArray(value)) {
          return extractValue(value[0]);
        }
        if (value && typeof value === 'object' && 'value' in value) {
          return extractValue((value as { value: unknown }).value);
        }
        return null;
      };

      const findFieldValue = (names: string[]) => {
        const target = allFields.find((field) =>
          names.some((name) => field.typeName?.toLowerCase() === name.toLowerCase())
        );
        return target ? extractValue(target.value) : null;
      };

      const titleFromFields =
        findFieldValue(['title']) ?? findFieldValue(['datasettitle']) ?? null;
      const title = (item.title || item.name || item.dataset)?.toString().trim() || normalized;
      const globalId = typeof item.global_id === 'string' ? item.global_id.trim() : null;

      return {
        title: titleFromFields ?? title,
        doi: globalId,
      };
    } catch (error) {
      console.error('Erro na busca pelo dataset Dataverse:', error);
      return null;
    }
  })();

  cache.set(normalized, promise);
  return promise;
}
