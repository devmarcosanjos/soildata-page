import type { Dataset } from '@/types/dataset';
import { apiUrl } from '@/lib/api-config';

export interface DatasetsQuery {
  limit?: number;
  offset?: number;
  sort?: 'date' | 'title';
  order?: 'asc' | 'desc';
  q?: string;
}

export interface DatasetsResponse {
  success: boolean;
  count: number;
  returned: number;
  pagination: {
    limit: number;
    offset: number;
  };
  data: Dataset[];
  query?: string;
}

/**
 * Busca datasets com paginação
 */
export async function getDatasets(params: DatasetsQuery = {}): Promise<DatasetsResponse> {
  const { limit = 10, offset = 0, sort = 'date', order = 'desc', q = '*' } = params;
  const url = new URL(apiUrl('api/datasets'));
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('offset', offset.toString());
  url.searchParams.set('sort', sort);
  url.searchParams.set('order', order);
  url.searchParams.set('q', q);
  
  const urlString = url.toString();

  try {
    const response = await fetch(urlString, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = `Falha ao buscar datasets: ${response.status} ${response.statusText}`;
      console.error('❌ [Datasets API]', errorMessage);
      console.error('   URL:', urlString);
      
      // Mensagens específicas para erros comuns
      if (response.status === 0 || response.status === 500) {
        console.error('   Possível problema de CORS ou servidor indisponível');
      } else if (response.status === 404) {
        console.error('   Endpoint não encontrado - verifique a URL da API');
      }
      
      throw new Error(errorMessage);
    }

    const payload = await response.json();
    
    if (payload.success) {
      return payload as DatasetsResponse;
    }

    throw new Error('Resposta inválida da API');
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('❌ [Datasets API] Erro de rede - API pode estar indisponível ou bloqueada por CORS');
      console.error('   Verifique se a API está rodando e acessível em:', urlString);
    } else {
      console.error('❌ [Datasets API] Erro ao buscar datasets:', error);
    }
    throw error;
  }
}

/**
 * Busca datasets (endpoint de busca)
 */
export async function searchDatasets(
  query: string,
  params: Omit<DatasetsQuery, 'q'> = {}
): Promise<DatasetsResponse> {
  const { limit = 10, offset = 0, sort = 'date', order = 'desc' } = params;
  const url = new URL(apiUrl('api/datasets/search'));
  url.searchParams.set('q', query.trim());
  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('offset', offset.toString());
  url.searchParams.set('sort', sort);
  url.searchParams.set('order', order);
  
  const urlString = url.toString();

  try {
    const response = await fetch(urlString, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = `Falha ao buscar datasets: ${response.status} ${response.statusText}`;
      console.error('❌ [Datasets API - Search]', errorMessage);
      console.error('   URL:', urlString);
      throw new Error(errorMessage);
    }

    const payload = await response.json();
    
    if (payload.success) {
      return payload as DatasetsResponse;
    }

    throw new Error('Resposta inválida da API');
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('❌ [Datasets API - Search] Erro de rede - API pode estar indisponível ou bloqueada por CORS');
      console.error('   Verifique se a API está rodando e acessível em:', urlString);
    } else {
      console.error('❌ [Datasets API - Search] Erro ao buscar datasets:', error);
    }
    throw error;
  }
}

/**
 * Busca os últimos N datasets
 */
export async function getLatestDatasets(limit: number = 6): Promise<Dataset[]> {
  try {
    const url = apiUrl(`api/datasets/latest?limit=${limit}`);
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = `Falha ao buscar datasets mais recentes: ${response.status} ${response.statusText}`;
      console.error('❌ [Datasets API - Latest]', errorMessage);
      console.error('   URL:', url);
      
      if (response.status === 0 || response.status === 500) {
        console.error('   Possível problema de CORS ou servidor indisponível');
      }
      
      return [];
    }

    const payload = await response.json();

    // A API retorna { success: true, count: number, data: Dataset[] }
    if (payload.success && Array.isArray(payload.data)) {
      return payload.data;
    }

    return [];
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('❌ [Datasets API - Latest] Erro de rede - API pode estar indisponível ou bloqueada por CORS');
      console.error('   Verifique se a API está rodando e acessível');
    } else {
      console.error('❌ [Datasets API - Latest] Erro ao buscar datasets mais recentes:', error);
    }
    return [];
  }
}

