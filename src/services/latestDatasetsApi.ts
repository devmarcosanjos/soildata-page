import type { Dataset } from '@/types/dataset';

const DATAVERSE_SEARCH_BASE = 'https://soildata.mapbiomas.org/api/search';

interface DataverseContact {
  name?: string;
  affiliation?: string;
}

interface DataverseItem {
  title?: string;
  name?: string;
  dataset?: string;
  global_id?: string;
  published_at?: string;
  updatedAt?: string;
  createdAt?: string;
  dateOfDeposit?: string;
  publicationDate?: string;
  description?: string;
  contacts?: DataverseContact[];
  metadataBlocks?: Record<string, {
    fields?: Array<{
      typeName?: string;
      value?: unknown;
      fields?: Array<{
        typeName?: string;
        value?: unknown;
      }>;
    }>;
  }>;
}

interface DataverseSearchResponse {
  data?: {
    items?: DataverseItem[];
  };
}

function extractValue(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (Array.isArray(value)) {
    return extractValue(value[0]);
  }
  if (value && typeof value === 'object' && 'value' in value) {
    return extractValue((value as { value: unknown }).value);
  }
  return null;
}

function findFieldValue(
  fields: Array<{ typeName?: string; value?: unknown; fields?: Array<{ typeName?: string; value?: unknown }> }>,
  names: string[]
): string | null {
  for (const field of fields) {
    if (field.typeName && names.some((name) => field.typeName?.toLowerCase() === name.toLowerCase())) {
      return extractValue(field.value);
    }
    if (field.fields) {
      const found = findFieldValue(field.fields, names);
      if (found) return found;
    }
  }
  return null;
}

function extractAuthors(item: DataverseItem): string[] {
  // Primeiro tentar usar o campo contacts da API
  if (item.contacts && Array.isArray(item.contacts) && item.contacts.length > 0) {
    return item.contacts
      .map(contact => contact.name)
      .filter((name): name is string => typeof name === 'string' && name.length > 0);
  }

  // Se não houver contacts, tentar extrair dos metadados
  const metadataBlocks = item.metadataBlocks ?? {};
  const allFields: Array<{ typeName?: string; value?: unknown; fields?: Array<{ typeName?: string; value?: unknown }> }> = [];
  
  for (const block of Object.values(metadataBlocks)) {
    if (block.fields) {
      allFields.push(...block.fields);
    }
  }

  const authorField = findFieldValue(allFields, ['author', 'authorName', 'datasetContact']);
  if (authorField) {
    return authorField.split(',').map(a => a.trim()).filter(Boolean);
  }
  
  return [];
}

function extractSummary(item: DataverseItem): string {
  // Primeiro tentar usar o campo description direto da API
  if (item.description && typeof item.description === 'string') {
    return item.description;
  }

  // Se não houver description, tentar extrair dos metadados
  const metadataBlocks = item.metadataBlocks ?? {};
  const allFields: Array<{ typeName?: string; value?: unknown; fields?: Array<{ typeName?: string; value?: unknown }> }> = [];
  
  for (const block of Object.values(metadataBlocks)) {
    if (block.fields) {
      allFields.push(...block.fields);
    }
  }

  return findFieldValue(allFields, ['dsDescription', 'description', 'abstract']) || '';
}

function formatDate(dateString: string | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    return `${year} ${month} ${day}`;
  } catch {
    return dateString;
  }
}

function generateDatasetUrl(doi: string): string {
  return `https://soildata.mapbiomas.org/dataset.xhtml?persistentId=${doi}`;
}

export async function getLatestDatasets(limit: number = 6): Promise<Dataset[]> {
  try {
    // Usar a ordenação do servidor conforme documentação do Dataverse
    // sort=date ordena por data, order=desc do mais recente para o mais antigo
    // https://guides.dataverse.org/en/5.12.1/api/search.html
    const url = `${DATAVERSE_SEARCH_BASE}?q=*&type=dataset&sort=date&order=desc&per_page=${limit}`;
    const response = await fetch(url, { 
      headers: { 
        Accept: 'application/json' 
      } 
    });

    if (!response.ok) {
      console.warn('Falha ao buscar datasets mais recentes', response.status);
      return [];
    }

    const payload: DataverseSearchResponse = await response.json();
    const items = payload?.data?.items ?? [];

    if (items.length === 0) {
      return [];
    }


    return items.map((item): Dataset => {
      const metadataBlocks = item.metadataBlocks ?? {};
      const allFields: Array<{ typeName?: string; value?: unknown; fields?: Array<{ typeName?: string; value?: unknown }> }> = [];
      
      for (const block of Object.values(metadataBlocks)) {
        if (block.fields) {
          allFields.push(...block.fields);
        }
      }

      const titleFromFields = findFieldValue(allFields, ['title', 'datasetTitle']);
      const title = titleFromFields || item.title || item.name || item.dataset || 'Dataset sem título';
      
      const globalId = typeof item.global_id === 'string' ? item.global_id.trim() : null;
      const doi = globalId ? `doi:${globalId}` : '';
      
      // Usar published_at primeiro, depois updatedAt, depois createdAt
      const dateOfDeposit = item.published_at || item.updatedAt || item.createdAt;
      const publicationDate = formatDate(dateOfDeposit);
      
      const authors = extractAuthors(item);
      const summary = extractSummary(item);
      
      const version = findFieldValue(allFields, ['version', 'datasetVersion']) || 'V1';

      return {
        title,
        authors: authors.length > 0 ? authors : ['Autor não informado'],
        publicationDate: publicationDate || 'Data não informada',
        doi,
        summary: summary || 'Descrição não disponível',
        version,
        url: globalId ? generateDatasetUrl(globalId) : '#',
      };
    });
  } catch (error) {
    console.error('Erro ao buscar datasets mais recentes:', error);
    return [];
  }
}

