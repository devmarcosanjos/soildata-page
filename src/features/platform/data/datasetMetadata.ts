export interface SoloDatasetMetadata {
  code: string;
  title: string;
  datasetUrl: string;
}

const CLOUD_SHARE_BASE = 'https://cloud.utfpr.edu.br/index.php/s/Df6dhfzYJ1DDeso';

const datasetMetadataOverrides: Record<
  string,
  Partial<Omit<SoloDatasetMetadata, 'code'>>
> = {
  ctb0753: {
    title: 'Brazilian Soil Dataset – Amazônia (CTB0753)',
  },
};

const buildDatasetPath = (datasetCode: string) => encodeURIComponent(`/${datasetCode}`);

export function getDatasetMetadata(datasetCode: string): SoloDatasetMetadata {
  const normalized = datasetCode?.toLowerCase() ?? 'dataset';
  const overrides = datasetMetadataOverrides[normalized] ?? {};
  const encodedPath = buildDatasetPath(normalized);

  return {
    code: normalized,
    title: overrides.title ?? normalized.toUpperCase(),
    datasetUrl: overrides.datasetUrl ?? `${CLOUD_SHARE_BASE}?path=${encodedPath}`,
  };
}
