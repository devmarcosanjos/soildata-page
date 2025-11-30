export interface PSDRecord {
  dataset_id: string;
  observacao_id: string;
  longitude_grau: number;
  latitude_grau: number;
  ano: number;
  camada_id: number;
  profundidade_inicial_cm: number;
  profundidade_final_cm: number;
  fracao_grossa_gkg: number;
  fracao_argila_gkg: number;
  fracao_silte_gkg: number;
  fracao_areia_gkg: number;
  biome: string | null;
  estado: string | null;
  municipio: string | null;
  regiao: string | null;
}

export interface PSDQuery {
  dataset_id?: string;
  ano?: number;
  biome?: string;
  estado?: string;
  municipio?: string;
  regiao?: string;
  limit?: number;
  offset?: number;
}

export interface PSDPlatformResponse {
  success: boolean;
  total: number;
  returned?: number;
  pagination?: {
    limit: number;
    offset: number;
  };
  filters?: {
    dataset_id?: string | null;
    ano?: number | null;
    biome?: string | null;
    estado?: string | null;
    municipio?: string | null;
    regiao?: string | null;
    sigla?: string | null;
  };
  data: PSDRecord[];
  biome?: string;
  estado?: string;
  sigla?: string;
  municipio?: string;
  regiao?: string;
}

export interface PSDListResponse {
  success: boolean;
  biomes?: string[];
  estados?: string[];
  municipios?: string[];
  regioes?: string[];
  total: number;
}

