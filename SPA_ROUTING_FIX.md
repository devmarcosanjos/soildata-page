# Correção de Roteamento SPA - Páginas 404 em Produção

## Problema

Ao acessar rotas como `/pt/statistics` ou `/es/statistics` diretamente no navegador, a aplicação retorna erro 404 (página não encontrada).

## Causa

O servidor está tentando encontrar um arquivo físico no caminho `/pt/statistics`, mas como é uma SPA (Single Page Application), todas as rotas devem ser servidas pelo `index.html` para que o React Router possa gerenciar o roteamento.

## Solução para Vercel

A Vercel requer um arquivo `vercel.json` na raiz do projeto para configurar o roteamento SPA.

### Arquivo vercel.json

O arquivo `vercel.json` já foi criado na raiz do projeto com a seguinte configuração:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### O que faz

- **rewrites**: Redireciona todas as rotas (`(.*)`) para `/index.html`, permitindo que o React Router gerencie o roteamento
- **headers**: Configura cache para assets estáticos (JS, CSS, imagens, fontes) para melhor performance

### Passos para Aplicar

1. **O arquivo `vercel.json` já está criado** na raiz do projeto `ladingpage-soildata/`

2. **Faça commit e push:**

```bash
git add vercel.json
git commit -m "fix: adiciona configuração de roteamento SPA para Vercel"
git push
```

3. **A Vercel detectará automaticamente** o arquivo e aplicará a configuração no próximo deploy

4. **Ou faça um novo deploy manualmente** no painel da Vercel

### Verificação

Após o deploy, teste:

```bash
curl -I https://soildata.cmob.online/pt/statistics
```

Deve retornar `200 OK` ao invés de `404 Not Found`.

### Nota sobre Nginx (se migrar no futuro)

Se você migrar para um servidor próprio com Nginx, use a configuração em `nginx.conf.example`.

