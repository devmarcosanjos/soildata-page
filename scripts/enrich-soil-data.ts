#!/usr/bin/env tsx

/**
 * Data Enrichment Script
 * 
 * This script pre-computes an enriched dataset from the source CSV file.
 * It adds geographic classifications (country, state, municipality, biome),
 * fetches DOI metadata, and generates URLs for each point.
 * 
 * Usage: npm run enrich-data
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore - Turf.js has export issues, using any type
import { point as turfPoint } from '@turf/helpers';
// @ts-ignore - Turf.js has export issues, using any type
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_CSV = path.join(PROJECT_ROOT, 'src/data/soil-particle-size-distribution-0-30-cm-percentage.csv');
const OUTPUT_JSON = path.join(PROJECT_ROOT, 'src/data/enriched-soil-data.json');
const GEOJSON_DIR = path.join(PROJECT_ROOT, 'src/features/platform/data/geojson');

// GeoJSON file paths
const STATES_GEOJSON = path.join(GEOJSON_DIR, 'brazil-states.json');
const BIOMES_GEOJSON = path.join(GEOJSON_DIR, 'brazil-biomes.json');
const MUNICIPALITIES_GEOJSON = path.join(GEOJSON_DIR, 'brazil-municipalities.json');

// Dataverse API
const DATAVERSE_SEARCH_BASE = 'https://soildata.mapbiomas.org/api/search';
const CLOUD_SHARE_BASE = 'https://cloud.utfpr.edu.br/index.php/s/Df6dhfzYJ1DDeso';

// Types - Optimized with shorter field names
interface SourcePoint {
  id: string;
  longitude: number;
  latitude: number;
  depth: number | null;
  logClaySand: number | null;
  logSiltSand: number | null;
  datasetCode: string;
}

// Compact enriched point with shortened field names
interface EnrichedPoint {
  id: string;
  lon: number;  // shortened from longitude
  lat: number;  // shortened from latitude
  d: number | null;  // depth
  lcs: number | null;  // logClaySand
  lss: number | null;  // logSiltSand
  dc: string;  // datasetCode
  st: string | null;  // state
  mu: string | null;  // municipality
  bi: string | null;  // biome
  ti: string;  // title
  doi: string | null;
  url: string;  // datasetUrl
  csv: string;  // csvDataUri
}

interface GeoJSONFeature {
  type: string;
  properties?: {
    NAME?: string;
    name?: string;
    NM_ESTADO?: string;
    NM_MUN?: string;
    Bioma?: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

interface GeoJSONData {
  type: string;
  features: GeoJSONFeature[];
}

// Utility functions
function toNumberOrNull(value: string | undefined): number | null {
  if (value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function createPointCsvDataUri(
  pointId: string,
  longitude: number,
  latitude: number,
  depth: number | null,
  logClaySand: number | null,
  logSiltSand: number | null,
): string {
  const formatValue = (value: number | null) => (value === null ? '' : value);
  const header = 'point_id,longitude,latitude,depth,log_clay_sand,log_silt_sand';
  const row = [
    pointId,
    longitude,
    latitude,
    formatValue(depth),
    formatValue(logClaySand),
    formatValue(logSiltSand),
  ].join(',');
  return `data:text/csv;charset=utf-8,${encodeURIComponent(`${header}\n${row}`)}`;
}

// Parse CSV
async function parseSourceCSV(): Promise<SourcePoint[]> {
  console.log('📖 Reading source CSV...');
  const csvContent = await fs.readFile(SOURCE_CSV, 'utf-8');
  const rows = csvContent.trim().split(/\r?\n/).slice(1); // Skip header

  const points: SourcePoint[] = [];
  for (const line of rows) {
    if (!line.trim()) continue;

    const [id, longitude, latitude, depth, logClaySand, logSiltSand] = line.split(',');
    const lon = Number(longitude);
    const lat = Number(latitude);

    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;

    const datasetCode = (id.split('-')[0] ?? id).toLowerCase();

    points.push({
      id,
      longitude: lon,
      latitude: lat,
      depth: toNumberOrNull(depth),
      logClaySand: toNumberOrNull(logClaySand),
      logSiltSand: toNumberOrNull(logSiltSand),
      datasetCode,
    });
  }

  console.log(`✅ Parsed ${points.length} points from CSV`);
  return points;
}

// Load GeoJSON files
async function loadGeoJSON(filePath: string): Promise<GeoJSONData | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`⚠️  Failed to load ${path.basename(filePath)}:`, error);
    return null;
  }
}

// Classify point geographically
function classifyPoint(
  lon: number,
  lat: number,
  statesData: GeoJSONData | null,
  biomesData: GeoJSONData | null,
  municipalitiesData: GeoJSONData | null,
): { state: string | null; municipality: string | null; biome: string | null } {
  const point = turfPoint([lon, lat]);
  let state: string | null = null;
  let municipality: string | null = null;
  let biome: string | null = null;

  // Check states
  if (statesData?.features) {
    for (const feature of statesData.features) {
      if (feature.geometry && booleanPointInPolygon(point, feature as any)) {
        state = feature.properties?.NAME || feature.properties?.name || feature.properties?.NM_ESTADO || null;
        break;
      }
    }
  }

  // Check municipalities
  if (municipalitiesData?.features) {
    for (const feature of municipalitiesData.features) {
      if (feature.geometry && booleanPointInPolygon(point, feature as any)) {
        municipality = feature.properties?.NM_MUN || feature.properties?.name || null;
        break;
      }
    }
  }

  // Check biomes
  if (biomesData?.features) {
    for (const feature of biomesData.features) {
      if (feature.geometry && booleanPointInPolygon(point, feature as any)) {
        biome = feature.properties?.Bioma || feature.properties?.name || null;
        break;
      }
    }
  }

  return { state, municipality, biome };
}

// Fetch DOI metadata from Dataverse
const doiCache = new Map<string, { title: string; doi: string | null }>();

async function fetchDOIMetadata(datasetCode: string): Promise<{ title: string; doi: string | null }> {
  const normalized = datasetCode.trim().toLowerCase();

  // Check cache
  if (doiCache.has(normalized)) {
    return doiCache.get(normalized)!;
  }

  try {
    const url = `${DATAVERSE_SEARCH_BASE}?q=${encodeURIComponent(normalized)}&type=dataset&per_page=1`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const item = payload?.data?.items?.[0];

    if (!item) {
      const fallback = { title: normalized.toUpperCase(), doi: null };
      doiCache.set(normalized, fallback);
      return fallback;
    }

    const title = (item.title || item.name || normalized).toString().trim();
    const doi = typeof item.global_id === 'string' ? item.global_id.trim() : null;

    const result = { title, doi };
    doiCache.set(normalized, result);
    return result;
  } catch (error) {
    console.warn(`⚠️  Failed to fetch DOI for ${datasetCode}:`, error);
    const fallback = { title: normalized.toUpperCase(), doi: null };
    doiCache.set(normalized, fallback);
    return fallback;
  }
}

// Build dataset URL
function buildDatasetUrl(datasetCode: string): string {
  const encodedPath = encodeURIComponent(`/${datasetCode.toLowerCase()}`);
  return `${CLOUD_SHARE_BASE}?path=${encodedPath}`;
}

// Main enrichment process
async function enrichData() {
  console.log('🚀 Starting data enrichment process...\n');

  // Load source data
  const sourcePoints = await parseSourceCSV();

  // Load GeoJSON boundaries
  console.log('\n📍 Loading GeoJSON boundaries...');
  const [statesData, biomesData, municipalitiesData] = await Promise.all([
    loadGeoJSON(STATES_GEOJSON),
    loadGeoJSON(BIOMES_GEOJSON),
    loadGeoJSON(MUNICIPALITIES_GEOJSON),
  ]);

  // Get unique dataset codes
  const uniqueDatasetCodes = [...new Set(sourcePoints.map(p => p.datasetCode))];
  console.log(`\n🔍 Found ${uniqueDatasetCodes.length} unique dataset codes`);

  // Fetch DOI metadata for all unique codes
  console.log('📡 Fetching DOI metadata...');
  for (let i = 0; i < uniqueDatasetCodes.length; i++) {
    const code = uniqueDatasetCodes[i];
    await fetchDOIMetadata(code);
    if ((i + 1) % 10 === 0 || i === uniqueDatasetCodes.length - 1) {
      console.log(`   Progress: ${i + 1}/${uniqueDatasetCodes.length}`);
    }
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Enrich points
  console.log('\n🌍 Enriching points with geographic data...');
  const enrichedPoints: EnrichedPoint[] = [];
  
  for (let i = 0; i < sourcePoints.length; i++) {
    const point = sourcePoints[i];
    
    // Geographic classification
    const { state, municipality, biome } = classifyPoint(
      point.longitude,
      point.latitude,
      statesData,
      biomesData,
      municipalitiesData,
    );

    // Get metadata
    const metadata = doiCache.get(point.datasetCode) || { title: point.datasetCode.toUpperCase(), doi: null };

    // Create enriched point with compact field names
    enrichedPoints.push({
      id: point.id,
      lon: point.longitude,
      lat: point.latitude,
      d: point.depth,
      lcs: point.logClaySand,
      lss: point.logSiltSand,
      dc: point.datasetCode,
      st: state,
      mu: municipality,
      bi: biome,
      ti: metadata.title,
      doi: metadata.doi,
      url: buildDatasetUrl(point.datasetCode),
      csv: createPointCsvDataUri(
        point.id,
        point.longitude,
        point.latitude,
        point.depth,
        point.logClaySand,
        point.logSiltSand,
      ),
    });

    if ((i + 1) % 5000 === 0 || i === sourcePoints.length - 1) {
      console.log(`   Progress: ${i + 1}/${sourcePoints.length}`);
    }
  }

  // Create output
  const output = {
    metadata: {
      generatedAt: new Date().toISOString(),
      sourceFile: 'soil-particle-size-distribution-0-30-cm-percentage.csv',
      totalPoints: enrichedPoints.length,
      uniqueDatasets: uniqueDatasetCodes.length,
      version: 2, // Version 2 with compact field names
    },
    points: enrichedPoints,
  };

  // Write to file (compact JSON, no pretty-printing)
  console.log('\n💾 Writing enriched data to file...');
  await fs.writeFile(OUTPUT_JSON, JSON.stringify(output), 'utf-8');

  console.log(`\n✅ Enrichment complete!`);
  console.log(`   Output: ${OUTPUT_JSON}`);
  console.log(`   Total points: ${enrichedPoints.length}`);
  console.log(`   File size: ${(JSON.stringify(output).length / 1024 / 1024).toFixed(2)} MB`);
}

// Run
enrichData().catch(error => {
  console.error('❌ Enrichment failed:', error);
  process.exit(1);
});
