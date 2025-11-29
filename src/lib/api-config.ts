/**
 * Configuração da API base URL
 * 
 * Em desenvolvimento, usa a API local (http://localhost:3000)
 * Em produção, pode ser configurada via variável de ambiente VITE_API_BASE_URL
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Helper para construir URLs da API
 */
export function apiUrl(path: string): string {
  // Remove leading slash se existir para evitar duplicação
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}

