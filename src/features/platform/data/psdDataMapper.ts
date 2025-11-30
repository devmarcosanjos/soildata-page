import type { PSDRecord } from '@/types/psdPlatform';
import type { SoloDatasetPoint } from './soloDatasets';

/**
 * Calcula logClaySand a partir das frações de argila e areia
 * logClaySand = log10(fracao_argila_gkg / fracao_areia_gkg)
 */
function calculateLogClaySand(argila: number, areia: number): number | null {
  if (argila > 0 && areia > 0) {
    const ratio = argila / areia;
    if (ratio > 0) {
      return Math.log10(ratio);
    }
  }
  return null;
}

/**
 * Calcula logSiltSand a partir das frações de silte e areia
 * logSiltSand = log10(fracao_silte_gkg / fracao_areia_gkg)
 */
function calculateLogSiltSand(silte: number, areia: number): number | null {
  if (silte > 0 && areia > 0) {
    const ratio = silte / areia;
    if (ratio > 0) {
      return Math.log10(ratio);
    }
  }
  return null;
}

/**
 * Constrói URL do dataset baseada no dataset_id
 */
function buildDatasetUrl(datasetId: string): string {
  return `https://cloud.utfpr.edu.br/index.php/s/Df6dhfzYJ1DDeso?path=%2F${datasetId}`;
}

/**
 * Mapeia um registro PSD para SoloDatasetPoint
 */
export function mapPSDRecordToSoloPoint(record: PSDRecord): SoloDatasetPoint {
  const id = `${record.dataset_id}-${record.observacao_id}-${record.camada_id}`;
  
  // Calcula profundidade média ou usa a final
  const depth = record.profundidade_final_cm > 0
    ? (record.profundidade_inicial_cm + record.profundidade_final_cm) / 2
    : record.profundidade_final_cm;
  
  // Calcula logClaySand e logSiltSand
  const logClaySand = calculateLogClaySand(
    record.fracao_argila_gkg,
    record.fracao_areia_gkg
  );
  
  const logSiltSand = calculateLogSiltSand(
    record.fracao_silte_gkg,
    record.fracao_areia_gkg
  );
  
  return {
    id,
    latitude: record.latitude_grau,
    longitude: record.longitude_grau,
    depth: depth > 0 ? depth : null,
    logClaySand,
    logSiltSand,
    datasetCode: record.dataset_id,
    state: record.estado,
    region: record.regiao,
    municipality: record.municipio,
    biome: record.biome,
    // title, doi e csvDataUri são opcionais e não estão disponíveis no PSD Platform
    datasetUrl: buildDatasetUrl(record.dataset_id),
  };
}

/**
 * Mapeia um array de registros PSD para SoloDatasetPoint[]
 */
export function mapPSDRecordsToSoloPoints(records: PSDRecord[]): SoloDatasetPoint[] {
  return records.map(mapPSDRecordToSoloPoint);
}
