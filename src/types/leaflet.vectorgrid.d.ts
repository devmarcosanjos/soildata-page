// leaflet.vectorgrid adiciona L.vectorGrid globalmente ao Leaflet
// Este arquivo apenas declara o módulo para permitir importação
declare module 'leaflet.vectorgrid' {
  // O módulo não exporta nada diretamente, apenas estende L globalmente
}

// Estender tipos do Leaflet para incluir vectorGrid
declare module 'leaflet' {
  namespace vectorGrid {
    function protobuf(
      urlTemplate: string,
      options?: {
        vectorTileLayerStyles?: Record<string, L.PathOptions>;
        attribution?: string;
        interactive?: boolean;
        maxNativeZoom?: number;
      }
    ): L.Layer;
  }
}
