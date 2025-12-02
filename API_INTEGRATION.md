# Integração com API Local

O frontend foi configurado para consumir a API local do SoilData ao invés de fazer chamadas diretas ao Dataverse.

## Configuração

### Variáveis de Ambiente

A URL base da API pode ser configurada através da variável de ambiente `VITE_API_BASE_URL`.

**Desenvolvimento:**
```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# O arquivo .env.local já está configurado para localhost:3000
# Se precisar ajustar, edite .env.local
```

**Produção:**
```bash
# Edite ou crie .env.production
VITE_API_BASE_URL=https://api.soildata.cmob.online
VITE_NODE_ENV=production
```

Para mais detalhes, veja [ENV_SETUP.md](./ENV_SETUP.md)

### Arquivos Atualizados

1. **`src/lib/api-config.ts`** - Configuração da URL base da API
2. **`src/services/latestDatasetsApi.ts`** - Agora usa `/api/datasets/latest`
3. **`src/services/metricsApi.ts`** - Agora usa `/api/metrics/*`
4. **`src/services/granulometryApi.ts`** - Serviço para endpoints de granulometria
5. **`src/features/platform/data/soloDatasets.ts`** - Agora usa `/api/granulometry`

## Como Usar

### 1. Iniciar a API

No diretório `api-soildata`:
```bash
cd ../api-soildata
pnpm install
pnpm dev
```

A API estará rodando em `http://localhost:3000`

### 2. Iniciar o Frontend

No diretório `ladingpage-soildata`:
```bash
pnpm dev
```

O frontend automaticamente usará a API local em `http://localhost:3000`

## Endpoints Utilizados

### Datasets
- `GET /api/datasets` - Lista datasets com paginação (padrão: 10 por página)
- `GET /api/datasets/latest?limit=6` - Últimos datasets
- `GET /api/datasets/search?q=query` - Busca datasets

### Métricas
- `GET /api/metrics/datasets` - Total de datasets
- `GET /api/metrics/downloads` - Total de downloads
- `GET /api/metrics/files` - Total de arquivos
- `GET /api/metrics/monthly/*` - Métricas mensais
- E mais...

### Granulometria
- `GET /api/granulometry` - Lista dados de granulometria com filtros opcionais
  - Parâmetros de query: `biome`, `state`, `region`, `municipality`, `datasetId`, `layerId`, `limit`, `offset`, `sortBy`, `sortOrder`, e filtros de profundidade, coordenadas e frações
- `GET /api/granulometry/summary` - Resumo/estatísticas de granulometria
- `GET /api/granulometry/filters` - Lista filtros disponíveis (biomas, estados, regiões, municípios, datasets, camadas)
- `GET /api/granulometry/fractions` - Análise de frações (clay, silt, sand, coarse)
  - Parâmetros: `fraction` (obrigatório), `biome`, `region`, `state`, `municipality`, `limit`, `offset`

## Fallback

O `soloDatasets.ts` agora usa os endpoints de granulometria. Se a API não estiver disponível, os erros serão tratados e o usuário será notificado.

## Troubleshooting

### CORS Errors

Se você encontrar erros de CORS, verifique se:
1. A API está rodando na porta 3000
2. O CORS está configurado corretamente na API (já está por padrão)

### API não encontrada

Se a API não estiver disponível:
- Verifique se a API está rodando: `curl http://localhost:3000/health`
- Verifique a variável `VITE_API_BASE_URL` se estiver usando uma URL customizada

