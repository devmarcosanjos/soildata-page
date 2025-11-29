/**
 * Configuração da API base URL
 * 
 * Em desenvolvimento, usa a API local (http://localhost:3000)
 * Em produção, usa https://api.soildata.cmob.online ou pode ser configurada via variável de ambiente VITE_API_BASE_URL
 * 
 * Padrão de rotas: /api/{endpoint}
 * Exemplos:
 * - /api/datasets
 * - /api/datasets/latest
 * - /api/metrics/datasets
 * - /api/soil-data
 */
const getApiBaseUrl = (): string => {
  // Se a variável de ambiente estiver definida, usa ela
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Em produção (build), usa a URL de produção
  if (import.meta.env.PROD) {
    return 'https://api.soildata.cmob.online';
  }
  
  // Em desenvolvimento, usa localhost
  return 'http://localhost:3000';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Helper para construir URLs da API
 * Garante que todas as rotas sigam o padrão /api/{endpoint}
 * 
 * @param path - Caminho do endpoint (ex: 'api/datasets' ou 'api/datasets/latest')
 * @returns URL completa (ex: 'https://api.soildata.cmob.online/api/datasets')
 * 
 * @example
 * apiUrl('api/datasets') // => 'https://api.soildata.cmob.online/api/datasets'
 * apiUrl('api/datasets/latest?limit=6') // => 'https://api.soildata.cmob.online/api/datasets/latest?limit=6'
 */
export function apiUrl(path: string): string {
  // Remove leading slash se existir para evitar duplicação
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Garante que o path começa com 'api/'
  const normalizedPath = cleanPath.startsWith('api/') 
    ? cleanPath 
    : `api/${cleanPath}`;
  
  return `${API_BASE_URL}/${normalizedPath}`;
}

