import type { GranulometryRecord } from '@/types/granulometry';
import type { SoloDatasetPoint } from './soloDatasets';

/**
 * Calcula logClaySand a partir das frações de argila e areia
 * logClaySand = log10(fracao_argila / fracao_areia)
 */
function calculateLogClaySand(clayFraction: number, sandFraction: number): number | null {
  if (clayFraction > 0 && sandFraction > 0) {
    const ratio = clayFraction / sandFraction;
    if (ratio > 0) {
      return Math.log10(ratio);
    }
  }
  return null;
}

/**
 * Calcula logSiltSand a partir das frações de silte e areia
 * logSiltSand = log10(fracao_silte / fracao_areia)
 */
function calculateLogSiltSand(siltFraction: number, sandFraction: number): number | null {
  if (siltFraction > 0 && sandFraction > 0) {
    const ratio = siltFraction / sandFraction;
    if (ratio > 0) {
      return Math.log10(ratio);
    }
  }
  return null;
}

/**
 * Constrói URL do dataset baseada no datasetId
 */
function buildDatasetUrl(datasetId: string): string {
  return `https://cloud.utfpr.edu.br/index.php/s/Df6dhfzYJ1DDeso?path=%2F${datasetId}`;
}

/**
 * Mapeia um registro de granulometria para SoloDatasetPoint
 */
export function mapGranulometryRecordToSoloPoint(record: GranulometryRecord): SoloDatasetPoint {
  const id = `${record.datasetId}-${record.observationId}-${record.layerId}`;
  
  // Calcula profundidade média
  const depth = record.depthFinal > 0
    ? (record.depthInitial + record.depthFinal) / 2
    : record.depthFinal;
  
  // Calcula logClaySand e logSiltSand
  // As frações na API estão em g/kg, então precisamos converter para a mesma unidade
  // Assumindo que as frações já estão na mesma unidade (g/kg)
  const logClaySand = calculateLogClaySand(
    record.clayFraction,
    record.sandFraction
  );
  
  const logSiltSand = calculateLogSiltSand(
    record.siltFraction,
    record.sandFraction
  );
  
  return {
    id,
    latitude: record.latitude,
    longitude: record.longitude,
    depth: depth > 0 ? depth : null,
    logClaySand,
    logSiltSand,
    datasetCode: record.datasetId,
    state: record.state,
    region: record.region,
    municipality: record.municipality,
    biome: record.biome,
    // title, doi e csvDataUri são opcionais e não estão disponíveis nos dados de granulometria
    datasetUrl: buildDatasetUrl(record.datasetId),
  };
}

/**
 * Mapeia um array de registros de granulometria para SoloDatasetPoint[]
 */
export function mapGranulometryRecordsToSoloPoints(records: GranulometryRecord[]): SoloDatasetPoint[] {
  if (!Array.isArray(records) || records.length === 0) {
    console.warn('⚠️ [Granulometry Mapper] Nenhum registro para mapear');
    return [];
  }
  
  console.log(`🔄 [Granulometry Mapper] Mapeando ${records.length} registros...`);
  const points = records.map(mapGranulometryRecordToSoloPoint);
  
  // Validar pontos mapeados
  const validPoints = points.filter(p => p.latitude && p.longitude);
  const invalidPoints = points.length - validPoints.length;
  
  if (invalidPoints > 0) {
    console.warn(`⚠️ [Granulometry Mapper] ${invalidPoints} pontos inválidos (sem coordenadas)`);
  }
  
  console.log(`✅ [Granulometry Mapper] ${validPoints.length} pontos válidos mapeados`);
  
  if (validPoints.length > 0) {
    console.log(`📍 [Granulometry Mapper] Primeiro ponto:`, {
      id: validPoints[0].id,
      lat: validPoints[0].latitude,
      lng: validPoints[0].longitude,
      biome: validPoints[0].biome,
      state: validPoints[0].state,
    });
  }
  
  return validPoints;
}

