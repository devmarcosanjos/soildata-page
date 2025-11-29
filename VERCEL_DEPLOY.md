# Configuração de Deploy na Vercel

## Problema: 404 em rotas como `/pt/statistics`

Se você ainda está recebendo erro 404 após criar o `vercel.json`, siga estes passos:

## 1. Verificar Configuração do Projeto na Vercel

No painel da Vercel:

1. Vá em **Settings** → **General**
2. Verifique se:
   - **Build Command**: `pnpm build` (ou `npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install` (ou `npm install`)

## 2. Verificar se o arquivo vercel.json está na raiz

O arquivo `vercel.json` deve estar na raiz do projeto `ladingpage-soildata/`, não dentro de `src/` ou outra pasta.

```
ladingpage-soildata/
├── vercel.json  ← Aqui!
├── package.json
├── vite.config.ts
└── src/
```

## 3. Fazer Deploy

### Opção A: Deploy via Git (Recomendado)

```bash
git add vercel.json
git commit -m "fix: configura roteamento SPA para Vercel"
git push
```

A Vercel fará deploy automaticamente.

### Opção B: Deploy Manual

1. No painel da Vercel, clique em **Deployments**
2. Clique nos três pontos do último deploy
3. Selecione **Redeploy**

## 4. Verificar Build Output

Após o deploy, verifique os logs:

1. Vá em **Deployments** → Clique no último deploy
2. Verifique se o build foi bem-sucedido
3. Verifique se o diretório `dist/` foi criado corretamente

## 5. Testar

Após o deploy, teste:

- `https://soildata.cmob.online/pt/statistics`
- `https://soildata.cmob.online/es/statistics`
- `https://soildata.cmob.online/pt/data`

## Troubleshooting

### Se ainda não funcionar:

1. **Limpar cache da Vercel:**
   - Settings → General → Clear Build Cache
   - Fazer novo deploy

2. **Verificar se o index.html está no dist:**
   ```bash
   ls -la dist/index.html
   ```

3. **Verificar logs do build:**
   - No painel da Vercel, veja os logs do build
   - Procure por erros ou avisos

4. **Testar localmente:**
   ```bash
   pnpm build
   pnpm preview
   # Acesse http://localhost:4173/pt/statistics
   ```

## Configuração Alternativa (se necessário)

Se a configuração simples não funcionar, tente esta versão mais explícita:

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

