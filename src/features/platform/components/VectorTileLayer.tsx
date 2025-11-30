import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface VectorTileLayerProps {
  divisionCategoryId: number;
  style?: {
    weight?: number;
    color?: string;
    fill?: boolean;
    fillColor?: string;
    fillOpacity?: number;
  };
  attribution?: string;
  interactive?: boolean;
  maxNativeZoom?: number;
}

/**
 * Componente para adicionar Vector Tiles do MapBiomas ao mapa Leaflet
 * Usa leaflet.vectorgrid para carregar tiles MVT sob demanda
 */
export function VectorTileLayer({
  divisionCategoryId,
  style = {
    weight: 1,
    color: '#00ff00',
    fill: false,
  },
  attribution = '&copy; <a href="https://mapbiomas.org">MapBiomas</a>',
  interactive = true,
  maxNativeZoom = 14,
}: VectorTileLayerProps) {
  const map = useMap();
  const layerRef = useRef<any>(null);

  useEffect(() => {
    // Import leaflet.vectorgrid dinamicamente
    // O plugin adiciona L.vectorGrid globalmente ao Leaflet
    import('leaflet.vectorgrid').then(() => {
      // Remove camada anterior se existir
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }

      // Verifica se L.vectorGrid está disponível (adicionado globalmente pelo plugin)
      const vectorGrid = (L as any).vectorGrid;
      if (!vectorGrid || !vectorGrid.protobuf) {
        console.error('leaflet.vectorgrid não está disponível. L.vectorGrid:', vectorGrid);
        return;
      }

      // Cria nova camada com o divisionCategoryId
      const urlTemplate = `https://prd.plataforma.mapbiomas.org/api/v1/brazil/territories/tiles/{z}/{x}/{y}.mvt?divisionCategoryId=${divisionCategoryId}`;
      
      const layer = vectorGrid.protobuf(urlTemplate, {
        vectorTileLayerStyles: {
          default: style,
        },
        attribution,
        interactive,
        maxNativeZoom,
      });

      layer.addTo(map);
      layerRef.current = layer;
    }).catch((error) => {
      console.error('Erro ao carregar leaflet.vectorgrid:', error);
    });

    // Cleanup: remove camada quando componente desmonta ou divisionCategoryId muda
    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, divisionCategoryId, style, attribution, interactive, maxNativeZoom]);

  return null;
}

