// Local GeoJSON data imports
// This improves performance by avoiding external HTTP requests

import brazilStatesData from './geojson/brazil-states.json';
import brazilBiomesData from './geojson/brazil-biomes.json';

// Country data is in the states file, we'll extract Brazil
const getBrazilFromCountries = () => {
  // For now, we'll use a simplified Brazil outline
  return {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { name: "Brasil", NAME: "Brasil" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-73.9, -33.8], [-73.9, 5.3], [-34.8, 5.3], [-34.8, -33.8], [-73.9, -33.8]
        ]]
      }
    }]
  };
};

export const getCountryGeoJson = () => getBrazilFromCountries();
export const getStatesGeoJson = () => brazilStatesData;
export const getBiomesGeoJson = () => brazilBiomesData;

// Lazy load municipalities only when needed (21.5MB file)
export const getMunicipalitiesGeoJson = async () => {
  const data = await import('./geojson/brazil-municipalities.json');
  return data.default;
};
