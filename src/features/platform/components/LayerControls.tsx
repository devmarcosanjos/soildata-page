import { usePlatformStore } from '@/stores/platformStore';

/**
 * Componente de controles para alternar entre camadas de vector tiles
 * (Biomas, Estados, Municípios)
 */
export function LayerControls() {
  const { groupingValue, setGroupingValue } = usePlatformStore();

  const layers = [
    { id: 'biomas', label: 'Biomas', categoryId: 4 },
    { id: 'estados', label: 'Estados', categoryId: 3 },
    { id: 'municipios', label: 'Município', categoryId: 95 },
  ];

  const handleLayerChange = (layerId: string) => {
    setGroupingValue(layerId);
  };

  return (
    <div className="absolute top-4 right-4 z-[500] bg-white rounded-lg shadow-lg p-2 flex gap-2">
      {layers.map((layer) => (
        <button
          key={layer.id}
          onClick={() => handleLayerChange(layer.id)}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
            groupingValue === layer.id
              ? 'bg-emerald-600 text-white shadow-md border-2 border-emerald-600'
              : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          }`}
        >
          {layer.label}
        </button>
      ))}
    </div>
  );
}

