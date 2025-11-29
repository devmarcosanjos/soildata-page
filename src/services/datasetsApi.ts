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
  try {
    const { limit = 10, offset = 0, sort = 'date', order = 'desc', q = '*' } = params;
    
    const url = new URL(apiUrl('api/datasets'));
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('offset', offset.toString());
    url.searchParams.set('sort', sort);
    url.searchParams.set('order', order);
    url.searchParams.set('q', q);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Falha ao buscar datasets', response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const payload = await response.json();
    
    if (payload.success) {
      return payload as DatasetsResponse;
    }

    throw new Error('Resposta inválida da API');
  } catch (error) {
    console.error('Erro ao buscar datasets:', error);
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
  try {
    const { limit = 10, offset = 0, sort = 'date', order = 'desc' } = params;
    
    const url = new URL(apiUrl('api/datasets/search'));
    url.searchParams.set('q', query.trim());
    url.searchParams.set('limit', limit.toString());
    url.searchParams.set('offset', offset.toString());
    url.searchParams.set('sort', sort);
    url.searchParams.set('order', order);

    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.warn('Falha ao buscar datasets', response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const payload = await response.json();
    
    if (payload.success) {
      return payload as DatasetsResponse;
    }

    throw new Error('Resposta inválida da API');
  } catch (error) {
    console.error('Erro ao buscar datasets:', error);
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
      console.warn('Falha ao buscar datasets mais recentes', response.status);
      return [];
    }

    const payload = await response.json();

    // A API retorna { success: true, count: number, data: Dataset[] }
    if (payload.success && Array.isArray(payload.data)) {
      return payload.data;
    }

    return [];
  } catch (error) {
    console.error('Erro ao buscar datasets mais recentes:', error);
    return [];
  }
}

