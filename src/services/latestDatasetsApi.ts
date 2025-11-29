import type { Dataset } from '@/types/dataset';
import { apiUrl } from '@/lib/api-config';

export async function getLatestDatasets(limit: number = 6): Promise<Dataset[]> {
  try {
    const url = apiUrl(`api/datasets/latest?limit=${limit}`);
    const response = await fetch(url, { 
      headers: { 
        Accept: 'application/json' 
      } 
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

