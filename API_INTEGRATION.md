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
4. **`src/features/platform/data/soloDatasets.ts`** - Agora busca de `/api/soil-data`

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

### Dados de Solo
- `GET /api/soil-data` - Lista pontos de solo (com filtros opcionais)

## Fallback

O `soloDatasets.ts` tem um fallback automático: se a API não estiver disponível, ele tenta carregar o JSON local como antes. Isso garante que o frontend continue funcionando mesmo sem a API.

## Troubleshooting

### CORS Errors

Se você encontrar erros de CORS, verifique se:
1. A API está rodando na porta 3000
2. O CORS está configurado corretamente na API (já está por padrão)

### API não encontrada

Se a API não estiver disponível:
- Verifique se a API está rodando: `curl http://localhost:3000/health`
- Verifique a variável `VITE_API_BASE_URL` se estiver usando uma URL customizada

