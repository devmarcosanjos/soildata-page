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
    
    // Validação crítica: em produção, se o site está em HTTPS, a API também deve ser HTTPS
    if (import.meta.env.PROD && typeof window !== 'undefined') {
      try {
        const parsedUrl = new URL(url);
        const isHttps = window.location.protocol === 'https:';
        const isApiHttp = parsedUrl.protocol === 'http:';
        
        if (isHttps && isApiHttp) {
          console.error('❌ [API Config] ERRO CRÍTICO: Site em HTTPS mas API em HTTP!');
          console.error('   URL configurada:', url);
          console.error('   Isso causará erro de Mixed Content e será bloqueado pelo navegador.');
          console.error('   Use HTTPS para a API em produção: https://api.soildata.cmob.online');
          
          // Força o uso de HTTPS mesmo se configurado HTTP
          parsedUrl.protocol = 'https:';
          const correctedUrl = parsedUrl.toString();
          console.warn('⚠️ [API Config] Corrigindo automaticamente para HTTPS:', correctedUrl);
          return correctedUrl;
        }
      } catch {
        // Ignora erros de parsing de URL
      }
    }
    
    // Validação adicional: em produção, sempre preferir HTTPS
    if (import.meta.env.PROD) {
      try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol === 'http:') {
          console.warn('⚠️ [API Config] URL HTTP detectada em produção:', url);
          console.warn('   Recomendado usar HTTPS: https://api.soildata.cmob.online');
        }
      } catch {
        // Ignora erros de parsing
      }
    }
    
    if (import.meta.env.DEV) {
      console.log('🔧 [API Config] Usando VITE_API_BASE_URL:', url);
    } else if (import.meta.env.PROD) {
      console.log('🌐 [API Config] Ambiente: PRODUÇÃO | Usando VITE_API_BASE_URL:', url);
    }
    return url;
  }
  
  // Em produção (build), usa a URL de produção
  if (import.meta.env.PROD) {
    const url = 'https://api.soildata.cmob.online';
    console.log('🌐 [API Config] Ambiente: PRODUÇÃO | URL da API (padrão):', url);
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

// Log da URL final
if (import.meta.env.DEV) {
  console.log('✅ [API Config] API_BASE_URL configurada:', API_BASE_URL);
} else if (import.meta.env.PROD && typeof window !== 'undefined') {
  // Log em produção também para facilitar diagnóstico
  console.log('✅ [API Config] API_BASE_URL configurada (PRODUÇÃO):', API_BASE_URL);
  
  // Verificação adicional de Mixed Content
  try {
    const parsedUrl = new URL(API_BASE_URL);
    const isHttps = window.location.protocol === 'https:';
    const isApiHttp = parsedUrl.protocol === 'http:';
    
    if (isHttps && isApiHttp) {
      console.error('❌ [API Config] AVISO: Mixed Content detectado!');
      console.error('   Site:', window.location.href);
      console.error('   API:', API_BASE_URL);
      console.error('   O navegador bloqueará requisições HTTP de um site HTTPS.');
    }
      } catch {
        // Ignora erros de validação aqui
      }
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

