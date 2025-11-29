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
    const url = import.meta.env.VITE_API_BASE_URL;
    if (import.meta.env.DEV) {
      console.log('🔧 [API Config] Usando VITE_API_BASE_URL:', url);
    }
    return url;
  }
  
  // Em produção (build), usa a URL de produção
  if (import.meta.env.PROD) {
    const url = 'https://api.soildata.cmob.online';
    console.log('🌐 [API Config] Ambiente: PRODUÇÃO | URL da API:', url);
    return url;
  }
  
  // Em desenvolvimento, usa localhost
  const url = 'http://localhost:3000';
  if (import.meta.env.DEV) {
    console.log('🔧 [API Config] Ambiente: DESENVOLVIMENTO | URL da API:', url);
  }
  return url;
};

export const API_BASE_URL = getApiBaseUrl();

// Validação da URL da API
function validateApiUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    // Verifica se é http ou https
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      console.error('❌ [API Config] URL inválida - deve usar http ou https:', url);
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ [API Config] Erro ao validar URL da API:', error);
    return false;
  }
}

// Validar URL ao carregar o módulo
if (!validateApiUrl(API_BASE_URL)) {
  console.warn('⚠️ [API Config] URL da API pode estar incorreta:', API_BASE_URL);
}

// Log da URL final em desenvolvimento
if (import.meta.env.DEV) {
  console.log('✅ [API Config] API_BASE_URL configurada:', API_BASE_URL);
}

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
  
  const fullUrl = `${API_BASE_URL}/${normalizedPath}`;
  
  // Validação da URL final
  try {
    new URL(fullUrl);
  } catch (error) {
    console.error('❌ [API Config] Erro ao construir URL:', fullUrl, error);
    throw new Error(`URL da API inválida: ${fullUrl}`);
  }
  
  // Log de debug em desenvolvimento
  if (import.meta.env.DEV) {
    console.log('🔗 [API Config] Construindo URL:', fullUrl);
  }
  
  return fullUrl;
}

