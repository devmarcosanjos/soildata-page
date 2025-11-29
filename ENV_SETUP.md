# Configuração de Variáveis de Ambiente

Este projeto usa variáveis de ambiente para configurar diferentes ambientes (desenvolvimento e produção).

## Estrutura de Arquivos

```
.env.example          # Template com todas as variáveis (commitado)
.env.local            # Configuração local (ignorado pelo git)
.env.production       # Configuração de produção (pode ser commitado)
```

## Frontend (ladingpage-soildata)

### Variáveis Disponíveis

- `VITE_API_BASE_URL` - URL base da API SoilData
  - Desenvolvimento: `http://localhost:3000`
  - Produção: `https://api.soildata.mapbiomas.org`

- `VITE_NODE_ENV` - Ambiente atual
  - `development` ou `production`

### Setup para Desenvolvimento

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. O arquivo `.env.local` já está configurado para desenvolvimento local.

3. Se a API estiver em outra porta, ajuste:
```bash
VITE_API_BASE_URL=http://localhost:3001
```

### Setup para Produção

1. Crie ou edite `.env.production`:
```bash
VITE_API_BASE_URL=https://api.soildata.mapbiomas.org
VITE_NODE_ENV=production
```

2. No build de produção, o Vite usa automaticamente `.env.production`:
```bash
pnpm build
```

## Backend (api-soildata)

### Variáveis Disponíveis

- `PORT` - Porta do servidor (padrão: 3000)
- `HOST` - Host do servidor (padrão: 0.0.0.0)
- `NODE_ENV` - Ambiente (`development` ou `production`)
- `SOIL_DATA_PATH` - Caminho para o arquivo `enriched-soil-data.json`

### Setup para Desenvolvimento

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. O arquivo `.env.local` já está configurado para desenvolvimento local.

### Setup para Produção

1. Crie ou edite `.env.production`:
```bash
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
SOIL_DATA_PATH=/var/www/soildata/data/enriched-soil-data.json
```

2. Para usar o arquivo de produção:
```bash
# Com dotenv-cli ou similar
NODE_ENV=production node dist/server.js

# Ou configure no servidor/PM2/Docker
```

## Ordem de Carregamento

O Vite (frontend) carrega as variáveis nesta ordem (a última sobrescreve):

1. `.env`
2. `.env.local`
3. `.env.[mode]` (ex: `.env.production`)
4. `.env.[mode].local`

**Importante:** Variáveis devem começar com `VITE_` para serem expostas ao frontend.

## Exemplos de Uso

### Desenvolvimento Local

**Frontend:**
```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000
```

**Backend:**
```bash
# .env.local
PORT=3000
NODE_ENV=development
SOIL_DATA_PATH=../ladingpage-soildata/src/data/enriched-soil-data.json
```

### Produção

**Frontend:**
```bash
# .env.production
VITE_API_BASE_URL=https://api.soildata.mapbiomas.org
VITE_NODE_ENV=production
```

**Backend:**
```bash
# .env.production
PORT=3000
NODE_ENV=production
SOIL_DATA_PATH=/var/www/soildata/data/enriched-soil-data.json
```

## Segurança

- ✅ `.env.local` está no `.gitignore` (não será commitado)
- ✅ `.env.example` pode ser commitado (apenas template)
- ⚠️ `.env.production` pode ser commitado se não tiver secrets
- 🔒 Secrets devem ser configurados no servidor/CI-CD, não em arquivos commitados

## Troubleshooting

### Variáveis não estão sendo carregadas

1. Verifique se o nome começa com `VITE_` (frontend)
2. Reinicie o servidor de desenvolvimento após mudanças
3. Verifique se o arquivo está no diretório raiz do projeto

### API não encontrada

1. Verifique se `VITE_API_BASE_URL` está configurado corretamente
2. Verifique se a API está rodando na porta especificada
3. Teste a URL manualmente: `curl http://localhost:3000/health`

